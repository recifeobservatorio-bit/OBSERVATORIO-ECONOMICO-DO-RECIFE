import { parquetRead } from "hyparquet";
import { compressors } from "hyparquet-compressors";

const res = await fetch("http://localhost:8080/data/empresas_inativas.parquet");
const buf = await res.arrayBuffer();

const rows = await new Promise((resolve, reject) => {
  parquetRead({ file: buf, rowFormat: "object", compressors, onComplete: resolve });
});

let mesNullEncerrNull = 0, mesNullEncerrNotNull = 0, mesNotNullEncerrNull = 0, mesNotNullEncerrNotNull = 0;
let mesMatchesEncerramento = 0, mesMismatch = 0;
for (const r of rows) {
  const mesNull = r.mes === null || r.mes === undefined;
  const encerrNull = r.data_encerramento === null || r.data_encerramento === undefined;
  if (mesNull && encerrNull) mesNullEncerrNull++;
  else if (mesNull && !encerrNull) mesNullEncerrNotNull++;
  else if (!mesNull && encerrNull) mesNotNullEncerrNull++;
  else {
    mesNotNullEncerrNotNull++;
    const mesEncerr = new Date(r.data_encerramento).getMonth() + 1;
    if (Number(r.mes) === mesEncerr) mesMatchesEncerramento++;
    else mesMismatch++;
  }
}
console.log({ mesNullEncerrNull, mesNullEncerrNotNull, mesNotNullEncerrNull, mesNotNullEncerrNotNull, mesMatchesEncerramento, mesMismatch });
