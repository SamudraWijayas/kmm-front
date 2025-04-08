import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Spin,
  TimePicker,
} from "antd";
import axios from "axios";

function AddKegiatan({ onAddData }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [desaList, setDesaList] = useState([]);
  const [tingkat, setTingkat] = useState("");
  const [form] = Form.useForm();

  const fetchDesa = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/desa`
      );
      setDesaList(response.data);
    } catch (error) {
      message.error("Gagal memuat data desa!");
      console.error("Error fetching desa data:", error);
    }
  };

  useEffect(() => {
    fetchDesa();
  }, []);

  const showModal = () => {
    setOpen(true);
  };

  const handleTingkatChange = (value) => {
    setTingkat(value);
    form.setFieldsValue({ tingkat: value, id_desa: undefined });
  };

  const handleOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();

      // Konversi tanggal dan waktu ke format string
      const formattedValues = {
        ...values,
        tanggal: values.tanggal.format("YYYY-MM-DD"),
        waktu_mulai: values.waktu_mulai.format("HH:mm:ss"),
        waktu_selesai: values.waktu_selesai.format("HH:mm:ss"),
      };

      console.log("Formatted Form values:", formattedValues); // Debugging

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/kegiatan`,
        formattedValues,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        message.success("Data berhasil disubmit!");
        if (onAddData) onAddData();
        setOpen(false);
        form.resetFields();
      }
    } catch (error) {
      console.error("Error during submission:", error);
      message.error("Gagal menambahkan kegiatan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
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
      <Button type="primary" onClick={showLoading} className="add-btn">
        Tambah Data
      </Button>

      <Modal
        open={open}
        title="Tambah Data Kegiatan"
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            Batal
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Simpan
          </Button>,
        ]}
        className="custom-modal"
        onCancel={() => setOpen(false)}
      >
        <Spin spinning={loading} size="large">
          <Form form={form} layout="vertical" name="kegiatanForm">
            <Form.Item
              name="kegiatan"
              label="Nama Kegiatan"
              rules={[
                { required: true, message: "Tolong masukkan nama kegiatan!" },
              ]}
            >
              <Input placeholder="Masukkan nama kegiatan" />
            </Form.Item>

            <Form.Item
              name="tingkat"
              label="Pilih Tingkat"
              rules={[{ required: true, message: "Tolong pilih tingkat!" }]}
            >
              <Select
                placeholder="Pilih tingkat"
                onChange={handleTingkatChange}
              >
                <Select.Option value="desa">Desa</Select.Option>
                <Select.Option value="daerah">Daerah</Select.Option>
              </Select>
            </Form.Item>

            {tingkat === "desa" && (
              <Form.Item
                name="id_desa"
                label="Pilih Desa"
                rules={[{ required: true, message: "Tolong pilih desa!" }]}
              >
                <Select placeholder="Pilih desa">
                  {desaList.map((desa) => (
                    <Select.Option key={desa.uuid} value={desa.uuid}>
                      {desa.desa}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              name="tanggal"
              label="Tanggal"
              rules={[{ required: true, message: "Tolong pilih tanggal!" }]}
            >
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>

            <Form.Item
              name="waktu_mulai"
              label="Waktu Mulai"
              rules={[{ required: true, message: "Tolong pilih waktu mulai!" }]}
            >
              <TimePicker format="HH:mm:ss" className="w-full" />
            </Form.Item>

            <Form.Item
              name="waktu_selesai"
              label="Waktu Selesai"
              rules={[
                { required: true, message: "Tolong pilih waktu selesai!" },
              ]}
            >
              <TimePicker format="HH:mm:ss" className="w-full" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}

export default AddKegiatan;
