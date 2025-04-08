import React from "react";
import { CiBellOn, CiSearch } from "react-icons/ci";
import { FaChevronLeft } from "react-icons/fa";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useDarkMode } from "../../../context/DarkModeContext"; // Import Context
import { Spin } from "antd";
import useGetMe from "../../../hooks/useFetchUserData";

import PropTypes from "prop-types";

export const Header = ({ collapsed, setCollapsed }) => {
  const { darkMode, setDarkMode } = useDarkMode(); // Gunakan context global

  const { user, loading, error } = useGetMe();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold mt-10">
        {error}
      </div>
    );
  }

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
      <div className="flex items-center gap-x-3">
        <button
          className="btn-ghost size-10"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaChevronLeft className={collapsed && "rotate-180"} />
        </button>
      </div>
      <div className="flex items-center gap-x-3">
        {/* Tombol untuk toggle dark mode */}
        <button className="btn-ghost size-10" onClick={toggleDarkMode}>
          {darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
        </button>
        <button className="btn-ghost size-10">
          <CiBellOn size={20} />
        </button>
        <button className="size-10 overflow-hidden rounded-full">
          <img
            src={
              user.avatar
                ? `${import.meta.env.VITE_API_URL}${user.avatar}`
                : `${import.meta.env.VITE_API_URL}/uploads/avatar.png`
            }
            alt="profile image"
            className="size-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
