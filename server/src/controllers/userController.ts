import { Request, Response, NextFunction } from 'express'
import { AppError } from '../middleware/errorHandler'
import { ApiResponse } from '../types'

// In-memory store — replace with your DB later
interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

let users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', createdAt: new Date().toISOString() },
  { id: 2, name: 'Bob', email: 'bob@example.com', createdAt: new Date().toISOString() },
]
let nextId = 3

// GET /api/users
export const getUsers = (_req: Request, res: Response): void => {
  const response: ApiResponse<User[]> = {
    success: true,
    message: 'Users fetched successfully',
    data: users,
  }
  res.status(200).json(response)
}

// GET /api/users/:id
export const getUserById = (req: Request, res: Response, next: NextFunction): void => {
  const user = users.find((u) => u.id === Number(req.params.id))
  if (!user) return next(new AppError('User not found', 404))

  const response: ApiResponse<User> = {
    success: true,
    message: 'User fetched successfully',
    data: user,
  }
  res.status(200).json(response)
}

// POST /api/users
export const createUser = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email } = req.body

  if (!name || !email) return next(new AppError('Name and email are required', 400))

  const exists = users.find((u) => u.email === email)
  if (exists) return next(new AppError('Email already in use', 409))

  const newUser: User = { id: nextId++, name, email, createdAt: new Date().toISOString() }
  users.push(newUser)

  const response: ApiResponse<User> = {
    success: true,
    message: 'User created successfully',
    data: newUser,
  }
  res.status(201).json(response)
}

// PUT /api/users/:id
export const updateUser = (req: Request, res: Response, next: NextFunction): void => {
  const index = users.findIndex((u) => u.id === Number(req.params.id))
  if (index === -1) return next(new AppError('User not found', 404))

  const { name, email } = req.body
  users[index] = { ...users[index], ...(name && { name }), ...(email && { email }) }

  const response: ApiResponse<User> = {
    success: true,
    message: 'User updated successfully',
    data: users[index],
  }
  res.status(200).json(response)
}

// DELETE /api/users/:id
export const deleteUser = (req: Request, res: Response, next: NextFunction): void => {
  const index = users.findIndex((u) => u.id === Number(req.params.id))
  if (index === -1) return next(new AppError('User not found', 404))

  users.splice(index, 1)

  const response: ApiResponse = {
    success: true,
    message: 'User deleted successfully',
  }
  res.status(200).json(response)
}
