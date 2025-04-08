import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";

const BarChart = () => {
  const [generusData, setGenerusData] = useState([]);

  useEffect(() => {
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
    fetchGenerusData();
  }, []);

  const categories = [
    "Paud/TK",
    "Caberawit",
    "Pra Remaja",
    "Remaja",
    "Pra Nikah",
  ];
  const groupedData = [0, 0, 0, 0, 0];

  generusData.forEach((item) => {
    if (["Paud", "TK"].includes(item.jenjang)) {
      groupedData[0]++;
    } else if (["1", "2", "3", "4", "5", "6"].includes(item.jenjang)) {
      groupedData[1]++;
    } else if (["7", "8", "9"].includes(item.jenjang)) {
      groupedData[2]++;
    } else if (["10", "11", "12"].includes(item.jenjang)) {
      groupedData[3]++;
    } else if (item.jenjang === "Pra Nikah") {
      groupedData[4]++;
    }
  });

  const options = {
    chart: { type: "bar" },
    plotOptions: {
      bar: { horizontal: true, distributed: true, barHeight: "70%" },
    },
    xaxis: {
      show: false,
      categories: categories,
      labels: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      categories: categories,
      labels: { show: true },
    },
    grid: { show: false },
    tooltip: { enabled: true },
  };

  const series = [{ data: groupedData }];

  return (
    <div className="card col-span-1 md:col-span-2 lg:col-span-4 text-black">
      <div className="card-header">
        <p className="card-title">Grafik Generus</p>
      </div>
      <div className="card-body">
        <Chart options={options} series={series} type="bar" height={300} />
      </div>
    </div>
  );
};

export default BarChart;



  // import React, { useState, useEffect } from "react";
  // import axios from "axios";
  // import Chart from "react-apexcharts";

  // const BarChart = () => {
  //   const [generusData, setGenerusData] = useState([]);

  //   useEffect(() => {
  //     const fetchGenerusData = async () => {
  //       try {
  //         const response = await axios.get(
  //           `${import.meta.env.VITE_API_URL}/api/generus`
  //         );
  //         setGenerusData(response.data);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     };
  //     fetchGenerusData();
  //   }, []);

  //   const categories = [
  //     "Paud/TK",
  //     "Caberawit",
  //     "Pra Remaja",
  //     "Remaja",
  //     "Pra Nikah",
  //   ];
  //   const groupedData = [0, 0, 0, 0, 0];

  //   generusData.forEach((item) => {
  //     if (["Paud", "TK"].includes(item.jenjang)) {
  //       groupedData[0]++;
  //     } else if (["1", "2", "3", "4", "5", "6"].includes(item.jenjang)) {
  //       groupedData[1]++;
  //     } else if (["7", "8", "9"].includes(item.jenjang)) {
  //       groupedData[2]++;
  //     } else if (["10", "11", "12"].includes(item.jenjang)) {
  //       groupedData[3]++;
  //     } else if (item.jenjang === "Pra Nikah") {
  //       groupedData[4]++;
  //     }
  //   });

  //   const options = {
  //     chart: { type: "bar" },
  //     plotOptions: {
  //       bar: { horizontal: true, distributed: true, barHeight: "70%" },
  //     },
  //     xaxis: {
  //       categories: categories,
  //       labels: { show: true },
  //       axisBorder: { show: false },
  //     },
  //     yaxis: {
  //       categories: categories,
  //       labels: {
  //         show: true,
  //         style: {
  //           fontSize: "14px",
  //         },
  //       },
  //     },
  //     grid: { show: false },
  //     tooltip: { enabled: true },
  //   };

  //   const series = [{ data: groupedData }];

  //   return (
  //     <div className="card col-span-1 md:col-span-2 lg:col-span-4">
  //       <div className="card-header">
  //         <p className="card-title">Grafik Generus</p>
  //       </div>
  //       <div className="card-body">
  //         <Chart options={options} series={series} type="bar" height={300} />
  //       </div>
  //     </div>
  //   );
  // };

  // export default BarChart;
