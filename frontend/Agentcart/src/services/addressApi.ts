const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface AddressInput {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Address extends AddressInput {
  id: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

const getAuthHeaders = (): Record<string, string> => {
  // Aapke project mein jis bhi naam se token save hota ho, unhe yahan check kiya gaya hai
  const token =
    localStorage.getItem("agentcart_token") ||
    localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token missing. Please login again.");
  }

  const formattedToken = token.startsWith("Bearer ")
    ? token
    : `Bearer ${token}`;

  return {
    "Content-Type": "application/json",
    Authorization: formattedToken,
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message || "Something went wrong."
    );
  }

  return payload?.data as T;
};

export const getAddresses = async (): Promise<Address[]> => {
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse<{ addresses: Address[] }>(response);
  return data.addresses || [];
};

export const createAddress = async (
  data: AddressInput
): Promise<Address> => {
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await handleResponse<{ address: Address }>(response);
  return result.address;
};

export const updateAddress = async (
  id: string,
  data: AddressInput
): Promise<Address> => {
  const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await handleResponse<{ address: Address }>(response);
  return result.address;
};

export const deleteAddress = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  await handleResponse(response);
};

export const setDefaultAddress = async (id: string): Promise<Address> => {
  const response = await fetch(`${API_BASE_URL}/addresses/${id}/default`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  const result = await handleResponse<{ address: Address }>(response);
  return result.address;
};