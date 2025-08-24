import { PrismaClient, IncomeSource } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateIncomeSourceInput {
  type: string;
  amount: number;
  frequency?: string;
  description?: string;
  userId: number;
}

interface IncomeSourceError extends Error {
  status?: number;
}

export async function createIncomeSource(data: CreateIncomeSourceInput): Promise<IncomeSource> {
  try {
    const incomeSource = await prisma.incomeSource.create({
      data
    });
    return incomeSource;
  } catch (error: any) {
    if (error.code === 'P2003') {
      const err: IncomeSourceError = new Error('Usuário não encontrado');
      err.status = 400;
      throw err;
    }
    throw error;
  }
}

export async function getIncomeSources(): Promise<IncomeSource[]> {
  return prisma.incomeSource.findMany({
    include: { user: true }
  });
}

export async function getIncomeSourceById(id: number): Promise<IncomeSource> {
  const incomeSource = await prisma.incomeSource.findUnique({
    where: { id },
    include: { user: true }
  });
  if (!incomeSource) {
    const error: IncomeSourceError = new Error('Fonte de renda não encontrada');
    error.status = 404;
    throw error;
  }
  return incomeSource;
}

export async function updateIncomeSource(id: number, data: Partial<CreateIncomeSourceInput>): Promise<IncomeSource> {
  try {
    const incomeSource = await prisma.incomeSource.update({
      where: { id },
      data
    });
    return incomeSource;
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: IncomeSourceError = new Error('Fonte de renda não encontrada');
      err.status = 404;
      throw err;
    } else if (error.code === 'P2003') {
      const err: IncomeSourceError = new Error('Usuário não encontrado');
      err.status = 400;
      throw err;
    }
    throw error;
  }
}

export async function deleteIncomeSource(id: number): Promise<void> {
  try {
    await prisma.incomeSource.delete({
      where: { id }
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: IncomeSourceError = new Error('Fonte de renda não encontrada');
      err.status = 404;
      throw err;
    }
    throw error;
  }
}