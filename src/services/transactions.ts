import { PrismaClient, Transaction } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateTransactionInput {
  amount: number;
  description?: string;
  date?: string;
  category: string;
  userId: number;
}

interface TransactionError extends Error {
  status?: number;
}

export async function createTransaction(data: CreateTransactionInput): Promise<Transaction> {
  if (!data.amount || !data.userId || !data.category) {
    const error: TransactionError = new Error('Amount, userId e category são obrigatórios');
    error.status = 400;
    throw error;
  }
  try {
    const transaction = await prisma.transaction.create({
      data: {
        amount: data.amount,
        description: data.description || '',
        date: data.date ? new Date(data.date) : new Date(),
        category: data.category,
        userId: data.userId
      }
    });
    return transaction;
  } catch (error: any) {
    if (error.code === 'P2003') {
      const err: TransactionError = new Error('Usuário não encontrado');
      err.status = 400;
      throw err;
    }
    throw error;
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  return prisma.transaction.findMany({
    include: { user: true }
  });
}

export async function getTransactionById(id: number): Promise<Transaction> {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: { user: true }
  });
  if (!transaction) {
    const error: TransactionError = new Error('Transação não encontrada');
    error.status = 404;
    throw error;
  }
  return transaction;
}

export async function updateTransaction(id: number, data: Partial<CreateTransactionInput>): Promise<Transaction> {
  try {
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount: data.amount,
        description: data.description,
        date: data.date ? new Date(data.date) : undefined,
        category: data.category,
        userId: data.userId
      }
    });
    return transaction;
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: TransactionError = new Error('Transação não encontrada');
      err.status = 404;
      throw err;
    } else if (error.code === 'P2003') {
      const err: TransactionError = new Error('Usuário não encontrado');
      err.status = 400;
      throw err;
    }
    throw error;
  }
}

export async function deleteTransaction(id: number): Promise<void> {
  try {
    await prisma.transaction.delete({
      where: { id }
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: TransactionError = new Error('Transação não encontrada');
      err.status = 404;
      throw err;
    }
    throw error;
  }
}