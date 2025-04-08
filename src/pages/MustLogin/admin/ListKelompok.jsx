import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { MdModeEdit, MdDelete } from "react-icons/md";

const ListKelompok = () => {
  const [kelompokData, setKelompokData] = useState([]); // Data kelompok
  const [desaData, setDesaData] = useState([]); // Data desa
  const [search, setSearch] = useState(""); // State untuk pencarian
  const [currentPage, setCurrentPage] = useState(0); // State untuk pagination
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default jumlah item per halaman
  const [sidebarOpen, setSidebarOpen] = useState(false); // State untuk sidebar

  // Ambil data kelompok
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

  // Ambil data desa
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

  // Gabungkan data kelompok dan desa
  const mergedData = kelompokData.map((kelompok) => {
    const desa = desaData.find((desa) => desa.uuid === kelompok.id_desa);
    return {
      ...kelompok,
      desa: desa ? desa.desa : "Desa Tidak Ditemukan",
    };
  });

  const handleAddData = () => {
    fetchKelompok();
  };

  useEffect(() => {
    fetchKelompok();
    fetchDesa();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredData = mergedData.filter((item) =>
    item.kelompok.toLowerCase().includes(search.toLowerCase())
  );

  // Fungsi untuk menangani perubahan halaman
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Menentukan data yang akan ditampilkan pada halaman saat ini
  const displayData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
      <div className="card">
        <div className="card-header">
          <p className="card-title">Top Orders</p>
        </div>
        <div className="card-body p-0">
          <div className="relative h-[auto] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row text-black">
                  <th className="table-head">NO</th>
                  <th className="table-head">KELOMPOK</th>
                  <th className="table-head">DESA</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {displayData.map((row, index) => (
                  <tr key={row.uuid} className="table-row">
                    <td>{currentPage * itemsPerPage + index + 1}</td>
                    <td className="table-cell">{row.kelompok}</td>
                    <td className="table-cell">{row.desa}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-x-4">
                        <button className="text-blue-500 dark:text-blue-600">
                          <MdModeEdit size={20} />
                        </button>
                        <button className="text-red-500">
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={Math.ceil(filteredData.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={0}
              onPageChange={handlePageClick}
              containerClassName="flex items-center space-x-2 pagination my-5"
              pageClassName={"page-item"}
              pageLinkClassName={"page-link bg-gray-200 text-black rounded-sm"}
              previousClassName={"page-item text-black dark:text-white"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item text-black dark:text-white"}
              nextLinkClassName={"page-link"}
              activeClassName={"active"}
              breakLinkClassName={"page-link text-black dark:text-white"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListKelompok;
