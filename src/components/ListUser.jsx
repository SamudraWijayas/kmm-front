import React, { useState, useEffect } from "react";
import axios from "axios";
import { Skeleton } from "antd"; // Import Skeleton dari Ant Design
import { GrNext, GrPrevious } from "react-icons/gr";
const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false); // Loading state untuk user

  // Fungsi untuk mengambil data users
  const getUsers = async () => {
    setLoadingUsers(true); // Set loading menjadi true saat memulai request
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      // Ensure loading is turned off after 1 second
      setTimeout(() => {
        setLoadingUsers(false); // Set loading menjadi false setelah data diterima
      }, 1000); // 1000 ms = 1 second
    }
  };

  useEffect(() => {
    getUsers(); // Panggil fungsi untuk mengambil data desa saat komponen dimuat
  }, []);

  // Pagination untuk data user
  const [userPage, setUserPage] = useState(1); // Halaman aktif untuk user
  const usersPerPage = 5;
  const indexOfLastUser = userPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Hitung jumlah halaman untuk data user
  const userTotalPages = Math.ceil(users.length / usersPerPage);

  // Fungsi untuk mengubah halaman data user
  const changeUserPage = (pageNumber) => {
    setUserPage(pageNumber);
  };

  const getDisplayedPages = (currentPage, totalPages, maxPagesToShow = 3) => {
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      end = Math.min(maxPagesToShow, totalPages);
    } else if (currentPage + half > totalPages) {
      start = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    return { start, end };
  };
  return (
    <div className="card col-span-1 md:col-span-2 lg:col-span-3 scrollbar-hidden">
      <div className="card-header">
        <p className="card-title">User</p>
      </div>
      <div className="card-body h-[300px] overflow-auto p-0">
        {loadingUsers ? (
          <Skeleton avatar paragraph={{ rows: 4 }} />
        ) : (
          currentUsers.map((user, index) => (
            <div
              key={user.id || index}
              className="flex items-center justify-between gap-x-6 py-[6px] pr-2"
            >
              <div className="flex items-center gap-x-4">
                <img
                  src={
                    user.avatar
                      ? `${import.meta.env.VITE_API_URL}${user.avatar}`
                      : `${import.meta.env.VITE_API_URL}/uploads/profil.png`
                  }
                  alt={user.username}
                  className="size-10 flex-shrink-0 rounded-full object-cover"
                />
                <div className="flex flex-col gap-y-2">
                  <p className="text-[15px] font-medium text-slate-900 dark:text-slate-50">
                    {user.username}
                  </p>
                </div>
                <p className="text-[12px] text-black dark:text-slate-400">
                  {user.role}
                </p>
              </div>
              <div className="flex items-center gap-x-4">
                <button>delet</button>
                <button>edit</button>
              </div>
              {/* <p className="font-medium text-slate-900 dark:text-slate-50">
                {user.role}
              </p> */}
            </div>
          ))
        )}
      </div>
      <div className="pagination flex justify-end mb-4 space-x-2">
        {/* Tombol "Previous" */}
        <button
          variant="text"
          size="small"
          disabled={userPage === 1}
          onClick={() => changeUserPage(userPage - 1)}
          className="mx-1"
          style={{
            minWidth: "40px",
            padding: "2px 8px",
            color: userPage === 1 ? "#999" : "#0033a0",
            borderRadius: "4px",
            fontWeight: userPage === 1 ? "normal" : "bold",
            cursor: userPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          <GrPrevious />
        </button>

        {/* Tombol angka halaman */}
        {(() => {
          const pages = [];
          const start = Math.max(1, userPage - 0);
          const end = Math.min(userTotalPages, userPage + 0);

          if (start > 1) {
            pages.push(
              <button
                key={1}
                variant="text"
                size="small"
                onClick={() => changeUserPage(1)}
                className="mx-1"
                style={{
                  minWidth: "30px",
                  padding: "2px 6px",
                  backgroundColor: "transparent",
                  color: "#000",
                  borderRadius: "4px",
                }}
              >
                1
              </button>
            );

            if (start > 2) {
              pages.push(
                <span
                  key="start-dots"
                  className="mx-1"
                  style={{ color: "#999" }}
                >
                  ...
                </span>
              );
            }
          }

          for (let i = start; i <= end; i++) {
            const isActive = i === userPage;
            pages.push(
              <button
                key={i}
                variant="text"
                size="small"
                onClick={() => changeUserPage(i)}
                className="mx-1"
                style={{
                  minWidth: "30px",
                  padding: "2px 6px",
                  backgroundColor: isActive ? "#0033a0" : "transparent",
                  color: isActive ? "white" : "#000",
                  borderRadius: "4px",
                  fontWeight: isActive ? "bold" : "normal",
                }}
              >
                {i}
              </button>
            );
          }

          if (end < userTotalPages) {
            if (end < userTotalPages - 1) {
              pages.push(
                <span key="end-dots" className="mx-1" style={{ color: "#999" }}>
                  ...
                </span>
              );
            }

            pages.push(
              <button
                key={userTotalPages}
                variant="text"
                size="small"
                onClick={() => changeUserPage(userTotalPages)}
                className="mx-1"
                style={{
                  minWidth: "30px",
                  padding: "2px 6px",
                  backgroundColor: "transparent",
                  color: "#000",
                  borderRadius: "4px",
                }}
              >
                {userTotalPages}
              </button>
            );
          }

          return pages;
        })()}

        {/* Tombol "Next" */}
        <button
          variant="text"
          size="small"
          disabled={userPage === userTotalPages}
          onClick={() => changeUserPage(userPage + 1)}
          className="mx-1"
          style={{
            minWidth: "40px",
            padding: "2px 8px",
            color: userPage === userTotalPages ? "#999" : "#0033a0",
            borderRadius: "4px",
            fontWeight: userPage === userTotalPages ? "normal" : "bold",
            cursor: userPage === userTotalPages ? "not-allowed" : "pointer",
          }}
        >
          <GrNext />
        </button>
      </div>
    </div>
  );
};

export default ListUser;
