import { PrismaClient, Account } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateAccountInput {
  name: string;
  balance?: number;
  userId: number;
}

interface AccountError extends Error {
  status?: number;
}

export async function createAccount(data: CreateAccountInput): Promise<Account> {
  try {
    const account = await prisma.account.create({
      data: { name: data.name, balance: data.balance || 0.0, userId: data.userId }
    });
    return account;
  } catch (error: any) {
    if (error.code === 'P2003') {
      const err: AccountError = new Error('Usuário não encontrado');
      err.status = 400;
      throw err;
    }
    throw error;
  }
}

export async function getAccounts(): Promise<Account[]> {
  return prisma.account.findMany({
    include: { user: true, transactions: true }
  });
}

export async function getAccountById(id: number): Promise<Account> {
  const account = await prisma.account.findUnique({
    where: { id },
    include: { user: true, transactions: true }
  });
  if (!account) {
    const error: AccountError = new Error('Conta não encontrada');
    error.status = 404;
    throw error;
  }
  return account;
}

export async function updateAccount(id: number, data: Partial<CreateAccountInput>): Promise<Account> {
  try {
    const account = await prisma.account.update({
      where: { id },
      data
    });
    return account;
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: AccountError = new Error('Conta não encontrada');
      err.status = 404;
      throw err;
    } else if (error.code === 'P2003') {
      const err: AccountError = new Error('Usuário não encontrado');
      err.status = 400;
      throw err;
    }
    throw error;
  }
}

export async function deleteAccount(id: number): Promise<void> {
  try {
    await prisma.account.delete({
      where: { id }
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: AccountError = new Error('Conta não encontrada');
      err.status = 404;
      throw err;
    }
    throw error;
  }
}