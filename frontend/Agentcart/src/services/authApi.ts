const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type AuthResponse = {
  success: boolean;
  data: {
    user: { id: string; name: string; email: string };
    token: string;
  };
};

const requestAuth = async (path: string, body: Record<string, string>) => {
  const response = await fetch(`${API_BASE_URL}/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as
    | AuthResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload && "message" in payload && payload.message
      ? payload.message
      : "Something went wrong. Please try again.");
  }

  const authResponse = payload as AuthResponse;
  
  // Save in BOTH keys so all services get the updated token
  localStorage.setItem("agentcart_token", authResponse.data.token);
  localStorage.setItem("token", authResponse.data.token);
  localStorage.setItem("agentcart_user", JSON.stringify(authResponse.data.user));
  
  return authResponse.data.user;
};

export const loginUser = (email: string, password: string) =>
  requestAuth("login", { email, password });

export const registerUser = (name: string, email: string, password: string) =>
  requestAuth("register", { name, email, password });

export const logoutUser = async () => {
  localStorage.removeItem("agentcart_token");
  localStorage.removeItem("token");
  localStorage.removeItem("agentcart_user");
  
  window.dispatchEvent(new Event("logout"));
  
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("agentcart_token") || localStorage.getItem("token");

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload && "message" in payload && payload.message
        ? payload.message
        : "Unable to fetch user profile."
    );
  }

  return payload.data.user;
};