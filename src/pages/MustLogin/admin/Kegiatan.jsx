import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineEditCalendar, MdAutoDelete } from "react-icons/md";
import { FaFileDownload } from "react-icons/fa";
import axios from "axios";
import AddKegiatan from "../../../components/modal/AddKegiatan";

export default function KegiatanList() {
  const [kegiatan, setKegiatan] = useState([]);
  const [kegiatanDesa, setKegiatanDesa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [villages, setVillages] = useState([]); // State untuk data desa
  const [loadingVillages, setLoadingVillages] = useState(false); // Loading state untuk desa
  const [form, setForm] = useState({
    kegiatan: "",
    tanggal: "",
    waktu_mulai: "",
    waktu_selesai: "",
    tingkat: "",
    id_desa: "",
  });

  // Fungsi untuk mengambil data desa
  const getVillages = async () => {
    setLoadingVillages(true); // Set loading menjadi true saat memulai request
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/desa`
      );
      setVillages(response.data);
    } catch (error) {
      console.error("Error fetching villages:", error);
    } finally {
      setLoadingVillages(false); // Set loading menjadi false setelah data diterima
    }
  };

  const getKegiatanDaerah = async () => {
    setLoading(true); // Set loading menjadi true saat memulai request
    try {
      const response = await axios.get(
        "http://localhost:5000/api/kegiatan/daerah"
      );
      if (response.data.success) {
        setKegiatan(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading menjadi false setelah data diterima
    }
  };
  const getKegiatanDesa = async () => {
    setLoading(true); // Set loading menjadi true saat memulai request
    try {
      const response = await axios.get(
        "http://localhost:5000/api/kegiatan/desa"
      );
      if (response.data.success) {
        setKegiatanDesa(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading menjadi false setelah data diterima
    }
  };

  const handleAddData = () => {
    getKegiatanDaerah();
    getKegiatanDesa();
  };
  useEffect(() => {
    getKegiatanDaerah();
    getKegiatanDesa();
    getVillages();
  }, []);

  const formatTime = (timeString) => {
    return timeString.slice(0, 5); // Hanya ambil HH:MM
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", form); // Debugging

    try {
      const response = await fetch("http://localhost:5000/api/kegiatan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      console.log("Response Data:", data); // Debugging

      if (response.ok) {
        setKegiatan([
          ...kegiatan,
          { ...form, id: data.id, qr_code: data.qr_code },
        ]);
      } else {
        alert("Gagal menambahkan kegiatan: " + data.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const downloadImageHD = async (url, filename) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Hindari masalah CORS
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set ukuran HD (misalnya 1024x1024)
      canvas.width = 1024;
      canvas.height = 1024;

      // Gambar ulang dengan kualitas tinggi
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Simpan sebagai PNG
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

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
      {/* kegiatan daerah */}
      <ul className="list card text-black dark:text-white rounded-box shadow-md p-4">
        <li className="pb-2 text-lg tracking-wide text-black dark:text-white">
          Kegiatan Daerah
        </li>
        {kegiatan.map((item) => (
          <div
            className="border-b-2 border-gray-200/50 dark:border-b-1 dark:border-gray-500/20 py-4"
            key={item.id}
          >
            <li className="flex flex-col md:flex-row justify-between items-center rounded-none gap-4">
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
                  <div className="text-md text-gray-500 dark:text-gray-400">
                    {formatDate(item.tanggal)}
                  </div>
                  <p className="text-md text-gray-500 dark:text-gray-400">
                    {formatTime(item.waktu_mulai)} -{" "}
                    {formatTime(item.waktu_selesai)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 w-full md:w-auto justify-end">
                <Link
                  to={`/kehadiran/${item.uuid}`}
                  className="btn btn-primary text-white px-3 py-1 rounded-md"
                >
                  Lihat Kehadiran
                </Link>

                <button className="btn btn-square btn-ghost">
                  <MdOutlineEditCalendar className="size-5 md:size-6" />
                </button>
                <button className="btn btn-square btn-ghost">
                  <MdAutoDelete className="size-5 md:size-6" />
                </button>
              </div>
            </li>
            <button
              onClick={() =>
                downloadImage(item.qr_code, `QR-${item.kegiatan}.png`)
              }
              className="bg-[#007bff] p-2 rounded-md text-white flex items-center cursor-pointer text-xs md:text-sm"
            >
              <FaFileDownload className="mr-2 size-4 md:size-5" /> QR Code
            </button>
          </div>
        ))}
      </ul>

      {/* kegiatan desa */}
      <ul className="list card text-black dark:text-white rounded-box shadow-md p-4 mt-4">
        <li className="pb-2 text-lg tracking-wide text-black dark:text-white">
          Kegiatan Desa
        </li>
        {kegiatanDesa.map((desa) => (
          <li
            className="flex flex-col md:flex-row justify-between items-center py-4 border-b-2 border-gray-200/50 dark:border-b-1 dark:border-gray-500/20 rounded-none gap-4"
            key={desa.id}
          >
            <div className="flex items-center gap-4 w-full md:w-auto">
              <img
                className="w-26 h-26 rounded-box"
                src={desa.qr_code}
                alt="QR Code"
              />
              <div className="flex flex-col gap-1">
                <div className="font-medium  text-sm md:text-xl">
                  {desa.kegiatan}{" "}
                  <span className="text-[12px]">{desa.desa}</span>
                </div>
                <div className="text-md text-gray-500 dark:text-gray-400">
                  {formatDate(desa.tanggal)}
                </div>
                <p className="text-md text-gray-500 dark:text-gray-400">
                  {formatTime(desa.waktu_mulai)} -{" "}
                  {formatTime(desa.waktu_selesai)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 w-full md:w-auto justify-end">
              <Link
                to={`/kehadiran/${desa.uuid}`}
                className="btn btn-primary text-white px-3 py-1 rounded-md"
              >
                Lihat Kehadiran
              </Link>
              <button
                onClick={() =>
                  downloadImage(desa.qr_code, `QR-${desa.kegiatan}.png`)
                }
                className="btn btn-square btn-ghost "
              >
                <FaFileDownload className="size-4 md:size-5" />
              </button>

              <button className="btn btn-square btn-ghost">
                <MdOutlineEditCalendar className="size-5 md:size-6" />
              </button>
              <button className="btn btn-square btn-ghost">
                <MdAutoDelete className="size-5 md:size-6" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

// import { useEffect, useState } from "react";
// import { MdOutlineEditCalendar, MdAutoDelete } from "react-icons/md";
// import { FaFileDownload } from "react-icons/fa";
// import axios from "axios";
// import AddKegiatan from "../../../components/modal/AddKegiatan";

// export default function KegiatanList() {
//   const [kegiatan, setKegiatan] = useState([]);
//   const [kegiatanDesa, setKegiatanDesa] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [villages, setVillages] = useState([]); // State untuk data desa
//   const [loadingVillages, setLoadingVillages] = useState(false); // Loading state untuk desa
//   const [form, setForm] = useState({
//     kegiatan: "",
//     tanggal: "",
//     waktu_mulai: "",
//     waktu_selesai: "",
//     tingkat: "",
//     id_desa: "",
//   });

//   // Fungsi untuk mengambil data desa
//   const getVillages = async () => {
//     setLoadingVillages(true); // Set loading menjadi true saat memulai request
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/desa`
//       );
//       setVillages(response.data);
//     } catch (error) {
//       console.error("Error fetching villages:", error);
//     } finally {
//       setLoadingVillages(false); // Set loading menjadi false setelah data diterima
//     }
//   };

//   const getKegiatanDaerah = async () => {
//     setLoading(true); // Set loading menjadi true saat memulai request
//     try {
//       const response = await axios.get(
//         "http://localhost:5000/api/kegiatan/daerah"
//       );
//       if (response.data.success) {
//         setKegiatan(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false); // Set loading menjadi false setelah data diterima
//     }
//   };
//   const getKegiatanDesa = async () => {
//     setLoading(true); // Set loading menjadi true saat memulai request
//     try {
//       const response = await axios.get(
//         "http://localhost:5000/api/kegiatan/desa"
//       );
//       if (response.data.success) {
//         setKegiatanDesa(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false); // Set loading menjadi false setelah data diterima
//     }
//   };

//   const handleAddData = () => {
//     getKegiatanDaerah();
//     getKegiatanDesa();
//   };
//   useEffect(() => {
//     getKegiatanDaerah();
//     getKegiatanDesa();
//     getVillages();
//   }, []);

//   const formatTime = (timeString) => {
//     return timeString.slice(0, 5); // Hanya ambil HH:MM
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("id-ID", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     }).format(date);
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form Data:", form); // Debugging

//     try {
//       const response = await fetch("http://localhost:5000/api/kegiatan", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await response.json();
//       console.log("Response Data:", data); // Debugging

//       if (response.ok) {
//         setKegiatan([
//           ...kegiatan,
//           { ...form, id: data.id, qr_code: data.qr_code },
//         ]);
//       } else {
//         alert("Gagal menambahkan kegiatan: " + data.message);
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     }
//   };

//   const downloadImageHD = async (url, filename) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous"; // Hindari masalah CORS
//     img.src = url;

//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");

//       // Set ukuran HD (misalnya 1024x1024)
//       canvas.width = 1024;
//       canvas.height = 1024;

//       // Gambar ulang dengan kualitas tinggi
//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//       // Simpan sebagai PNG
//       const link = document.createElement("a");
//       link.href = canvas.toDataURL("image/png");
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     };
//   };

