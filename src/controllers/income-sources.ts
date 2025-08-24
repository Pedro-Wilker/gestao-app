import { Request, Response } from 'express';
import * as incomeSourceService from '../services/income-sources';

interface AuthRequest extends Request {
  user?: { id: number };
}

interface CreateIncomeSourceInput {
  type: string;
  amount: number;
  frequency?: string;
  description?: string;
}

export async function createIncomeSource(req: AuthRequest, res: Response) {
  const data = req.body as CreateIncomeSourceInput;
  const userId = req.user!.id; // De middleware
  try {
    const incomeSource = await incomeSourceService.createIncomeSource({ ...data, userId });
    res.status(201).json(incomeSource);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getIncomeSources(req: Request, res: Response) {
  try {
    const incomeSources = await incomeSourceService.getIncomeSources();
    res.json(incomeSources);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getIncomeSourceById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const incomeSource = await incomeSourceService.getIncomeSourceById(parseInt(id));
    res.json(incomeSource);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function updateIncomeSource(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body as Partial<CreateIncomeSourceInput>;
  try {
    const incomeSource = await incomeSourceService.updateIncomeSource(parseInt(id), data);
    res.json(incomeSource);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function deleteIncomeSource(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await incomeSourceService.deleteIncomeSource(parseInt(id));
    res.status(204).send();
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}