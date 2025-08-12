import { Request, Response } from 'express';
import * as userService from '../services/users';

interface CreateUserInput {
  email: string;
  name?: string;
}

export async function createUser(req: Request, res: Response) {
  const { email, name } = req.body as CreateUserInput;
  try {
    const user = await userService.createUser({ email, name });
    res.status(201).json(user);
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
  const { email, name } = req.body as CreateUserInput;
  try {
    const user = await userService.updateUser(parseInt(id), { email, name });
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