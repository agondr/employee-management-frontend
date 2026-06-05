import { logout } from "../store/authSlice";

export const apiFetch = async (url, options = {}, dispatch) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (response.status === 401) {
    dispatch(logout());
    throw new Error("Session expired");
  }

  if (response.status === 403) {
    throw new Error("Access denied");
  }

  const newToken = response.headers.get("x-new-token");
  if (newToken) {
    localStorage.setItem("token", newToken);
  }

  if (response.status === 404) {
    throw new Error("Not found");
  }

  if (!response.ok) {
    let errorMessage = "API request failed";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // response nuk ishte JSON
    }

    throw new Error(errorMessage);
  }

  return await response.json();
};
