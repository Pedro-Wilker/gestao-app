import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface UserError extends Error {
  status?: number;
}

export async function createUser(data: CreateUserInput): Promise<User> {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword
      }
    });
    return user;
  } catch (error: any) {
    if (error.code === 'P2002') {
      const err: UserError = new Error('Email já existe');
      err.status = 400;
      throw err;
    }
    throw error;
  }
}

export async function loginUser(data: LoginInput): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    const err: UserError = new Error('Usuário não encontrado');
    err.status = 404;
    throw err;
  }
  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) {
    const err: UserError = new Error('Senha inválida');
    err.status = 401;
    throw err;
  }
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'mysecretkey', { expiresIn: '1h' });
  return token;
}

export async function getUsers(): Promise<User[]> {
  return prisma.user.findMany({
    include: { transactions: true, accounts: true, incomeSources: true }
  });
}

export async function getUserById(id: number): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { transactions: true, accounts: true, incomeSources: true }
  });
  if (!user) {
    const error: UserError = new Error('Usuário não encontrado');
    error.status = 404;
    throw error;
  }
  return user;
}

export async function updateUser(id: number, data: Partial<CreateUserInput>): Promise<User> {
  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.password) updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  try {
    const user = await prisma.user.update({
      where: { id },
      data: updateData
    });
    return user;
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: UserError = new Error('Usuário não encontrado');
      err.status = 404;
      throw err;
    } else if (error.code === 'P2002') {
      const err: UserError = new Error('Email já existe');
      err.status = 400;
      throw err;
    }
    throw error;
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await prisma.user.delete({
      where: { id }
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: UserError = new Error('Usuário não encontrado');
      err.status = 404;
      throw err;
    }
    throw error;
  }
}