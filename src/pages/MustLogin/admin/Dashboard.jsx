import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import {
  overviewData,
  recentSalesData,
  topProducts,
} from "../../../layouts/data";
import { Footer } from "../../../layouts/admin/components/Footer";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { GoPackage } from "react-icons/go";
import { MdOutlineHolidayVillage } from "react-icons/md";
import { Fa42Group } from "react-icons/fa6";
import { useDarkMode } from "../../../context/DarkModeContext"; // Import Contex
import DashboardBox from "../../../components/DashboardBox";
import { Skeleton } from "antd"; // Import Skeleton dari Ant Design
import ListUser from "../../../components/ListUser";
import Line from "../../../components/chart/admin/Line";
import StatisticsArea from "../../../components/chart/admin/ChartArea";

const DashboardPage = () => {
  const { darkMode, setDarkMode } = useDarkMode(); // Gunakan context global
  const [totalGenerus, setTotalGenerus] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDesa, setTotalDesa] = useState(0);
  const [totalKelompok, setTotalKelompok] = useState(0);
  const [loadings, setLoading] = useState(false);

  const fetchTotalDesa = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/totalDesa`
      );
      const data = await response.json();
      setTotalDesa(data.totalDesa);
    } catch (error) {
      console.error("Error fetching total desa:", error);
    } finally {
      // Ensure loading is turned off after 1 second
      setTimeout(() => {
        setLoading(false);
      }, 1000); // 1000 ms = 1 second
    }
  };
  const fetchTotalKelompok = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/totalKelompok`
      );
      const data = await response.json();
      setTotalKelompok(data.totalKelompok);
    } catch (error) {
      console.error("Error fetching total desa:", error);
    } finally {
      // Ensure loading is turned off after 1 second
      setTimeout(() => {
        setLoading(false);
      }, 1000); // 1000 ms = 1 second
    }
  };

  const fetchTotalGenerus = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/totalGenerus`
      );
      const data = await response.json();
      setTotalGenerus(data.totalGenerus);
    } catch (error) {
      console.error("Error fetching total generus:", error);
    } finally {
      // Ensure loading is turned off after 1 second
      setTimeout(() => {
        setLoading(false);
      }, 1000); // 1000 ms = 1 second
    }
  };

  const fetchTotaUsers = async () => {
    try {
      setLoading(true); // Start loading immediately
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/totalUsers`
      );
      const data = await response.json();
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error("Error fetching total user:", error);
    } finally {
      // Ensure loading is turned off after 1 second
      setTimeout(() => {
        setLoading(false);
      }, 1000); // 1000 ms = 1 second
    }
  };

  useEffect(() => {
    fetchTotalGenerus();
    fetchTotaUsers();
    fetchTotalDesa();
    fetchTotalKelompok();
  }, []);

  

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <DashboardBox
          title="Total Generus"
          count={
            loadings ? (
              <Skeleton active paragraph={{ rows: 0 }} />
            ) : (
              totalGenerus
            )
          }
          icon={<FaUser size={26} />}
        />
        <DashboardBox
          title="Total User"
          count={
            loadings ? <Skeleton active paragraph={{ rows: 0 }} /> : totalUsers
          }
          icon={<MdOutlineAdminPanelSettings size={26} />}
        />
        <DashboardBox
          title="Total Desa"
          count={
            loadings ? <Skeleton active paragraph={{ rows: 0 }} /> : totalDesa
          }
          icon={<MdOutlineHolidayVillage size={26} />}
        />
        <DashboardBox
          title="Total Kelompok"
          count={
            loadings ? (
              <Skeleton active paragraph={{ rows: 0 }} />
            ) : (
              totalKelompok
            )
          }
          icon={<Fa42Group size={26} />}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Line />
        <ListUser />
      </div>
      <div className="card">
        <div className="card-header">
          <p className="card-title">
            Grafik Statistik Generus Berdasarkan Desa dan Jenjang
          </p>
        </div>
        <div className="card-body p-0">
          <div className="relative h-[auto] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
            <StatisticsArea />
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <p className="card-title">Top Orders</p>
        </div>
        <div className="card-body p-0">
          <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">#</th>
                  <th className="table-head">Product</th>
                  <th className="table-head">Price</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Rating</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {topProducts.map((product) => (
                  <tr key={product.number} className="table-row">
                    <td className="table-cell">{product.number}</td>
                    <td className="table-cell">
                      <div className="flex w-max gap-x-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="size-14 rounded-lg object-cover"
                        />
                        <div className="flex flex-col">
                          <p>{product.name}</p>
                          <p className="font-normal text-slate-600 dark:text-slate-400">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">${product.price}</td>
                    <td className="table-cell">{product.status}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-x-2">
                        <GoPackage
                          size={18}
                          className="fill-yellow-600 stroke-yellow-600"
                        />
                        {product.rating}
                      </div>
                    </td>
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
      <Footer />
    </div>
  );
};

export default DashboardPage;
