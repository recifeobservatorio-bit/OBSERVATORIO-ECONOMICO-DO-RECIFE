const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.NEXT_PUBLIC_API_PORT;

async function startServer() {
  const app = next({ dev });
  const handle = app.getRequestHandler();

  try {
    await app.prepare();

    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log("Servidor iniciado.")
    });

    return server;
  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startServer().catch(console.error);
