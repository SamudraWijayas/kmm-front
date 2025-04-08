import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineEditCalendar, MdAutoDelete } from "react-icons/md";
import { FaFileDownload } from "react-icons/fa";
import axios from "axios";
import AddKegiatan from "../../../components/modal/AddKegiatanDesa";
import useGetMe from "../../../hooks/useFetchUserData";

export default function KegiatanList() {
  const [kegiatan, setKegiatan] = useState([]);
  const [kegiatanDesa, setKegiatanDesa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [villages, setVillages] = useState([]);
  const [loadingVillages, setLoadingVillages] = useState(false);
  const { user } = useGetMe();

  const [form, setForm] = useState({
    kegiatan: "",
    tanggal: "",
    waktu_mulai: "",
    waktu_selesai: "",
    tingkat: "",
    id_desa: "",
  });

  const getVillages = async () => {
    setLoadingVillages(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/desa`
      );
      setVillages(response.data);
    } catch (error) {
      console.error("Error fetching villages:", error);
    } finally {
      setLoadingVillages(false);
    }
  };

  const getKegiatanDaerah = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/kegiatan/daerah`
      );
      if (response.data.success) {
        setKegiatan(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching kegiatan daerah:", error);
    } finally {
      setLoading(false);
    }
  };

  const getKegiatanDesa = async (id_desa) => {
    if (!id_desa) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/kegiatan/desa/${id_desa}`
      );
      if (response.data.success) {
        setKegiatanDesa(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching kegiatan desa:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getKegiatanDaerah();
    getVillages();
  }, []);

  useEffect(() => {
    if (user?.id_desa) {
      getKegiatanDesa(user.id_desa);
    }
  }, [user]);

  const handleAddData = () => {
    getKegiatanDaerah();
    if (user?.id_desa) getKegiatanDesa(user.id_desa);
  };

  const formatTime = (timeString) => timeString?.slice(0, 5) || "-";
  const formatDate = (dateString) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));

  const downloadImage = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="container mx-auto p-4 text-black">
        <h1 className="text-2xl font-bold mb-4">Daftar Kegiatan</h1>
      </div>

      <div className="flex justify-end mb-3">
        <AddKegiatan onAddData={handleAddData} />
      </div>

      {/* Kegiatan Daerah */}
      <ul className="list card text-black dark:text-white rounded-box shadow-md p-4">
        <li className="pb-2 text-lg tracking-wide">Kegiatan Daerah</li>
        {kegiatan.map((item) => (
          <div
            key={item.id}
            className="border-b-2 border-gray-200/50 dark:border-gray-500/20 py-4"
          >
            <li className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img
                  className="w-26 h-26 rounded-box"
                  src={item.qr_code}
                  alt="QR Code"
                />
                <div className="flex flex-col gap-1">
                  <div className="font-medium text-sm md:text-xl">
                    {item.kegiatan}
                  </div>
                  <div className="text-md text-gray-500">
                    {formatDate(item.tanggal)}
                  </div>
                  <p className="text-md text-gray-500">
                    {formatTime(item.waktu_mulai)} -{" "}
                    {formatTime(item.waktu_selesai)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto justify-end">
                <Link
                  to={`/kehadirann/${item.uuid}`}
                  className="btn btn-primary text-white"
                >
                  Lihat Kehadiran
                </Link>
                <button className="btn btn-square btn-ghost">
                  <MdOutlineEditCalendar className="size-6" />
                </button>
                <button className="btn btn-square btn-ghost">
                  <MdAutoDelete className="size-6" />
                </button>
              </div>
            </li>
            <button
              onClick={() =>
                downloadImage(item.qr_code, `QR-${item.kegiatan}.png`)
              }
              className="bg-blue-600 p-2 rounded-md text-white flex items-center text-xs mt-2"
            >
              <FaFileDownload className="mr-2 size-4" /> QR Code
            </button>
          </div>
        ))}
      </ul>

      {/* Kegiatan Desa */}
      <ul className="list card text-black dark:text-white rounded-box shadow-md p-4 mt-4">
        <li className="pb-2 text-lg tracking-wide">Kegiatan Desa</li>
        {kegiatanDesa.map((item) => (
          <div
            key={item.id}
            className="border-b-2 border-gray-200/50 dark:border-gray-500/20 py-4"
          >
            <li className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img
                  className="w-26 h-26 rounded-box"
                  src={item.qr_code}
                  alt="QR Code"
                />
                <div className="flex flex-col gap-1">
                  <div className="font-medium text-sm md:text-xl">
                    {item.kegiatan}{" "}
                  </div>
                  <div className="text-md text-gray-500">
                    {formatDate(item.tanggal)}
                  </div>
                  <p className="text-md text-gray-500">
                    {formatTime(item.waktu_mulai)} -{" "}
                    {formatTime(item.waktu_selesai)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto justify-end">
                <Link
                  to={`/kehadirann/${item.uuid}`}
                  className="btn btn-primary text-white"
                >
                  Lihat Kehadiran
                </Link>
                <button
                  onClick={() =>
                    downloadImage(item.qr_code, `QR-${item.kegiatan}.png`)
                  }
                  className="btn btn-square btn-ghost"
                >
                  <FaFileDownload className="size-5" />
                </button>
                <button className="btn btn-square btn-ghost">
                  <MdOutlineEditCalendar className="size-6" />
                </button>
                <button className="btn btn-square btn-ghost">
                  <MdAutoDelete className="size-6" />
                </button>
              </div>
            </li>
            <button
              onClick={() =>
                downloadImage(item.qr_code, `QR-${item.kegiatan}.png`)
              }
              className="bg-blue-600 p-2 rounded-md text-white flex items-center text-xs mt-2"
            >
              <FaFileDownload className="mr-2 size-4" /> QR Code
            </button>
          </div>
        ))}
      </ul>
    </>
  );
}
