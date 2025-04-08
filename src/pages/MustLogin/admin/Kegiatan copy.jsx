import { useEffect, useState } from "react";
import axios from "axios";

export default function KegiatanList() {
  const [kegiatan, setKegiatan] = useState([]);
  const [kegiatanDesa, setKegiatanDesa] = useState([]);
  const [villages, setVillages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    kegiatan: "",
    tanggal: "",
    waktu_mulai: "",
    waktu_selesai: "",
    tingkat: "",
    id_desa: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [kegiatanDaerahRes, kegiatanDesaRes, villagesRes] =
        await Promise.all([
          axios.get("http://localhost:5000/api/kegiatan/daerah"),
          axios.get("http://localhost:5000/api/kegiatan/desa"),
          axios.get(`${import.meta.env.VITE_API_URL}/api/desa`),
        ]);

      if (kegiatanDaerahRes.data.success)
        setKegiatan(kegiatanDaerahRes.data.data);
      if (kegiatanDesaRes.data.success)
        setKegiatanDesa(kegiatanDesaRes.data.data);
      setVillages(villagesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/kegiatan",
        form,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 201) {
        setKegiatan([
          ...kegiatan,
          { ...form, id: response.data.id, qr_code: response.data.qr_code },
        ]);
        setModalOpen(false);
        setForm({
          kegiatan: "",
          tanggal: "",
          waktu_mulai: "",
          waktu_selesai: "",
          tingkat: "",
          id_desa: "",
        });
      } else {
        alert("Gagal menambahkan kegiatan: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Daftar Kegiatan</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Tambah Kegiatan
      </button>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Tambah Kegiatan</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="kegiatan"
                placeholder="Kegiatan"
                value={form.kegiatan}
                onChange={handleChange}
                className="border p-2 w-full mb-2"
                required
              />
              <input
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
                className="border p-2 w-full mb-2"
                required
              />
              <input
                type="time"
                name="waktu_mulai"
                value={form.waktu_mulai}
                onChange={handleChange}
                className="border p-2 w-full mb-2"
                required
              />
              <input
                type="time"
                name="waktu_selesai"
                value={form.waktu_selesai}
                onChange={handleChange}
                className="border p-2 w-full mb-2"
                required
              />
              <select
                name="tingkat"
                value={form.tingkat}
                onChange={handleChange}
                className="border p-2 w-full mb-2"
                required
              >
                <option value="">Pilih Tingkat</option>
                <option value="daerah">Daerah</option>
                <option value="desa">Desa</option>
              </select>
              {form.tingkat === "desa" && (
                <select
                  name="id_desa"
                  value={form.id_desa}
                  onChange={handleChange}
                  className="border p-2 w-full mb-2"
                  required
                >
                  <option value="">Pilih Desa</option>
                  {villages.map((village) => (
                    <option key={village.uuid} value={village.uuid}>
                      {village.desa}
                    </option>
                  ))}
                </select>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
