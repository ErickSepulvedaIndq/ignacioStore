import axios from "axios";

export const authService = async (data) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, data)
    return res.data
  } catch (error) {
    throw error
  }
}