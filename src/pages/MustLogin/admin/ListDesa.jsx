import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdModeEdit, MdDelete } from "react-icons/md";

const ListDesa = () => {
  const [desaData, setDesaData] = useState([]);

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

  useEffect(() => {
    fetchDesa();
  }, []);

  return (
    <div className="card p-4">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">List Desa</h2>
      <ul className="space-y-4">
        {desaData.map((row) => (
          <li
            key={row.uuid}
            className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-medium text-black dark:text-white">{row.desa}</p>
              <Link
                to={`/generusbydesa/${row.uuid}`}
                className="text-blue-500 hover:underline"
              >
                Lihat Detail
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-blue-500 dark:text-blue-400">
                <MdModeEdit size={20} />
              </button>
              <button className="text-red-500 dark:text-red-400">
                <MdDelete size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListDesa;
