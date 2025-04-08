import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Tabs,
  Spin,
  Alert,
  List,
  Typography,
  Card,
  Statistic,
  Upload,
  Button,
  message,
  Image,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useGetMe from "../../../hooks/useFetchUserData";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const KehadiranList = () => {
  const { id_kegiatan } = useParams();
  const { user } = useGetMe();
  const [kehadiran, setKehadiran] = useState([]);
  const [allKehadiran, setAllKehadiran] = useState([]);
  const [desaList, setDesaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [presentase, setPresentase] = useState(null);
  const [kegiatan, setKegiatan] = useState(null);
  const [fileList, setFileList] = useState([]);

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

  useEffect(() => {
    const fetchData = async (id_desa) => {
      try {
        const kehadiranRes = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/kehadiran/${id_kegiatan}/desa/${id_desa}`
        );

        const kelompokRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/kelompok/desa/${id_desa}`
        );

        const presentaseRes = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/presentase/kehadiran/desa/${id_kegiatan}/${id_desa}`
        );

        if (kehadiranRes.data && kelompokRes.data && presentaseRes.data) {
          setAllKehadiran(kehadiranRes.data.data || []);
          setKehadiran(kehadiranRes.data.data || []);
          setPresentase(presentaseRes.data.data);

          const kelompokTabs = kelompokRes.data.map((kelompok) => ({
            uuid: kelompok.uuid,
            nama: kelompok.kelompok,
          }));

          setDesaList([
            { uuid: "all", nama: "Semua Kelompok" },
            ...kelompokTabs,
          ]);
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

  const [tidakHadir, setTidakHadir] = useState([]);
  const [allTidakHadir, setAllTidakHadir] = useState([]);

  useEffect(() => {
    const fetchTidakHadir = async (id_desa) => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/tidak-hadir/${id_kegiatan}/desa/${id_desa}`
        );
        console.log("Tidak Hadir Response:", res.data); // Debug log
        if (res.data.success) {
          const data = res.data.data || [];
          console.log("Tidak Hadir Data:", data); // Debug log
          setAllTidakHadir(data);
          setTidakHadir(data);
        }
      } catch (err) {
        console.error("Gagal mengambil data tidak hadir:", err);
      }
    };

    if (user?.id_desa) {
      fetchTidakHadir(user.id_desa);
    }
  }, [id_kegiatan, user]);

  const items = desaList.map((kelompok) => ({
    key: kelompok.uuid,
    label: kelompok.nama,
    children: (
      <div className="space-y-4">
        <div>
          <Title level={5}>Yang Hadir</Title>
          {kehadiran.length > 0 &&
          (kelompok.uuid === "all" ||
            kehadiran.some((k) => k.id_kelompok === kelompok.uuid)) ? (
            <List
              bordered
              dataSource={
                kelompok.uuid === "all"
                  ? allKehadiran
                  : allKehadiran.filter(
                      (item) => item.id_kelompok === kelompok.uuid
                    )
              }
              renderItem={(item, index) => (
                <List.Item>
                  <Text strong>
                    {index + 1}. {item.nama}
                  </Text>
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
        </div>

        <div>
          <Title level={5}>Yang Tidak Hadir</Title>
          {allTidakHadir.length > 0 ? (
            <List
              bordered
              dataSource={
                kelompok.uuid === "all"
                  ? allTidakHadir
                  : allTidakHadir.filter(
                      (item) => item.id_kelompok === kelompok.uuid
                    )
              }
              renderItem={(item, index) => (
                <List.Item>
                  <Text strong>
                    {index + 1}. {item.nama}
                  </Text>
                  <Text type="secondary">Kelompok {item.kelompok}</Text>
                </List.Item>
              )}
            />
          ) : (
            <Alert
              message="Tidak ada data absen untuk kegiatan ini."
              type="info"
              showIcon
            />
          )}
        </div>
      </div>
    ),
  }));

  const [dokumentasi, setDokumentasi] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <UploadOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  useEffect(() => {
    const fetchDokumentasi = async () => {
      console.log("Fetching dokumentasi..."); // 👈 log ini

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dokumentasi/${id_kegiatan}`
        );
        console.log("RESPONS DOKUMENTASI:", res); // 👈 log seluruh response

        if (Array.isArray(res.data)) {
          console.log("DOKUMENTASI:", res.data);
          setDokumentasi(res.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data dokumentasi:", err);
      }
    };

    if (kegiatan) {
      fetchDokumentasi();
    }
  }, [id_kegiatan, kegiatan]);

  const handleUpload = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("gambar", file.originFileObj || file);
    });
    formData.append("id_kegiatan", id_kegiatan);

    setUploading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/dokumentasi`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data?.msg || res.data?.message) {
        message.success(res.data.msg || res.data.message);
      } else {
        message.success("Berhasil upload dokumentasi");
      }

      // Reset file list
      setFileList([]);

      // Update dokumentasi state with new data from response
      if (res.data?.data) {
        setDokumentasi((prev) => [...prev, ...res.data.data]);
      }
    } catch (err) {
      message.error(
        err.response?.data?.message || "Gagal mengupload dokumentasi"
      );
    } finally {
      setUploading(false);
    }
  };

  if (!kegiatan) return <Spin size="large" />;

  return (
    <div className="container">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Title level={3} className="!mb-0">
          Daftar Kehadiran {kegiatan?.kegiatan}
        </Title>

        <Link
          className="text-black mb-3"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("upload").scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          <Button type="primary">Upload Dokumentasi</Button>
        </Link>
      </div>

      {presentase && (
        <Card className="mb-6" style={{marginBottom: 10}}>
          <div className="flex gap-8">
            <Statistic title="Total Remaja" value={presentase.total_remaja} />
            <Statistic title="Hadir" value={presentase.jumlah_hadir} />
            <Statistic
              title="Presentase"
              value={presentase.persentase}
              suffix="%"
            />
          </div>
        </Card>
      )}

      <Tabs
        defaultActiveKey="all"
        items={items}
        onChange={(kelompokId) => {
          const filteredKehadiran =
            kelompokId === "all"
              ? allKehadiran
              : allKehadiran.filter((item) => item.id_kelompok === kelompokId);

          const filteredTidakHadir =
            kelompokId === "all"
              ? allTidakHadir
              : allTidakHadir.filter((item) => item.id_kelompok === kelompokId);

          setKehadiran(filteredKehadiran);
          setTidakHadir(filteredTidakHadir);
        }}
      />
      <Card
        title="Dokumentasi Kegiatan"
        className="mb-6"
        style={{ marginTop: 10 }}
      >
        <div id="upload">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={(file) => {
              const isLt4MB = file.size / 1024 / 1024 < 4;
              if (!isLt4MB) {
                message.error(`${file.name} melebihi ukuran maksimal 4MB`);
                return Upload.LIST_IGNORE;
              }
              return false;
            }}
            accept="image/*"
            multiple
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          <Button
            className="mt-2"
            type="primary"
            onClick={() => handleUpload(fileList)}
            disabled={fileList.length === 0}
            loading={uploading}
          >
            Upload Sekarang
          </Button>
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          {dokumentasi.map((doc) => {
            console.log(doc.gambar); // 👉 log path gambar
            return (
              <div key={doc.id}>
                <Image
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                  src={`${import.meta.env.VITE_API_URL}${doc.gambar}`}
                  alt="Dokumentasi Kegiatan"
                  className="rounded"
                />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default KehadiranList;
