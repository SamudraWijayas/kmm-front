import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:5000/", // Sesuaikan dengan URL backend Anda
});

// Fungsi untuk mendapatkan token dari cookies
export const getAccessToken = () => Cookies.get("accessToken");

// Interceptor untuk menyisipkan token di setiap request
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk menangani token kadaluarsa (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Token kadaluarsa, harap login kembali");

      // Hapus token dari cookies
      Cookies.remove("accessToken");
      Cookies.remove("role");

      // Redirect ke halaman login
      window.location.href = "/login"; // Jika tidak pakai React Router
    }
    return Promise.reject(error);
  }
);

export default api;
