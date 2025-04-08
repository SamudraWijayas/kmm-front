import React, { useState, useEffect } from "react";
import {
  overviewData,
  recentSalesData,
  topProducts,
} from "../../../layouts/data";
import { GoPackage } from "react-icons/go";
import { message, Tabs } from "antd";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

const Generus = () => {
  const [generusData, setGenerusData] = useState([]);
  const [kelompokData, setKelompokData] = useState([]);
  const [desaData, setDesaData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [mergedData, setMergedData] = useState([]);
  const [activeTab, setActiveTab] = useState("0"); // Menggunakan string sebagai key
  const [showAgeFilter, setShowAgeFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]); // State untuk ID yang dipilih
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State untuk sidebar
  const [data, setData] = useState([]); // Data yang akan ditampilkan di tabel
  const [editData, setEditData] = useState(null); // Data yang akan diedit
  const [viewData, setViewData] = useState(null); // Data yang akan diedit
  const [isModalVisible, setIsModalVisible] = useState(false); // Kontrol visibilitas modal

  const handleFilterClick = () => {
    setShowAgeFilter(!showAgeFilter); // Toggle the display of the age filter inputs
  };

  // Menangani klik tombol edit
  const handleEditClick = async (id) => {
    // Fetch data based on id when edit button is clicked
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/generus/${id}`
      );
      setEditData(response.data); // Set the fetched data into the editData state
      setIsModalVisible(true); // Show the modal
    } catch (error) {
      console.error("Error fetching data for edit:", error);
      message.error("Gagal memuat data untuk diedit!");
    }
  };
  // Menangani klik tombol edit
  const handleViewClick = async (id) => {
    // Fetch data based on id when edit button is clicked
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/generus/${id}`
      );
      setViewData(response.data); // Set the fetched data into the editData state
      setIsModalVisible(true); // Show the modal
    } catch (error) {
      console.error("Error fetching data for edit:", error);
      message.error("Gagal memuat data untuk diedit!");
    }
  };

  // Menutup modal
  const handleModalClose = () => {
    setIsModalVisible(false); // Menutup modal
    setEditData(null); // Menghapus data edit
  };
  // Menutup modal
  const handleViewClose = () => {
    setIsModalVisible(false); // Menutup modal
    setViewData(null); // Menghapus data edit
  };

  const handleBackClick = () => {
    setShowAgeFilter(false); // Hide age filter inputs
    setMinAge(""); // Clear Min Age
    setMaxAge(""); // Clear Max Age
  };

  // Fetching data functions
  const fetchGenerus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/generus`
      );
      const formattedData = response.data.map((item) => {
        const birthdate = new Date(item.tgl_lahir);
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const monthDifference = today.getMonth() - birthdate.getMonth();

        if (
          monthDifference < 0 ||
          (monthDifference === 0 && today.getDate() < birthdate.getDate())
        ) {
          age--;
        }

        return {
          ...item,
          tgl_lahir: birthdate.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          umur: age,
        };
      });
      setGenerusData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDesa = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/desa`
      );
      setDesaData(response.data);
    } catch (error) {
      console.error("Error fetching desa data:", error);
    }
  };

  const fetchKelompok = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/kelompok`
      );
      setKelompokData(response.data);
    } catch (error) {
      console.error("Error fetching kelompok data:", error);
    }
  };

  const handleAddData = () => {
    fetchGenerus(); // Memuat ulang data setelah data baru ditambahkan
  };

  useEffect(() => {
    fetchGenerus();
    fetchDesa();
    fetchKelompok();
  }, []);

  // Fungsi untuk memetakan jenjang ke nama
  const mapJenjangq = (jenjang) => {
    if (["1", "2", "3", "4", "5", "6"].includes(jenjang)) {
      return (
        <>
          Caberawit{" "}
          <span style={{ color: "#D91656" }}>( Kelas {jenjang} )</span>
        </>
      );
    } else if (["7", "8", "9"].includes(jenjang)) {
      return (
        <>
          Pra Remaja{" "}
          <span style={{ color: "#D91656" }}>( Kelas {jenjang} )</span>
        </>
      );
    } else if (["10", "11", "12"].includes(jenjang)) {
      return (
        <>
          Remaja <span style={{ color: "#D91656" }}>( Kelas {jenjang} )</span>
        </>
      );
    } else if (jenjang === "Paud") {
      return "Paud"; // Tampilkan "Paud" langsung
    } else if (jenjang === "TK") {
      return "TK"; // Tampilkan "TK" langsung
    } else if (jenjang === "Pra Nikah") {
      return "Pra Nikah";
    }
    return "Jenjang Tidak Diketahui";
  };

  const mapJenjang = (jenjang) => {
    if (["1", "2", "3", "4", "5", "6"].includes(jenjang)) {
      return `Caberawit (Kelas ${jenjang})`;
    } else if (["7", "8", "9"].includes(jenjang)) {
      return `Pra Remaja (Kelas ${jenjang})`;
    } else if (["10", "11", "12"].includes(jenjang)) {
      return `Remaja (Kelas ${jenjang})`;
    } else if (jenjang === "Paud") {
      return "Paud";
    } else if (jenjang === "TK") {
      return "TK";
    } else if (jenjang === "Pra Nikah") {
      return "Pra Nikah";
    }
    return "Jenjang Tidak Diketahui";
  };

  // Merging data from generus, desa, and kelompok
  useEffect(() => {
    if (
      generusData.length > 0 &&
      desaData.length > 0 &&
      kelompokData.length > 0
    ) {
      const merged = generusData.map((generus) => {
        const desa = desaData.find((desa) => desa.uuid === generus.id_desa);
        const kelompok = kelompokData.find(
          (kelompok) => kelompok.uuid === generus.id_kelompok
        );
        return {
          ...generus,
          desa: desa ? desa.desa : "Desa Tidak Ditemukan",
          kelompok: kelompok ? kelompok.kelompok : "Kelompok Tidak Ditemukan",
          jenjang: mapJenjang(generus.jenjang), // Menggunakan fungsi pemetaan
        };
      });
      setMergedData(merged);
    }
  }, [generusData, desaData, kelompokData]);

  // Filter data based on the selected tab and search criteria
  // Filter data based on the selected tab and search criteria
  const filteredData = mergedData.filter((item) => {
    const matchesSearch = Object.values(item).some(
      (value) =>
        value != null &&
        value.toString().toLowerCase().includes(search.toLowerCase()) // Memastikan nilai tidak null atau undefined
    );

    const matchesAge =
      (minAge === "" || item.umur >= parseInt(minAge, 10)) &&
      (maxAge === "" || item.umur <= parseInt(maxAge, 10));

    // Filter berdasarkan tab yang dipilih
    let matchesJenjang = true; // Defaultnya semua jenjang ditampilkan

    if (activeTab === "0") {
      matchesJenjang = true; // Menampilkan semua jenjang
    } else if (activeTab === "1") {
      matchesJenjang = item.jenjang === "Paud" || item.jenjang === "TK";
    } else if (activeTab === "2") {
      matchesJenjang = item.jenjang.startsWith("Caberawit"); // Caberawit
    } else if (activeTab === "3") {
      matchesJenjang = item.jenjang.startsWith("Pra Remaja"); // Pra Remaja
    } else if (activeTab === "4") {
      matchesJenjang = item.jenjang.startsWith("Remaja"); // Remaja
    } else if (activeTab === "5") {
      matchesJenjang = item.jenjang === "Pra Nikah";
    }

    return matchesSearch && matchesAge && matchesJenjang;
  });

  // Handling page change
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEntriesChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(0); // Reset ke halaman pertama saat tab berubah
  };

  const displayData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleSelect = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mergedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mergedData.map((item) => item.id)); // Asumsikan "id" adalah unik
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/generus/${id}`);
      message.success("Data Berhasil Dihapus!");
      fetchGenerus(); // Refresh data setelah penghapusan
    } catch (error) {
      console.error("Error deleting data:", error);
      message.error("Gagal menghapus data!");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`${import.meta.env.VITE_API_URL}/api/generus/${id}`)
        )
      );
      message.success("Data Berhasil Dihapus!");
      setSelectedIds([]); // Reset pilihan setelah penghapusan
      fetchGenerus(); // Refresh data
    } catch (error) {
      console.error("Error deleting data:", error);
      message.error("Gagal menghapus data!");
    }
  };

  const handleExport = () => {
    // Data untuk diekspor
    const dataToExport = filteredData.map((item, index) => ({
      No: index + 1,
      Nama: item.nama,
      Kelompok: item.kelompok,
      Desa: item.desa,
      Jenjang: item.jenjang,
      "Tgl Lahir": item.tgl_lahir,
      Umur: item.umur,
      "Jenis Kelamin": item.jenis_kelamin,
      "Gol. Darah": item.gol_darah,
    }));

    // Buat worksheet dan workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Generus");

    // Simpan file
    XLSX.writeFile(workbook, "Data_Generus.xlsx");
  };
  return (
    <>
      <div className="card">
        <div className="card-header">
          <p className="card-title">Top Orders</p>
        </div>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="custom-tabs"
          items={[
            { label: "All", key: "0" },
            { label: "PAUD/TK", key: "1" },
            { label: "Caberawit", key: "2" },
            { label: "Pra Remaja", key: "3" },
            { label: "Remaja", key: "4" },
            { label: "Pra Nikah", key: "5" },
          ]}
        />
        <div className="tab-content">
          <div className="tab-pane fade show active"></div>
        </div>
        <div className="card-body p-0">
          <div className="relative h-[auto] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
            <div className="tab-content">
              <div className="tab-pane fade show active">
                <table className="table">
                  <thead className="table-header">
                    <tr className="table-row">
                      <th className="check">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={
                            selectedIds.length === generusData.length &&
                            generusData.length > 0
                          }
                        />
                      </th>
                      <th className="table-head">No</th>
                      <th className="table-head">Nama</th>
                      <th className="table-head">Kelompok</th>
                      <th className="table-head">Desa</th>
                      <th className="table-head">Jenjang</th>
                      <th className="table-head">Tgl Lahir</th>
                      <th className="table-head">Umur</th>
                      <th className="table-head">Mahasiswa</th>
                      <th className="table-head">Jenis Kelamin</th>
                      <th className="table-head">Gol. Darah</th>
                      <th className="table-head">Nama Ortu</th>
                      <th className="table-head">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {displayData.map((item, index) => (
                      <tr key={item.id} className="table-row">
                        <td className="table-cell">
                          <input
                            type="checkbox"
                            onChange={() => handleSelect(item.id)}
                            checked={selectedIds.includes(item.id)}
                          />
                        </td>
                        <td className="table-cell">
                          {currentPage * itemsPerPage + index + 1}
                        </td>
                        <td className="table-cell">
                          <div className="flex w-max gap-x-4">
                            <img
                              src={
                                item.gambar
                                  ? `${import.meta.env.VITE_API_URL}${
                                      item.gambar
                                    }`
                                  : `${
                                      import.meta.env.VITE_API_URL
                                    }/uploads/profil.png`
                              }
                              alt={item.nama}
                              className="size-14 rounded-lg object-cover"
                            />
                            <div className="flex flex-col">
                              <p>{item.nama}</p>
                              <p className="font-normal text-slate-600 dark:text-slate-400">
                                {item.nama}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">{item.kelompok}</td>
                        <td className="table-cell">{item.desa}</td>
                        <td className="table-cell">{item.jenjang}</td>
                        <td className="table-cell">{item.tgl_lahir}</td>
                        <td className="table-cell">{item.umur}</td>
                        <td className="table-cell">{item.mahasiswa}</td>
                        <td className="table-cell">{item.jenis_kelamin}</td>
                        <td className="table-cell">{item.gol_darah}</td>
                        <td className="table-cell">{item.nama_ortu}</td>
                        <td className="table-cell">
                          <div className="flex items-center gap-x-4">
                            <button className="text-blue-500 dark:text-blue-600">
                              <GoPackage size={20} />
                            </button>
                            <button className="text-red-500">
                              <GoPackage size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-between items-center">
            <div className="mb-2 text-gray-500 text-sm">
              Showing {currentPage * itemsPerPage + 1} to{" "}
              {Math.min((currentPage + 1) * itemsPerPage, filteredData.length)}{" "}
              of {filteredData.length} entries
            </div>
            <div>
              <ReactPaginate
                pageCount={Math.ceil(filteredData.length / itemsPerPage)}
                onPageChange={handlePageClick}
                containerClassName="flex items-center space-x-2 pagination"
                activeClassName="active"
                previousLabel={<GrPrevious />}
                nextLabel={<GrNext />}
                breakLabel={"..."}
                marginPagesDisplayed={1} // Always show the first and last page buttons
                pageRangeDisplayed={1} // Show only 3 page buttons at a time
                pageClassName={"page-item"}
                pageLinkClassName={"page-link bg-gry-200"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Generus;
