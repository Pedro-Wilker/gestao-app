import { Request, Response } from 'express';
import * as accountService from '../services/accounts';

interface AuthRequest extends Request {
  user?: { id: number };
}

interface CreateAccountInput {
  name: string;
  balance?: number;
}

export async function createAccount(req: AuthRequest, res: Response) {
  const data = req.body as CreateAccountInput;
  const userId = req.user!.id; // De middleware
  try {
    const account = await accountService.createAccount({ ...data, userId });
    res.status(201).json(account);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getAccounts(req: Request, res: Response) {
  try {
    const accounts = await accountService.getAccounts();
    res.json(accounts);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getAccountById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const account = await accountService.getAccountById(parseInt(id));
    res.json(account);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function updateAccount(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body as Partial<CreateAccountInput>;
  try {
    const account = await accountService.updateAccount(parseInt(id), data);
    res.json(account);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function deleteAccount(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await accountService.deleteAccount(parseInt(id));
    res.status(204).send();
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}