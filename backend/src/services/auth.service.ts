import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';


export const registerUser = async (name: string, email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new ApiError(409, 'User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const token = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, { expiresIn: '7d' });

  return { user: { id: user.id, name: user.name, email: user.email }, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(404, 'User not found');

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new ApiError(401, 'Invalid credentials');

  const token = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, { expiresIn: '7d' });

  return { user: { id: user.id, name: user.name, email: user.email }, token };
};

export const logoutUser = async () => {
  // Invalidate the token on the client side by clearing the cookie or local storage
  // No server-side action is needed for JWT logout

  return { message: 'Logged out successfully' };
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({ 
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true, updatedAt: true }
  });
  
  if (!user) throw new ApiError(404, 'User not found');
  
  return user;
};