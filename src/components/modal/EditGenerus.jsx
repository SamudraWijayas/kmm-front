import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  message,
  Row,
  Col,
  Spin,
  Radio,
} from "antd";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import { IoMdCloudUpload } from "react-icons/io";

function EditGenerus({ editData, onClose, onUpdate }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [desaList, setDesaList] = useState([]);
  const [kelompokList, setKelompokList] = useState([]);
  const [kelompokByDesa, setKelompokByDesa] = useState([]);
  const [tglLahir, setTglLahir] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [selectedJenjang, setSelectedJenjang] = useState(""); // Track selected jenjang
  const [selectedKelas, setSelectedKelas] = useState("");

  // Fetch Desa List
  const fetchDesa = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/desa`
      );
      setDesaList(response.data);
    } catch (error) {
      message.error("Gagal memuat data desa!");
    }
  };

  // Fetch Kelompok List
  const fetchKelompok = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/kelompok`
      );
      setKelompokList(response.data);
    } catch (error) {
      console.error("Error fetching kelompok:", error);
      message.error("Gagal memuat data kelompok!");
    }
  };

  // Fetch data by ID for editing
  const fetchDataById = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/generus/${id}`
      );
      const data = response.data;

      // Format the birth date correctly
      const tglLahir = moment(data.tgl_lahir);
      setTglLahir(tglLahir.isValid() ? tglLahir : null);

      // Set form values
      form.setFieldsValue({
        ...data,
        tgl_lahir: tglLahir.isValid() ? tglLahir : null,
      });

      // Set image if available
      if (data.gambar) {
        setFileList([
          {
            uid: "-1",
            name: "Gambar Profil",
            status: "done",
            url: `${import.meta.env.VITE_API_URL}${data.gambar}`,
          },
        ]);
      }

      // Set selected jenjang and kelas
      setSelectedJenjang(data.jenjang || "");
      setSelectedKelas(data.kelas || "");

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Gagal memuat data!");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editData?.id) {
      setLoading(true);
      fetchDataById(editData.id);
    }

    moment.locale("id");
    fetchDesa();
    fetchKelompok();
  }, [editData]);

  const handleDesaChange = (value) => {
    const filteredKelompok = kelompokList.filter(
      (kelompok) => kelompok.id_desa === value
    );
    setKelompokByDesa(filteredKelompok);
    form.setFieldsValue({ id_kelompok: null });
  };

  const handleUploadChange = (info) => {
    const { fileList } = info;
    setFileList(fileList);

    if (fileList.length === 0) {
      setUploadStatus(""); // Reset status jika tidak ada file
    } else {
      const file = fileList[0];
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      const isSmallEnough = file.size <= 2 * 1024 * 1024; // 2MB max size

      if (!isJpgOrPng) {
        setUploadStatus("invalid-type");
      } else if (!isSmallEnough) {
        setUploadStatus("invalid-size");
      } else {
        setUploadStatus("valid");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Format tanggal lahir
      const tglLahir = values.tgl_lahir.format("YYYY-MM-DD");

      // Menyiapkan form data untuk dikirim ke server
      const formData = new FormData();
      formData.append("nama", values.nama);
      formData.append("id_kelompok", values.id_kelompok);
      formData.append("id_desa", values.id_desa);
      formData.append("jenjang", values.jenjang);
      formData.append("tgl_lahir", tglLahir);
      formData.append("jenis_kelamin", values.jenis_kelamin);
      formData.append("gol_darah", values.gol_darah);
      formData.append("nama_ortu", values.nama_ortu);
      formData.append("mahasiswa", values.mahasiswa);

      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }

      // Jika ada gambar yang diupload, tambahkan ke formData
      if (fileList.length > 0 && fileList[0]?.originFileObj) {
        formData.append("gambar", fileList[0]?.originFileObj);
      }

      // Debug data yang akan dikirim
      // console.log("Data yang akan dikirim:", formData);

      // Kirim data ke server dengan method PUT dan tipe konten multipart/form-data
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/generus/${editData.id}`, // Pastikan id sesuai
        formData, // Kirim data FormData
        {
          headers: {
            "Content-Type": "multipart/form-data", // Menggunakan multipart untuk mengirim gambar
          },
        }
      );

      if (response.status === 200) {
        message.success("Data berhasil diperbarui!");
        onUpdate(); // Callback untuk memperbarui data di parent component
        onClose(); // Menutup modal
      } else {
        message.error("Gagal memperbarui data.");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      message.error("Gagal memperbarui data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={!!editData}
      title="Edit Data Generus"
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Batal
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Simpan
        </Button>,
      ]}
      className="custom-modal"
      width={800}
    >
      <Spin spinning={loading} size="large">
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={16} md={16} lg={16} xl={16}>
              <Form.Item
                name="nama"
                label="Nama"
                rules={[
                  { required: true, message: "Nama tidak boleh kosong!" },
                ]}
              >
                <Input placeholder="Masukkan nama" />
              </Form.Item>

              <Form.Item
                name="id_desa"
                label="Desa"
                rules={[
                  { required: true, message: "Desa tidak boleh kosong!" },
                ]}
              >
                <Select placeholder="Pilih Desa" onChange={handleDesaChange}>
                  {desaList.map((desa) => (
                    <Select.Option key={desa.uuid} value={desa.uuid}>
                      {desa.desa}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="id_kelompok"
                label="Kelompok"
                rules={[
                  { required: true, message: "Kelompok tidak boleh kosong!" },
                ]}
              >
                <Select placeholder="Pilih Kelompok">
                  {kelompokByDesa.length > 0
                    ? kelompokByDesa.map((kelompok) => (
                        <Select.Option
                          key={kelompok.uuid}
                          value={kelompok.uuid}
                        >
                          {kelompok.kelompok}
                        </Select.Option>
                      ))
                    : kelompokList.map((kelompok) => (
                        <Select.Option
                          key={kelompok.uuid}
                          value={kelompok.uuid}
                        >
                          {kelompok.kelompok}
                        </Select.Option>
                      ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="jenjang"
                label="Jenjang"
                rules={[{ required: true, message: "Pilih Jenjang!" }]}
              >
                <Select>
                  <Select.Option value="Paud">Paud</Select.Option>
                  <Select.Option value="TK">TK</Select.Option>
                  <Select.Option value="1">Kelas 1</Select.Option>
                  <Select.Option value="2">Kelas 2</Select.Option>
                  <Select.Option value="3">Kelas 3</Select.Option>
                  <Select.Option value="4">Kelas 4</Select.Option>
                  <Select.Option value="5">Kelas 5</Select.Option>
                  <Select.Option value="6">Kelas 6</Select.Option>
                  <Select.Option value="7">Kelas 7</Select.Option>
                  <Select.Option value="8">Kelas 8</Select.Option>
                  <Select.Option value="9">Kelas 9</Select.Option>
                  <Select.Option value="10">Kelas 10</Select.Option>
                  <Select.Option value="11">Kelas 11</Select.Option>
                  <Select.Option value="12">Kelas 12</Select.Option>
                  <Select.Option value="Pra Nikah">Pra Nikah</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="tgl_lahir"
                label="Tanggal Lahir"
                rules={[
                  {
                    required: true,
                    message: "Tanggal lahir tidak boleh kosong!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  value={tglLahir}
                  onChange={setTglLahir}
                  format="DD-MM-YYYY"
                />
              </Form.Item>

              <Form.Item
                name="jenis_kelamin"
                label="Jenis Kelamin"
                rules={[{ required: true, message: "Pilih jenis kelamin!" }]}
              >
                <Radio.Group>
                  <Radio value="L">Laki-laki</Radio>
                  <Radio value="P">Perempuan</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="gol_darah"
                label="Golongan Darah"
                rules={[{ required: true, message: "Pilih golongan darah!" }]}
              >
                <Select>
                  <Select.Option value="A">A</Select.Option>
                  <Select.Option value="B">B</Select.Option>
                  <Select.Option value="AB">AB</Select.Option>
                  <Select.Option value="O">O</Select.Option>
                  <Select.Option value="-">-</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="mahasiswa"
                label="Status Mahasiswa"
                rules={[
                  { required: true, message: "Tolong pilih status mahasiswa!" },
                ]}
              >
                <Select placeholder="Pilih">
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="non-Active">non-Active</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="nama_ortu"
                label="Nama Orang Tua"
                rules={[
                  {
                    required: true,
                    message: "Nama orang tua tidak boleh kosong!",
                  },
                ]}
              >
                <Input placeholder="Masukkan nama orang tua" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
              <Form.Item label="Upload Gambar">
                <Upload
                  name="gambar"
                  listType="picture"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={() => false}
                  accept=".jpg,.jpeg,.png"
                >
                  <Button icon={<IoMdCloudUpload />}>Pilih Gambar</Button>
                </Upload>
                {fileList.length > 0 && (
                  <img
                    src={fileList[0]?.url}
                    alt="Uploaded"
                    style={{ width: "100%", marginTop: 10 }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
}

export default EditGenerus;
