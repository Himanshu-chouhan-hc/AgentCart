import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import prisma from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { addressSchema } from "../validators/address.validator.js";

// GET ALL ADDRESSES
export const getAddresses = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction
  ) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: [
        {
          isDefault: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    res.json({
      success: true,
      data: {
        addresses,
      },
    });
  }
);

// CREATE ADDRESS
export const createAddress = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction
  ) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const parsed = addressSchema.parse(req.body);

    if (parsed.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: req.user.id,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const address = await prisma.address.create({
      data: {
        fullName: parsed.fullName,
        phone: parsed.phone,
        addressLine1: parsed.addressLine1,
        addressLine2: parsed.addressLine2 ?? null,
        city: parsed.city,
        state: parsed.state,
        postalCode: parsed.postalCode,
        country: parsed.country,
        isDefault: parsed.isDefault,

        user: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        address,
      },
    });
  }
);

// UPDATE ADDRESS
export const updateAddress = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction
  ) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      throw new ApiError(400, "Invalid address ID");
    }

    const parsed = addressSchema.parse(req.body);

    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingAddress) {
      throw new ApiError(404, "Address not found");
    }

    if (parsed.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: req.user.id,
          id: {
            not: id,
          },
        },
        data: {
          isDefault: false,
        },
      });
    }

    const address = await prisma.address.update({
      where: {
        id,
      },
      data: {
        fullName: parsed.fullName,
        phone: parsed.phone,
        addressLine1: parsed.addressLine1,
        addressLine2: parsed.addressLine2 ?? null,
        city: parsed.city,
        state: parsed.state,
        postalCode: parsed.postalCode,
        country: parsed.country,
        isDefault: parsed.isDefault,
      },
    });

    res.json({
      success: true,
      data: {
        address,
      },
    });
  }
);

// DELETE ADDRESS
export const deleteAddress = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction
  ) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      throw new ApiError(400, "Invalid address ID");
    }

    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingAddress) {
      throw new ApiError(404, "Address not found");
    }

    await prisma.address.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  }
);

// SET DEFAULT ADDRESS
export const setDefaultAddress = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction
  ) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      throw new ApiError(400, "Invalid address ID");
    }

    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingAddress) {
      throw new ApiError(404, "Address not found");
    }

    await prisma.address.updateMany({
      where: {
        userId: req.user.id,
      },
      data: {
        isDefault: false,
      },
    });

    const address = await prisma.address.update({
      where: {
        id,
      },
      data: {
        isDefault: true,
      },
    });

    res.json({
      success: true,
      data: {
        address,
      },
    });
  }
);