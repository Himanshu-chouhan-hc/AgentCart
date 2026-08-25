const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

type AddressInput = Omit<Address, 'id' | 'createdAt' | 'updatedAt'> & { isDefault: boolean };

const getAuthHeaders = () => {
  const token = localStorage.getItem("agentcart_token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const normalizeAddresses = (payload: any): Address[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data?.addresses)) return payload.data.addresses;
  if (Array.isArray(payload?.addresses)) return payload.addresses;
  return [];
};

export const getAddresses = async (): Promise<Address[]> => {
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload && "message" in payload && payload.message
        ? payload.message
        : "Failed to fetch addresses"
    );
  }

  return normalizeAddresses(payload);
};

export const createAddress = async (address: AddressInput): Promise<Address> => {
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(address),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload && "message" in payload && payload.message
        ? payload.message
        : "Failed to create address"
    );
  }

  return payload.data.address;
};

export const updateAddress = async (id: string, address: AddressInput): Promise<Address> => {
  const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(address),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload && "message" in payload && payload.message
        ? payload.message
        : "Failed to update address"
    );
  }

  return payload.data.address;
};

export const deleteAddress = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload && "message" in payload && payload.message
        ? payload.message
        : "Failed to delete address"
    );
  }
};

export const setDefaultAddress = async (id: string): Promise<Address> => {
  const response = await fetch(`${API_BASE_URL}/addresses/${id}/default`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload && "message" in payload && payload.message
        ? payload.message
        : "Failed to set default address"
    );
  }

  return payload.data.address;
};