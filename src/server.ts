import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import routes from './routes';

export function startServer() {
  const app: Express = express();
  const prisma = new PrismaClient();
  const port: number = parseInt(process.env.PORT || '3001', 10);

  // Middlewares
  app.use(cors()); // Permite requisições de outros domínios (ex.: React)
  app.use(express.json()); // Parseia corpos JSON

  // Rotas
  app.use('/', routes);

  // Endpoint de teste
  app.get('/', (req: Request, res: Response) => {
    res.send('API de Finanças Pessoais rodando!');
  });

  // Tratamento de erros global
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
  });

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}