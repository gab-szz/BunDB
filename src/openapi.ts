import { StatusSchema } from './schemas/status.ts';

export const openapi = {
  openapi: '3.1.0',
  info: {
    title: 'BunDB API',
    version: '1.0.0',
  },
  paths: {
    '/status': {
      get: {
        summary: 'Status do servidor',
        responses: {
          200: {
            description: 'Servidor funcionando',
            content: {
              'application/json': {
                schema: StatusSchema,
              },
            },
          },
        },
      },
    },
  },
};
