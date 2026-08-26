const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface AddressInput {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  isDefault?: boolean;
}

export interface Address extends AddressInput {
  id: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

const getAuthHeaders = (): Record<string, string> => {
  // Checks all possible token keys in LocalStorage
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("agentcart_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("user_token");

  if (!token) {
    throw new Error("You are not logged in. Please log in first.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      payload && typeof payload === "object" && "message" in payload
        ? (payload as { message: string }).message
        : "An unexpected error occurred.";
    throw new Error(errorMessage);
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
};

export const getAddresses = async (): Promise<Address[]> => {
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const res = await handleResponse<{ addresses: Address[] } | Address[]>(response);
  if (Array.isArray(res)) return res;
  if (res && "addresses" in res && Array.isArray(res.addresses)) {
    return res.addresses;
  }
  return [];
};

export const createAddress = async (data: AddressInput): Promise<Address> => {
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const res = await handleResponse<{ address: Address } | Address>(response);
  return res && "address" in res ? res.address : (res as Address);
};