import React, { useState, useEffect } from "react";
import axios from "axios";
import { Skeleton } from "antd"; // Import Skeleton dari Ant Design

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { overviewData, recentSalesData, topProducts } from "../../layouts/data";
import { useDarkMode } from "../../context/DarkModeContext"; // Import Context

const Line = () => {
  const { darkMode, setDarkMode } = useDarkMode(); // Gunakan context global
  const [generusData, setGenerusData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGenerusData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/generus`
      );
      setTimeout(() => {
        setGenerusData(response.data);
        setLoading(false);
      }, 1000); // Set loading selama 1 detik
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenerusData();
  }, []);

  return (
    <div className="card col-span-1 md:col-span-2 lg:col-span-4">
      <div className="card-header">
        <p className="card-title">Overview</p>
      </div>
      <div className="card-body p-0">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={overviewData}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip cursor={false} formatter={(value) => `$${value}`} />

            <XAxis
              dataKey="name"
              strokeWidth={0}
              stroke={darkMode === "light" ? "#475569" : "#94a3b8"}
              tickMargin={6}
            />
            <YAxis
              dataKey="total"
              strokeWidth={0}
              stroke={darkMode === "light" ? "#475569" : "#94a3b8"}
              tickFormatter={(value) => `$${value}`}
              tickMargin={6}
            />

            <Area
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Line;
