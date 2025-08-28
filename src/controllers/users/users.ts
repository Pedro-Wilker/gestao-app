import { Request, Response } from 'express';
import * as userService from '../../services/users/users';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export async function createUser(req: Request, res: Response) {
  const { name, email, password } = req.body as CreateUserInput;
  try {
    const user = await userService.createUser({ name, email, password });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body as LoginInput;
  try {
    const token = await userService.loginUser({ email, password });
    res.json({ token });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(parseInt(id));
    res.json(user);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body as Partial<CreateUserInput>;
  try {
    const user = await userService.updateUser(parseInt(id), data);
    res.json(user);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await userService.deleteUser(parseInt(id));
    res.status(204).send();
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}