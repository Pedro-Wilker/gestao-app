import { Request, Response } from 'express';
import * as transactionService from '../services/transactions';

interface CreateTransactionInput {
  amount: number;
  description?: string;
  date?: string;
  category: string;
  userId: number;
}

export async function createTransaction(req: Request, res: Response) {
  const { amount, description, date, category, userId } = req.body as CreateTransactionInput;
  try {
    const transaction = await transactionService.createTransaction({ amount, description, date, category, userId });
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
  const { amount, description, date, category, userId } = req.body as Partial<CreateTransactionInput>;
  try {
    const transaction = await transactionService.updateTransaction(parseInt(id), {
      amount,
      description,
      date,
      category,
      userId
    });
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