//   const downloadImage = (url, filename) => {
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <>
//       <div className="container mx-auto p-4 text-black">
//         <h1 className="text-2xl font-bold mb-4">Daftar Kegiatan</h1>
//       </div>
//       <div className="flex justify-end mb-3">
//         <AddKegiatan onAddData={handleAddData} />
//       </div>
//       {/* kegiatan daerah */}
//       <ul className="list card text-black dark:text-white rounded-box shadow-md p-4">
//         <li className="pb-2 text-lg tracking-wide text-black dark:text-white">
//           Kegiatan Daerah
//         </li>
//         {kegiatan.map((item) => (
//           <li
//             className="flex flex-col md:flex-row justify-between items-center py-4 border-b-2 border-gray-200/50 dark:border-b-1 dark:border-gray-500/20 rounded-none gap-4"
//             key={item.id}
//           >
//             <div className="flex items-center gap-4 w-full md:w-auto">
//               <img
//                 className="w-26 h-26 rounded-box"
//                 src={item.qr_code}
//                 alt="QR Code"
//               />
//               <div className="flex flex-col gap-1">
//                 <div className="font-medium text-sm md:text-xl">
//                   {item.kegiatan}
//                 </div>
//                 <div className="text-md text-gray-500 dark:text-gray-400">
//                   {formatDate(item.tanggal)}
//                 </div>
//                 <p className="text-md text-gray-500 dark:text-gray-400">
//                   {formatTime(item.waktu_mulai)} -{" "}
//                   {formatTime(item.waktu_selesai)}
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-2 sm:gap-3 w-full md:w-auto justify-end">
//               <button
//                 onClick={() =>
//                   downloadImage(item.qr_code, `QR-${item.kegiatan}.png`)
//                 }
//                 className="bg-[#007bff] p-1 rounded-md text-white flex items-center cursor-pointer text-xs md:text-sm"
//               >
//                 <FaFileDownload className="mr-2 size-4 md:size-5" /> Download QR
//                 Code
//               </button>

