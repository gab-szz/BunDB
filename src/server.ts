// server.ts

import { TxtDB } from './database/db.ts';
import { openapi } from './openapi.ts';

async function main() {
  const db = new TxtDB();
  await db.inicializar();

  const server = Bun.serve({
    port: 2321,
    routes: {
      '/status': { GET: () => Response.json({ status: 'OK' }) },
      '/openapi.json': { GET: () => Response.json(openapi) },
    },
  });

  console.log(`Servidor iniciado em ${server.url}`);
}

await main();
