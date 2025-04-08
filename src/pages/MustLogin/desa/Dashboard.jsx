import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { Footer } from "../../../layouts/admin/components/Footer";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { MdOutlineHolidayVillage } from "react-icons/md";
import { Fa42Group } from "react-icons/fa6";
import DashboardBox from "../../../components/DashboardBox";
import { Skeleton } from "antd"; // Import Skeleton dari Ant Design
import axios from "axios";
import LineVillage from "../../../components/chart/desa/Line";
import Semangat from "../../../assets/Group.png";
import useGetMe from "../../../hooks/useFetchUserData";

const DashboardPage = () => {
  const { user } = useGetMe();
  const [loadings, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalGenerus: 0,
    totalKelompok: 0,
    totalMumi: 0,
    totalCaberawit: 0,
  });

  const fetchStats = async (id_desa) => {
    setLoading(true);
    try {
      const [generusRes, kelompokRes, mumiRes, caberawitRes] =
        await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/generus/total/${id_desa}`
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/kelompok/total/${id_desa}`
          ),
          axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/generus/total/jenjang/${id_desa}`
          ),
          axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/generus/total/caberawit/${id_desa}`
          ),
        ]);

      setStats({
        totalGenerus: generusRes.data.totalGenerus || 0,
        totalKelompok: kelompokRes.data.totalKelompok || 0,
        totalMumi: mumiRes.data.totalMumi || 0,
        totalCaberawit: caberawitRes.data.totalCaberawit || 0,
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      message.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id_desa) {
      fetchStats(user.id_desa);
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Dashboard</h1>
      <div className="card">
        <div className="flex flex-col md:flex-row md:gap-6 gap-4">
          {/* Kiri */}
          <div className="w-full md:w-1/2 flex flex-col md:flex-row items-center justify-center text-center md:text-left md:justify-center md:items-center">
            <img src={Semangat} alt="Logo" className="w-62 h-auto" />
            <div className="flex flex-col md:ml-6 mt-4 md:mt-0 w-full max-w-md">
              {loadings ? (
                <Skeleton active paragraph={{ rows: 2 }} />
              ) : (
                <>
                  <h1 className="text-black font-bold dark:text-white text-xl">
                    Hai,{" "}
                    <span className="text-black dark:text-white uppercase">
                      {user?.username || "..."}
                    </span>
                  </h1>
                  <p className="text-gray-600 mt-2 dark:text-white">
                    Saat ini Anda sedang Beramal Sholih untuk MengUpdate data
                    Generus Jamaah, dimohon untuk bisa semangat dalam Beramal
                    Sholih.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Kanan */}
          <div className="w-full md:w-1/2">
            {user?.id_desa && <LineVillage id_desa={user.id_desa} />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <DashboardBox
          title="Total Generus"
          count={
            loadings ? (
              <Skeleton active paragraph={{ rows: 0 }} />
            ) : (
              stats.totalGenerus
            )
          }
          icon={<FaUser size={26} />}
        />
        <DashboardBox
          title="Total Caberawit"
          count={
            loadings ? (
              <Skeleton active paragraph={{ rows: 0 }} />
            ) : (
              stats.totalCaberawit
            )
          }
          icon={<FaUser size={26} />}
        />
        <DashboardBox
          title="Total Muda - Mudi"
          count={
            loadings ? (
              <Skeleton active paragraph={{ rows: 0 }} />
            ) : (
              stats.totalMumi
            )
          }
          icon={<FaUser size={26} />}
        />
        <DashboardBox
          title="Total Kelompok"
          count={
            loadings ? (
              <Skeleton active paragraph={{ rows: 0 }} />
            ) : (
              stats.totalKelompok
            )
          }
          icon={<Fa42Group size={26} />}
        />
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;
