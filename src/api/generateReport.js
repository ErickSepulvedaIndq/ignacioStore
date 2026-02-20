import axios from "axios";

export const generateReport = async (month, year) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/buylogs/reports/monthly/${month}/${year}`,
    {
      responseType: "blob",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    },
  );

  return response;
};