import { Request, Response, NextFunction } from 'express';
   import jwt from 'jsonwebtoken';

   interface AuthRequest extends Request {
     user?: { id: number; email: string };
   }

   export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
     const token = req.headers.authorization?.split(' ')[1];
     if (!token) {
       return res.status(401).json({ error: 'Token não fornecido' });
     }
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey') as { id: number; email: string };
       req.user = decoded;
       next();
     } catch (error) {
       res.status(401).json({ error: 'Token inválido' });
     }
   }