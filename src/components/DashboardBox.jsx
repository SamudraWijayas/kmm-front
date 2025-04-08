import React from "react";
import { GoPackage } from "react-icons/go"; // Impor ikon yang digunakan

const DashboardBox = (props) => {
  const colors = props.color || ["#ccc", "#ddd"]; // Warna default jika tidak ada props.color
  const count = props.count || 233; // Teks angka default

  return (
    <div className="card">
      <div className="card-header">
        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
          {props.icon}
        </div>
        <p className="card-title">{props.title}</p>
      </div>
      <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
        <div className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
          {props.count}
        </div>
        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
          <GoPackage size={18} />
          100%
        </span>
      </div>
    </div>
  );
};

export default DashboardBox;
