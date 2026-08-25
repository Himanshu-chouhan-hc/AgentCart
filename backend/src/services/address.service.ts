import prisma from "../config/database.js";

export const getAddresses = async (userId: string) => {
  return prisma.address.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createAddress = async (
  userId: string,
  data: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    isDefault?: boolean;
  }
) => {
  return prisma.address.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const deleteAddress = async (
  userId: string,
  addressId: string
) => {
  return prisma.address.deleteMany({
    where: {
      id: addressId,
      userId,
    },
  });
};