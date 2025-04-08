import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Tabs, Spin, Alert, List, Typography, Card, Statistic } from "antd";
import useGetMe from "../../../hooks/useFetchUserData";

const { Title, Text } = Typography;

const KehadiranList = () => {
  const { id_kegiatan } = useParams();
  const { user } = useGetMe();
  const [kehadiran, setKehadiran] = useState([]);
  const [allKehadiran, setAllKehadiran] = useState([]); // Semua data kehadiran
  const [desaList, setDesaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [presentase, setPresentase] = useState(null);

  useEffect(() => {
    const fetchData = async (id_desa) => {
      try {
        // Fetch attendance data for the activity and village
        const kehadiranRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/kehadiran/${id_kegiatan}/desa/${id_desa}`
        );
        
        // Fetch groups data for the village
        const kelompokRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/kelompok/desa/${id_desa}`
        );

        // Fetch attendance percentage
        const presentaseRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/presentase/kehadiran/desa/${id_kegiatan}/${id_desa}`
        );

        if (kehadiranRes.data && kelompokRes.data && presentaseRes.data) {
          setAllKehadiran(kehadiranRes.data.data || []);
          setKehadiran(kehadiranRes.data.data || []);
          setPresentase(presentaseRes.data.data);
          
          // Create tabs for groups
          const kelompokTabs = kelompokRes.data.map(kelompok => ({
            uuid: kelompok.uuid,
            nama: kelompok.kelompok
          }));
          
          setDesaList([{ uuid: "all", nama: "Semua Kelompok" }, ...kelompokTabs]);
        }
      } catch (err) {
        console.error("Error Fetching:", err);
        
        if (err.response?.status === 404) {
          setAllKehadiran([]);
          setKehadiran([]);
          setDesaList([{ uuid: "all", nama: "Semua Kelompok" }]);
        } else {
          setError("Terjadi kesalahan dalam mengambil data.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.id_desa) {
      fetchData(user.id_desa);
    }
  }, [id_kegiatan, user]);

  if (loading) return <Spin size="large" />;
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div className="container mx-auto p-4">
      <Title level={3}>Daftar Kehadiran</Title>

      {/* Presentase Kehadiran */}
      {presentase && (
        <Card className="mb-6">
          <div className="flex gap-8">
            <Statistic
              title="Total Remaja"
              value={presentase.total_remaja}
            />
            <Statistic
              title="Hadir"
              value={presentase.jumlah_hadir}
            />
            <Statistic
              title="Presentase"
              value={presentase.persentase}
              suffix="%"
            />
          </div>
        </Card>
      )}

      {/* Tabs untuk memilih kelompok */}
      <Tabs
        defaultActiveKey="all"
        onChange={(kelompokId) => {
          const filteredData =
            kelompokId === "all"
              ? allKehadiran
              : allKehadiran.filter((item) => item.id_kelompok === kelompokId);
          setKehadiran(filteredData);
        }}
      >
        {desaList.map((kelompok) => (
          <Tabs.TabPane tab={kelompok.nama} key={kelompok.uuid}>
            {kehadiran.length > 0 ? (
              <List
                bordered
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
            ) : (
              <Alert
                message="Tidak ada data kehadiran untuk kegiatan ini."
                type="info"
                showIcon
              />
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default KehadiranList;
