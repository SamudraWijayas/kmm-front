import { useEffect, useState } from "react";

const useFetchUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Mengirim cookie HttpOnly ke backend
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          setError(data.msg || "Gagal mengambil data user.");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

export default useFetchUser;
