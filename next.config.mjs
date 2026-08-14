import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { PHASE_PRODUCTION_BUILD } from 'next/constants.js';
import 'dotenv/config';

const FETCH_TIMEOUT_MS = 20000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_URL = process.env.NEXT_PUBLIC_API_REPO_URL;
const MANIFEST_URL = REPO_URL + 'manifest.json';
const PUBLIC_DIR = path.join(__dirname, 'public');

export async function fetchFileToPublic(filename, remoteUrl) {
  const filePath = path.join(PUBLIC_DIR, filename);

  if (fs.existsSync(filePath)) {
    console.log(`✔️ Arquivo já existe: ${filename}`);
    return;
  } else {
    const res = await fetch(remoteUrl, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`Erro ao baixar ${filename}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));
    console.log(`✅ Baixado: ${filename}`);
  }
}

export async function fetchBundles() {
  const res = await fetch(MANIFEST_URL, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Erro ao baixar manifest.json: HTTP ${res.status}`);
  const manifest = await res.json();

  await fetchFileToPublic('manifest.json', MANIFEST_URL);

  for (const bundle of Object.values(manifest)) {
    const filename = bundle.filename;
    const bundleUrl = REPO_URL + filename;
    await fetchFileToPublic(filename, bundleUrl);
  }
  
  return manifest;
}

export async function checkAndUpdateManifest() {
  try {

    const res = await fetch(MANIFEST_URL, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`Erro ao baixar manifest.json: HTTP ${res.status}`);
    const newManifest = await res.json();

    const currentManifestPath = path.join(PUBLIC_DIR, 'manifest.json');
    
    if (fs.existsSync(currentManifestPath)) {

      const currentManifest = JSON.parse(fs.readFileSync(currentManifestPath, 'utf8'));
      let needsUpdate = false;

      for (const [bundleKey, bundleInfo] of Object.entries(newManifest)) {
        const currentVersion = currentManifest[bundleKey]?.version;
        const remoteVersion = bundleInfo.version;

        if (!currentVersion || remoteVersion > currentVersion) {
          console.log(`🔺 Atualizando ${bundleKey} de versão ${currentVersion || 'inexistente'} → ${remoteVersion}`);
          const filename = bundleInfo.filename;

          const bundlePath = path.join(PUBLIC_DIR, filename);
          if (fs.existsSync(bundlePath)) {
            fs.unlinkSync(bundlePath);
            console.log(`🗑️ Apagado: ${filename}`);
          }
          
          needsUpdate = true;
        } else {
          console.log(`✔️ ${bundleKey} já está atualizado (v${remoteVersion})`);
        }
      }
      
      if (needsUpdate) {

        fs.unlinkSync(currentManifestPath);
        console.log('🗑️ Apagado: manifest.json');
        
        await fetchBundles();
        
        return { needsRestart: true };
      }
    } else {
      console.log('🔺 Manifest local não encontrado. Baixando...');
      
      await fetchBundles();
      
      return { needsRestart: false };
    }
    
    return { needsRestart: false };
  } catch (error) {
    console.error('❌ Erro ao verificar e baixar bundles:', error);
    return { needsRestart: false, error: error.message };
  }
}

function isProductionBuild() {
  return (
    process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD ||
    process.env.npm_lifecycle_event === 'build' ||
    process.env.VERCEL === '1' ||
    process.argv.includes('build')
  );
}

async function initialBuild() {
  console.log('🚀 Build inicial: Verificando bundles...');
  await fetchBundles();
}

initialBuild().catch((error) => {
  console.error('❌ Erro ao baixar manifest/bundles no build inicial:', error);
  if (isProductionBuild()) {
    console.error('❌ Abortando build de produção: sem manifest/bundles o site sobe sem dados.');
    process.exit(1);
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;