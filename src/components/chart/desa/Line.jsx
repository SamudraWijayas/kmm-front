import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import axios from "axios";
import { Skeleton } from "antd";

const LineVillage = ({ id_desa }) => {
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartHeight, setChartHeight] = useState(getResponsiveHeight());

  function getResponsiveHeight() {
    const width = window.innerWidth;
    if (width < 480) return 220;
    if (width < 768) return 260;
    if (width < 1024) return 300;
    return 350;
  }

  useEffect(() => {
    if (!id_desa) return;

    const fetchData = async () => {
      try {
        const kelompokResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/kelompok/desa/${id_desa}`
        );
        const generusResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/generus`
        );

        const kelompokData = kelompokResponse.data;
        const generusData = generusResponse.data;

        const groupedData = kelompokData.map((kelompok) => {
          const generusByKelompok = generusData.filter(
            (generus) => generus.id_kelompok === kelompok.uuid
          );

          return {
            kelompok: kelompok.kelompok,
            "Paud/TK": generusByKelompok.filter(
              (g) => g.jenjang === "Paud" || g.jenjang === "TK"
            ).length,
            Caberawit: generusByKelompok.filter((g) =>
              ["1", "2", "3", "4", "5", "6"].includes(g.jenjang)
            ).length,
            "Pra Remaja": generusByKelompok.filter((g) =>
              ["7", "8", "9"].includes(g.jenjang)
            ).length,
            Remaja: generusByKelompok.filter((g) =>
              ["10", "11", "12"].includes(g.jenjang)
            ).length,
            "Pra Nikah": generusByKelompok.filter(
              (g) => g.jenjang === "Pra Nikah"
            ).length,
          };
        });

        const labels = groupedData.map((item) => item.kelompok);

        const jenjangCategories = [
          "Paud/TK",
          "Caberawit",
          "Pra Remaja",
          "Remaja",
          "Pra Nikah",
        ];

        const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

        const chartSeries = jenjangCategories.map((jenjang, index) => ({
          name: jenjang,
          data: groupedData.map((item) => item[jenjang]),
          color: colors[index],
        }));

        setCategories(labels);
        setSeries(chartSeries);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const handleResize = () => {
      setChartHeight(getResponsiveHeight());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [id_desa]);

  const chartOptions = {
    chart: {
      type: "area",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories,
      labels: {
        show: chartHeight >= 300,
        rotate: chartHeight < 300 ? -45 : 0,
        style: { fontSize: chartHeight < 300 ? "10px" : "12px" },
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: chartHeight < 300 ? "10px" : "12px" },
      },
      min: 0,
    },
    legend: {
      position: "top",
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.3,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
  };

  return (
    <div className="area-chart text-black" style={{ width: "100%", paddingLeft: "10px" }}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 7 }} />
      ) : (
        <ApexCharts
          options={chartOptions}
          series={series}
          type="area"
          height={chartHeight}
        />
      )}
    </div>
  );
};

export default LineVillage;
