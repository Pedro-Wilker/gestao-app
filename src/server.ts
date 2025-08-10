import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World - API de Finanças Pessoais com TypeScript');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});