//               <button className="btn btn-square btn-ghost">
//                 <MdOutlineEditCalendar className="size-5 md:size-6" />
//               </button>
//               <button className="btn btn-square btn-ghost">
//                 <MdAutoDelete className="size-5 md:size-6" />
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {/* kegiatan desa */}
//       <ul className="list card text-black dark:text-white rounded-box shadow-md p-4 mt-4">
//         <li className="pb-2 text-lg tracking-wide text-black dark:text-white">
//           Kegiatan Desa
//         </li>
//         {kegiatanDesa.map((desa) => (
//           <li
//             className="flex flex-col md:flex-row justify-between items-center py-4 border-b-2 border-gray-200/50 dark:border-b-1 dark:border-gray-500/20 rounded-none gap-4"
//             key={desa.id}
//           >
//             <div className="flex items-center gap-4 w-full md:w-auto">
//               <img
//                 className="w-26 h-26 rounded-box"
//                 src={desa.qr_code}
//                 alt="QR Code"
//               />
//               <div className="flex flex-col gap-1">
//                 <div className="font-medium text-sm md:text-xl">
//                   {desa.kegiatan}
//                 </div>
//                 <div className="text-md text-gray-500 dark:text-gray-400">
//                   {formatDate(desa.tanggal)}
//                 </div>
//                 <p className="text-md text-gray-500 dark:text-gray-400">
//                   {formatTime(desa.waktu_mulai)} -{" "}
//                   {formatTime(desa.waktu_selesai)}
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-2 sm:gap-3 w-full md:w-auto justify-end">
//               <button
//                 onClick={() =>
//                   downloadImage(desa.qr_code, `QR-${desa.kegiatan}.png`)
//                 }
//                 className="bg-[#007bff] p-1 rounded-md text-white flex items-center cursor-pointer text-xs md:text-sm"
//               >
//                 <FaFileDownload className="mr-2 size-4 md:size-5" /> Download QR
//                 Code
//               </button>

//               <button className="btn btn-square btn-ghost">
//                 <MdOutlineEditCalendar className="size-5 md:size-6" />
//               </button>
//               <button className="btn btn-square btn-ghost">
//                 <MdAutoDelete className="size-5 md:size-6" />
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }
