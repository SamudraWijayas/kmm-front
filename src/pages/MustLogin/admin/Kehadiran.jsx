import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Tabs, Spin, Alert, List, Typography, Card, Statistic } from "antd";

const { Title, Text } = Typography;

const KehadiranList = () => {
  const { id_kegiatan } = useParams();
  const [kehadiran, setKehadiran] = useState([]);
  const [allKehadiran, setAllKehadiran] = useState([]);
  const [desaList, setDesaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [presentaseData, setPresentaseData] = useState({});
  const [kegiatan, setKegiatan] = useState(null);

  // Fetch data kegiatan (agar tetap tampil meskipun kehadiran kosong)
  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/kegiatan/${id_kegiatan}`
        );
        if (res.data.success) {
          setKegiatan(res.data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data kegiatan:", err);
      }
    };

    fetchKegiatan();
  }, [id_kegiatan]);

  // Fetch kehadiran & desa
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kehadiranRes, desaRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/kehadiran/${id_kegiatan}`
          ),
          axios.get(`${import.meta.env.VITE_API_URL}/api/desa`),
        ]);

        const desaData = desaRes.data;
        setDesaList([{ uuid: "all", desa: "Semua Desa" }, ...desaData]);

        if (kehadiranRes.data.success && desaData.length > 0) {
          const kehadiranData = kehadiranRes.data.data;
          setAllKehadiran(kehadiranData);
          setKehadiran(kehadiranData);

          // Fetch presentase per desa
          const presentasePromises = desaData.map((desa) =>
            axios.get(
              `${
                import.meta.env.VITE_API_URL
              }/api/presentase/kehadiran/desa/${id_kegiatan}/${desa.uuid}`
            )
          );

          const presentaseResults = await Promise.all(presentasePromises);
          const presentaseMap = {};

          desaData.forEach((desa, index) => {
            presentaseMap[desa.uuid] = presentaseResults[index].data.data;
          });

          setPresentaseData(presentaseMap);
        } else {
          // Tidak ada data kehadiran
          setAllKehadiran([]);
          setKehadiran([]);
        }
      } catch (err) {
        console.error("Error Fetching:", err);
        if (err.response?.status === 404) {
          setAllKehadiran([]);
          setKehadiran([]);
          setDesaList([{ uuid: "all", desa: "Semua Desa" }]);
        } else {
          setError("Terjadi kesalahan dalam mengambil data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_kegiatan]);

  if (loading) return <Spin size="large" />;
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Title level={3} className="mb-0">
          Daftar Kehadiran {kegiatan.kegiatan}
        </Title>
      </div>

      <Tabs
        defaultActiveKey="all"
        onChange={(desaId) => {
          const filtered =
            desaId === "all"
              ? allKehadiran
              : allKehadiran.filter((item) => item.id_desa === desaId);
          setKehadiran(filtered);
        }}
        items={desaList.map((desa) => ({
          key: desa.uuid,
          label: desa.desa,
          children:
            kehadiran.length > 0 ? (
              <>
                {desa.uuid !== "all" && presentaseData[desa.uuid] ? (
                  <Card className="mb-4">
                    <div className="flex gap-8">
                      <Statistic
                        title="Total Remaja"
                        value={presentaseData[desa.uuid].total_remaja}
                      />
                      <Statistic
                        title="Hadir"
                        value={presentaseData[desa.uuid].jumlah_hadir}
                      />
                      <Statistic
                        title="Presentase"
                        value={presentaseData[desa.uuid].persentase}
                        suffix="%"
                      />
                    </div>
                  </Card>
                ) : (
                  desa.uuid !== "all" && (
                    <Alert
                      message="Belum ada data kehadiran dari desa ini."
                      type="info"
                      showIcon
                      className="mb-4"
                    />
                  )
                )}

                <List
                  bordered
                  style={{ marginTop: 10 }}
                  dataSource={kehadiran}
                  renderItem={(item) => (
                    <List.Item>
                      <Text strong>{item.nama}</Text>
                      <Text type="secondary">
                        {new Date(item.waktu_absen).toLocaleString()}
                      </Text>
                    </List.Item>
                  )}
                />
              </>
            ) : (
              <Alert
                message="Tidak ada data kehadiran untuk kegiatan ini"
                type="info"
                showIcon
              />
            ),
        }))}
      />
    </div>
  );
};

export default KehadiranList;
