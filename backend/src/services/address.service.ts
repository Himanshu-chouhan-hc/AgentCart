import prisma from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";

type AddressData = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
};

export const getAddresses = async (userId: string) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const createAddress = async (
  userId: string,
  data: AddressData
) => {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: {
      fullName: data.fullName,
      phone: data.phone,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country ?? "India",
      isDefault: data.isDefault ?? false,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

export const updateAddress = async (
  userId: string,
  addressId: string,
  data: AddressData
) => {
  const existingAddress = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!existingAddress) {
    throw new ApiError(404, "Address not found");
  }

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: {
        userId,
        id: {
          not: addressId,
        },
      },
      data: {
        isDefault: false,
      },
    });
  }

  return prisma.address.update({
    where: {
      id: addressId,
    },
    data: {
      fullName: data.fullName,
      phone: data.phone,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country ?? "India",
      isDefault: data.isDefault ?? false,
    },
  });
};

export const deleteAddress = async (
  userId: string,
  addressId: string
) => {
  const existingAddress = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!existingAddress) {
    throw new ApiError(404, "Address not found");
  }

  await prisma.address.delete({
    where: {
      id: addressId,
    },
  });

  return {
    success: true,
  };
};

export const setDefaultAddress = async (
  userId: string,
  addressId: string
) => {
  const existingAddress = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!existingAddress) {
    throw new ApiError(404, "Address not found");
  }

  await prisma.address.updateMany({
    where: {
      userId,
    },
    data: {
      isDefault: false,
    },
  });

  return prisma.address.update({
    where: {
      id: addressId,
    },
    data: {
      isDefault: true,
    },
  });
};