import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";

const PieChart = () => {
  const [generusData, setGenerusData] = useState([]);

  const fetchGenerusData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/generus`
      );
      setGenerusData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGenerusData();
  }, []);

  const groupedData = {
    "Paud/TK": 0,
    Caberawit: 0,
    "Pra Remaja": 0,
    Remaja: 0,
    "Pra Nikah": 0,
  };

  generusData.forEach((item) => {
    if (["Paud", "TK"].includes(item.jenjang)) {
      groupedData["Paud/TK"]++;
    } else if (["1", "2", "3", "4", "5", "6"].includes(item.jenjang)) {
      groupedData["Caberawit"]++;
    } else if (["7", "8", "9"].includes(item.jenjang)) {
      groupedData["Pra Remaja"]++;
    } else if (["10", "11", "12"].includes(item.jenjang)) {
      groupedData["Remaja"]++;
    } else if (item.jenjang === "Pra Nikah") {
      groupedData["Pra Nikah"]++;
    }
  });

  const chartOptions = {
    chart: {
      type: "pie",
    },
    labels: Object.keys(groupedData),
    colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="card col-span-1 md:col-span-2 lg:col-span-4">
      <div className="card-header">
        <p className="card-title">Grafik Generus</p>
      </div>
      <div className="card-body flex justify-center">
        <Chart
          options={chartOptions}
          series={Object.values(groupedData)}
          type="pie"
          width={400}
        />
      </div>
    </div>
  );
};

export default PieChart;
