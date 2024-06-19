import axios from "axios";

const storedToken = JSON.parse(localStorage.getItem("lid") || "null");

let accessToken;

if (storedToken !== null) {
  accessToken = storedToken.k + "." + storedToken.u + "." + storedToken.y;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: accessToken ? `Bearer ${accessToken}` : null,
  },
});
