import type { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../config/database.js';
import { ApiError } from '../utils/ApiError.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { addressSchema } from '../validators/address.validator.js';

// Get all addresses for the user
export const getAddresses = asyncHandler(async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: req.user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });

  res.json({ success: true, data: { addresses } });
});

// Create a new address
export const createAddress = asyncHandler(async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const parsed = addressSchema.parse(req.body);

  // If this is set as default, unset other defaults
  if (parsed.isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      ...parsed,
      userId: req.user.id,
    },
  });

  res.status(201).json({ success: true, data: { address } });
});

// Update an address
export const updateAddress = asyncHandler(async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const id = req.params.id;

if (!id || Array.isArray(id)) {
  throw new ApiError(400, "Invalid address ID");
}
  const parsed = addressSchema.parse(req.body);

  // Verify address belongs to user
  const existingAddress = await prisma.address.findUnique({ where: { id } });
  if (!existingAddress || existingAddress.userId !== req.user.id) {
    throw new ApiError(403, 'Forbidden');
  }

  // If setting as default, unset others
  if (parsed.isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user.id, id:{not:id } },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.update({
    where: { id },
    data: parsed,
  });

  res.json({ success: true, data: { address } });
});

// Delete an address
export const deleteAddress = asyncHandler(async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

 const id = req.params.id;

if (!id || Array.isArray(id)) {
  throw new ApiError(400, "Invalid address ID");
}

  // Verify address belongs to user
  const existingAddress = await prisma.address.findUnique({ where: { id } });
  if (!existingAddress || existingAddress.userId !== req.user.id) {
    throw new ApiError(403, 'Forbidden');
  }

  await prisma.address.delete({ where: { id } });

  res.json({ success: true, message: 'Address deleted successfully' });
});

// Set default address
export const setDefaultAddress = asyncHandler(async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
const id = req.params.id;

if (!id || Array.isArray(id)) {
  throw new ApiError(400, "Invalid address ID");
}

  // Verify address belongs to user
  const existingAddress = await prisma.address.findUnique({ where: { id } });
  if (!existingAddress || existingAddress.userId !== req.user.id) {
    throw new ApiError(403, 'Forbidden');
  }

  // Unset all defaults for this user
  await prisma.address.updateMany({
    where: { userId: req.user.id },
    data: { isDefault: false },
  });

  // Set this as default
  const address = await prisma.address.update({
    where: { id },
    data: { isDefault: true },
  });

  res.json({ success: true, data: { address } });
});
