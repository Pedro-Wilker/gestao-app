import { PrismaClient, Transaction } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateTransactionInput {
  amount: number;
  description?: string;
  date?: string;
  categoryId: number;
  accountId: number;
  userId: number;
}

interface TransactionError extends Error {
  status?: number;
}

export async function createTransaction(data: CreateTransactionInput): Promise<Transaction> {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : new Date()
      }
    });
    return transaction;
  } catch (error: any) {
    if (error.code === 'P2003') {
      const err: TransactionError = new Error('ID inválido (user, category ou account)');
      err.status = 400;
      throw err;
    }
    throw error;
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  return prisma.transaction.findMany({
    include: { user: true, category: true, account: true }
  });
}

export async function getTransactionById(id: number): Promise<Transaction> {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: { user: true, category: true, account: true }
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
        ...data,
        date: data.date ? new Date(data.date) : undefined
      }
    });
    return transaction;
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: TransactionError = new Error('Transação não encontrada');
      err.status = 404;
      throw err;
    } else if (error.code === 'P2003') {
      const err: TransactionError = new Error('ID inválido (user, category ou account)');
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