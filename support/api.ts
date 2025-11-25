import axios from "axios";

export async function getUserToken(email: string, password: string) {
  const response = await axios.post("https://api.yourapp.com/login", {
    email,
    password,
  });
  return response.data.token;
}

export async function getUserProfile(token: string) {
  const response = await axios.get("https://api.yourapp.com/profile", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}
