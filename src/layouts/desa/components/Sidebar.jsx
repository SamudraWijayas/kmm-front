import { forwardRef } from "react";
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logoLight from "../../../assets/logo-light.png";
import logoDark from "../../../assets/logo-dark.png";
import { cn } from "../../../helpers";
import PropTypes from "prop-types";
import { useAuth } from "../../../context/index";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { IoLogOutOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import { Fa42Group } from "react-icons/fa6";
import { FiActivity } from "react-icons/fi";
import useGetMe from "../../../hooks/useFetchUserData";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
  const { user } = useGetMe();
  const { logout } = useAuth();
  const [kelompokData, setKelompokData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchKelompok = async (id_desa) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/kelompok/desa/${id_desa}`
      );
      setKelompokData(response.data);
    } catch (error) {
      console.error("Error fetching kelompok data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id_desa) {
      fetchKelompok(user.id_desa);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        window.location.href = "/login";
      } else {
        console.error("Logout gagal");
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat logout", error);
    }
  };

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 transition-all",
        collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0"
      )}
    >
      <div className="flex gap-x-3 p-3 items-center">
        <img src={logoLight} alt="Logoipsum" className="w-40 dark:hidden" />
        <img
          src={logoDark}
          alt="Logoipsum"
          className="w-40 hidden dark:block"
        />
      </div>

      <div className="flex w-full flex-col gap-y-4 overflow-y-auto p-3">
        <nav className={cn("sidebar-group", collapsed && "md:items-center")}>
          <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>
            Dashboard
          </p>
          <NavLink
            to={`/dashboard`}
            className={cn("sidebar-item", collapsed && "md:w-[45px]")}
          >
            <HiOutlineHome size={22} className="flex-shrink-0" />
            {!collapsed && <p className="whitespace-nowrap">Dashboard</p>}
          </NavLink>
          <NavLink
            to={`/kegiatann`}
            className={cn("sidebar-item", collapsed && "md:w-[45px]")}
          >
            <FiActivity size={22} className="flex-shrink-0" />
            {!collapsed && <p className="whitespace-nowrap">Kegiatan</p>}
          </NavLink>
        </nav>
        {/* Menampilkan setiap kelompok sebagai NavLink */}
        <nav className={cn("sidebar-group", collapsed && "md:items-center")}>
          <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>
            Kelompok
          </p>
          {kelompokData.map((kelompok) => (
            <NavLink
              key={kelompok.id}
              to={`/kelompok/${kelompok.uuid}`}
              className={cn("sidebar-item", collapsed && "md:w-[45px]")}
            >
              <Fa42Group size={22} className="flex-shrink-0" />
              {!collapsed && (
                <p className="whitespace-nowrap">{kelompok.kelompok}</p>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Tombol Logout */}
        <nav className={cn("sidebar-group", collapsed && "md:items-center")}>
          <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>
            Profile
          </p>
          <NavLink
            to={`/profil`}
            className={cn("sidebar-item", collapsed && "md:w-[45px]")}
          >
            <CgProfile size={22} className="flex-shrink-0" />
            {!collapsed && <p className="whitespace-nowrap">Profile</p>}
          </NavLink>
          <button
            onClick={handleLogout}
            className={cn("sidebar-item", collapsed && "md:w-[45px]")}
          >
            <IoLogOutOutline size={22} className="flex-shrink-0" />
            {!collapsed && <p className="whitespace-nowrap">Logout</p>}
          </button>
        </nav>
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};
