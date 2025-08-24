import { Request, Response } from 'express';
import * as transactionService from '../services/transactions';

interface AuthRequest extends Request {
  user?: { id: number };
}

interface CreateTransactionInput {
  amount: number;
  description?: string;
  date?: string;
  categoryId: number;
  accountId: number;
}

export async function createTransaction(req: AuthRequest, res: Response) {
  const data = req.body as CreateTransactionInput;
  const userId = req.user!.id; // De middleware
  try {
    const transaction = await transactionService.createTransaction({ ...data, userId });
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getTransactions(req: Request, res: Response) {
  try {
    const transactions = await transactionService.getTransactions();
    res.json(transactions);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getTransactionById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const transaction = await transactionService.getTransactionById(parseInt(id));
    res.json(transaction);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function updateTransaction(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body as Partial<CreateTransactionInput>;
  try {
    const transaction = await transactionService.updateTransaction(parseInt(id), data);
    res.json(transaction);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function deleteTransaction(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await transactionService.deleteTransaction(parseInt(id));
    res.status(204).send();
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}