import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Radio,
  Upload,
  message,
  Spin,
} from "antd";
import { FaPlus } from "react-icons/fa6";
import { IoMdCloudUpload } from "react-icons/io";
import axios from "axios";


function AddGenerus({ onAddData }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm(); // Hook untuk menangani form
  const [fileList, setFileList] = useState([]); // State untuk file yang diupload
  const [kelompokList, setKelompokList] = useState([]); // State untuk kelompok data
  const [desaList, setDesaList] = useState([]); // State untuk desa data
  const [kelompokByDesa, setKelompokByDesa] = useState([]); // Kelompok berdasarkan desa yang dipilih
  const [selectedDesa, setSelectedDesa] = useState(null); // Desa yang dipilih
  const [uploadStatus, setUploadStatus] = useState(""); // Status upload (valid/invalid)
  const [selectedJenjang, setSelectedJenjang] = useState(null); // Jenjang yang dipilih

  const fetchKelompok = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/kelompok`
      );
      const data = await response.json();
      setKelompokList(data); // Simpan data kelompok ke state
    } catch (error) {
      message.error("Gagal memuat data kelompok!");
      console.error("Error fetching kelompok data:", error);
    }
  };

  const fetchDesa = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/desa`);
      const data = await response.json();
      setDesaList(data); // Simpan data desa ke state
    } catch (error) {
      message.error("Gagal memuat data desa!");
      console.error("Error fetching desa data:", error);
    }
  };

  useEffect(() => {
    fetchKelompok(); // Ambil data kelompok saat komponen dimuat
    fetchDesa();
  }, []); // Hanya dijalankan sekali saat komponen dimuat

  const handleDesaChange = (value) => {
    setSelectedDesa(value);
    // Filter kelompok berdasarkan desa yang dipilih
    const filteredKelompok = kelompokList.filter(
      (kelompok) => kelompok.id_desa === value
    );
    setKelompokByDesa(filteredKelompok);
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields(); // Validasi form
      // console.log("Form Values:", values);

      // Buat FormData untuk mengirimkan data form dan gambar
      const formData = new FormData();
      formData.append("nama", values.nama);
      formData.append("id_kelompok", values.id_kelompok);
      formData.append("id_desa", values.id_desa);
      formData.append("jenjang", values.jenjang);
      formData.append("tgl_lahir", values.tgl_lahir.format("YYYY-MM-DD"));
      formData.append("jenis_kelamin", values.jenis_kelamin);
      formData.append("gol_darah", values.gol_darah);
      formData.append("nama_ortu", values.nama_ortu);
      formData.append("mahasiswa", values.mahasiswa);

      // Cek apakah ada file yang diupload
      if (fileList.length > 0) {
        formData.append("gambar", fileList[0].originFileObj); // Tambahkan gambar ke FormData
      }

      // Kirim form data dan gambar ke backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/generus`, // Endpoint backend
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setTimeout(() => {
          message.success("Data berhasil disubmit!");
          if (onAddData) onAddData(); // Callback untuk memberi tahu komponen induk
          setOpen(false);
          form.resetFields(); // Reset form setelah submit
          setFileList([]); // Reset file list setelah submit
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.log("Form validation failed:", error);
      message.error("Submission gagal. Coba lagi.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields(); // Reset form ketika modal ditutup
    setFileList([]); // Reset file list ketika modal ditutup
    setUploadStatus(""); // Reset upload status
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
      const isSmallEnough = file.size <= 3 * 1024 * 1024; // 2MB max size

      if (!isJpgOrPng) {
        setUploadStatus("invalid-type");
      } else if (!isSmallEnough) {
        setUploadStatus("invalid-size");
      } else {
        setUploadStatus("valid");
      }
    }
  };

  const uploadButtonStyle = () => {
    // if (uploadStatus === "valid") return { borderColor: "green" };
    if (uploadStatus === "invalid-type" || uploadStatus === "invalid-size")
      return { borderColor: "red" };
    return {};
  };

  const handleJenjangChange = (value) => {
    setSelectedJenjang(value); // Simpan jenjang yang dipilih
  };

  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    // Simulasi loading selesai dalam 2 detik.
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };
  return (
    <>
      <Button
        type="primary"
        onClick={showLoading}
        className="btns d-flex align-items-center add-btn"
      >
        Add Data
      </Button>

      <Modal
        open={open}
        title="Tambah Data Generus"
        onOk={handleOk}
        footer={[
          <Button key="back" onClick={showLoading}>
            Kembali
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Kirim
          </Button>,
        ]}
        className="custom-modal"
        // loading={loading}
        onCancel={() => setOpen(false)}
      >
        <Spin spinning={loading} size="large">
          <Form
            form={form}
            layout="vertical"
            name="generusForm"
            initialValues={{
              jenis_kelamin: "L", // Nilai default untuk jenis kelamin
            }}
          >
            <Form.Item
              name="nama"
              label="Nama"
              rules={[{ required: true, message: "Tolong masukkan nama!" }]}
            >
              <Input placeholder="Masukkan nama" />
            </Form.Item>

            <Form.Item
              name="id_desa"
              label="Desa"
              rules={[{ required: true, message: "Tolong pilih desa!" }]}
            >
              <Select placeholder="Pilih Desa" onChange={handleDesaChange}>
                {desaList.length > 0 ? (
                  desaList.map((desa) => (
                    <Select.Option key={desa.uuid} value={desa.uuid}>
                      {desa.desa}
                    </Select.Option>
                  ))
                ) : (
                  <Select.Option value="" disabled>
                    Tidak ada desa
                  </Select.Option>
                )}
              </Select>
            </Form.Item>

            <Form.Item
              name="id_kelompok"
              label="Kelompok"
              rules={[{ required: true, message: "Tolong pilih kelompok!" }]}
            >
              <Select placeholder="Pilih Kelompok">
                {kelompokByDesa.length > 0 ? (
                  kelompokByDesa.map((kelompok) => (
                    <Select.Option key={kelompok.uuid} value={kelompok.uuid}>
                      {kelompok.kelompok}
                    </Select.Option>
                  ))
                ) : (
                  <Select.Option value="" disabled>
                    Tidak ada kelompok
                  </Select.Option>
                )}
              </Select>
            </Form.Item>

            {/* Input lainnya */}
            <Form.Item
              name="tahapan"
              label="Tahapan"
              rules={[{ required: true, message: "Tolong pilih jenjang!" }]}
            >
              <Select
                placeholder="Pilih jenjang"
                onChange={(value) => {
                  handleJenjangChange(value); // Perbarui state jenjang
                  form.setFieldValue("kelas", undefined); // Reset nilai kelas saat jenjang berubah
                }}
              >
                <Select.Option value="Paud/TK">Paud/TK</Select.Option>
                <Select.Option value="Caberawit">Caberawit</Select.Option>
                <Select.Option value="Pra Remaja">Pra Remaja</Select.Option>
                <Select.Option value="Remaja">Remaja</Select.Option>
                <Select.Option value="Pra Nikah">Pra Nikah</Select.Option>
              </Select>
            </Form.Item>

            {/* Kelas tergantung pada pilihan jenjang */}
            {selectedJenjang && (
              <Form.Item
                name="jenjang"
                label="Jenjang"
                rules={[{ required: true, message: "Tolong pilih kelas!" }]}
              >
                <Select placeholder="Pilih Jenjang">
                  {selectedJenjang === "Paud/TK" && (
                    <>
                      <Select.Option value="Paud">Paud</Select.Option>
                      <Select.Option value="TK">TK</Select.Option>
                    </>
                  )}
                  {selectedJenjang === "Caberawit" && (
                    <>
                      <Select.Option value="1">Kelas 1</Select.Option>
                      <Select.Option value="2">Kelas 2</Select.Option>
                      <Select.Option value="3">Kelas 3</Select.Option>
                      <Select.Option value="4">Kelas 4</Select.Option>
                      <Select.Option value="5">Kelas 5</Select.Option>
                      <Select.Option value="6">Kelas 6</Select.Option>
                    </>
                  )}
                  {selectedJenjang === "Pra Remaja" && (
                    <>
                      <Select.Option value="7">Kelas 7</Select.Option>
                      <Select.Option value="8">Kelas 8</Select.Option>
                      <Select.Option value="9">Kelas 9</Select.Option>
                    </>
                  )}
                  {selectedJenjang === "Remaja" && (
                    <>
                      <Select.Option value="10">Kelas 10</Select.Option>
                      <Select.Option value="11">Kelas 11</Select.Option>
                      <Select.Option value="12">Kelas 12</Select.Option>
                    </>
                  )}
                  {selectedJenjang === "Pra Nikah" && (
                    <>
                      <Select.Option value="Pra Nikah">Pra Nikah</Select.Option>
                    </>
                  )}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              name="tgl_lahir"
              label="Tanggal Lahir"
              rules={[
                { required: true, message: "Tolong pilih tanggal lahir!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="jenis_kelamin"
              label="Jenis Kelamin"
              rules={[
                { required: true, message: "Tolong pilih jenis kelamin!" },
              ]}
            >
              <Radio.Group>
                <Radio value="L">Laki-laki</Radio>
                <Radio value="P">Perempuan</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="gol_darah"
              label="Golongan Darah"
              rules={[
                { required: true, message: "Tolong pilih golongan darah!" },
              ]}
            >
              <Select placeholder="Pilih golongan darah">
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
                { required: true, message: "Tolong masukkan nama orang tua!" },
              ]}
            >
              <Input placeholder="Masukkan nama orang tua" />
            </Form.Item>

            {/* Form Item untuk mengupload gambar */}
            <Form.Item
              name="gambar"
              label="Upload Gambar (Opsional)"
              valuePropName="fileList"
              getValueFromEvent={({ fileList }) => fileList}
              extra="Klik untuk upload gambar (max 2mb)"
            >
              <Upload
                name="gambar"
                listType="picture"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={(file) => {
                  const isJpgOrPng =
                    file.type === "image/jpeg" || file.type === "image/png";
                  const isSmallEnough = file.size <= 3 * 1024 * 1024; // 2MB max size

                  if (!isJpgOrPng) {
                    setUploadStatus("invalid-type");
                    message.error("Format gambar harus JPG atau PNG.");
                  } else if (!isSmallEnough) {
                    setUploadStatus("invalid-size");
                    message.error("Ukuran gambar tidak boleh lebih dari 2MB.");
                  } else {
                    setUploadStatus("valid");
                    message.success("Gambar valid dan siap diunggah.");
                  }

                  return false; // Prevent automatic upload
                }}
                accept=".jpg,.jpeg,.png"
                className={
                  uploadStatus === "valid"
                    ? "upload-valid"
                    : uploadStatus.startsWith("invalid")
                    ? "upload-invalid"
                    : ""
                }
              >
                <Button icon={<IoMdCloudUpload />} style={uploadButtonStyle()}>
                  Klik untuk Upload
                </Button>
              </Upload>
              {/* Pesan tambahan jika gambar invalid */}
              {uploadStatus === "invalid-type" && (
                <div className="message-invalid">
                  Format gambar harus JPG atau PNG.
                </div>
              )}
              {uploadStatus === "invalid-size" && (
                <div className="message-invalid">
                  Ukuran gambar tidak boleh lebih dari 2MB.
                </div>
              )}
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}

export default AddGenerus;
