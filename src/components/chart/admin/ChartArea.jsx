import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { Skeleton } from "antd";

const StatisticsArea = () => {
  const [chartData, setChartData] = useState({ series: [], options: {} });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const desaResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/desa`
        );
        const desaData = desaResponse.data;

        const generusResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/generus`
        );
        const generusData = generusResponse.data;

        const groupedData = desaData.map((desa) => {
          const desaGenerus = generusData.filter(
            (generus) => generus.id_desa === desa.uuid
          );

          const jenjangCounts = {
            Paud: 0,
            Caberawit: 0,
            "Pra Remaja": 0,
            Remaja: 0,
            "Pra Nikah": 0,
          };

          desaGenerus.forEach((generus) => {
            if (["Paud", "TK"].includes(generus.jenjang)) jenjangCounts.Paud++;
            if (["1", "2", "3", "4", "5", "6"].includes(generus.jenjang))
              jenjangCounts.Caberawit++;
            if (["7", "8", "9"].includes(generus.jenjang))
              jenjangCounts["Pra Remaja"]++;
            if (["10", "11", "12"].includes(generus.jenjang))
              jenjangCounts.Remaja++;
            if (generus.jenjang === "Pra Nikah") jenjangCounts["Pra Nikah"]++;
          });

          return {
            desa: desa.desa,
            ...jenjangCounts,
          };
        });

        const labels = groupedData.map((item) => item.desa);
        const jenjangCategories = [
          "Paud",
          "Caberawit",
          "Pra Remaja",
          "Remaja",
          "Pra Nikah",
        ];

        const series = jenjangCategories.map((jenjang) => ({
          name: jenjang,
          data: groupedData.map((item) => item[jenjang]),
        }));

        setChartData({
          series,
          options: {
            chart: {
              type: "area",
              height: 350,
              zoom: { enabled: false },
            },
            xaxis: {
              categories: labels,
              labels: {
                rotate: isMobile ? -45 : 0,
                style: { fontSize: isMobile ? "10px" : "12px" },
              },
            },
            yaxis: {
              labels: {
                style: { fontSize: isMobile ? "10px" : "12px" },
              },
            },
            stroke: {
              curve: "smooth",
              width: 2,
            },
            dataLabels: { enabled: false },
            markers: { size: 4 },
            fill: {
              type: "gradient",
              gradient: {
                shadeIntensity: 0.4,
                opacityFrom: 0.9,
                opacityTo: 0.1,
              },
            },
            legend: { position: "top" },
          },
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  return (
    <div style={{ width: "100%", margin: "0 auto" }} className="text-black">
      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={550}
        />
      )}
    </div>
  );
};

export default StatisticsArea;
