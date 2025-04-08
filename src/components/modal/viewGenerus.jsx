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
} from "antd";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";

function ViewGenerus({ editData, onClose }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [desaList, setDesaList] = useState([]);
  const [kelompokList, setKelompokList] = useState([]);
  const [kelompokByDesa, setKelompokByDesa] = useState([]);
  const [tglLahir, setTglLahir] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch list of desa
  const fetchDesa = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/desa`);
      setDesaList(response.data);
    } catch (error) {
      console.error("Error fetching desa:", error);
      message.error("Gagal memuat data desa!");
    }
  };

  // Fetch list of kelompok
  const fetchKelompok = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/kelompok`);
      setKelompokList(response.data);
    } catch (error) {
      console.error("Error fetching kelompok:", error);
      message.error("Gagal memuat data kelompok!");
    }
  };

  // Fetch data by ID
  const fetchDataById = async (id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/generus/${id}`);
      const data = response.data;

      // Set the date of birth if valid
      const tglLahir = moment(data.tgl_lahir);
      setTglLahir(tglLahir.isValid() ? tglLahir : null);

      // Set the form values
      form.setFieldsValue({
        ...data,
        tgl_lahir: tglLahir.isValid() ? tglLahir : null,
      });

      // Set the image if available
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

      // Simulasikan loading selama 3 detik
      setTimeout(() => {
        setLoading(false); // Matikan loading setelah 3 detik
      }, 1000);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Gagal memuat data!");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editData?.id) {
      setLoading(true); // Enable loading state
      fetchDataById(editData.id); // Fetch data by ID
    }

    moment.locale("id");
    fetchDesa();
    fetchKelompok();
  }, [editData]);

  return (
    <Modal
      open={!!editData}
      title="Lihat Data Generus"
      onCancel={onClose}
      footer={
        <Button key="back" onClick={onClose}>
          Tutup
        </Button>
      }
      className="custom-modal"
      width={800}
    >
      <Spin spinning={loading} size="large">
        <Row gutter={16}>
          <Col xs={24} sm={16} md={16} lg={16} xl={16}>
            <Form form={form} layout="vertical">
              <Form.Item name="nama" label="Nama">
                <Input disabled placeholder="Nama" />
              </Form.Item>

              <Form.Item name="id_desa" label="Desa">
                <Select disabled placeholder="Desa">
                  {desaList.map((desa) => (
                    <Select.Option key={desa.uuid} value={desa.uuid}>
                      {desa.desa}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="id_kelompok" label="Kelompok">
                <Select disabled placeholder="Kelompok">
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

              <Form.Item name="jenjang" label="Jenjang">
                <Input disabled placeholder="Jenjang" />
              </Form.Item>

              <Form.Item name="tgl_lahir" label="Tanggal Lahir">
                <DatePicker
                  style={{
                    width: "100%",
                    backgroundColor: "#f5f5f5",
                  }}
                  value={tglLahir}
                  format="DD-MM-YYYY"
                  disabled
                  inputReadOnly
                />
              </Form.Item>

              <Form.Item name="jenis_kelamin" label="Jenis Kelamin">
                <Input disabled placeholder="Jenis Kelamin" />
              </Form.Item>

              <Form.Item name="gol_darah" label="Golongan Darah">
                <Input disabled placeholder="Golongan Darah" />
              </Form.Item>

              <Form.Item name="nama_ortu" label="Nama Orang Tua">
                <Input disabled placeholder="Nama Orang Tua" />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <div>
              <Upload
                name="gambar"
                listType="picture"
                fileList={fileList}
                beforeUpload={() => false}
              />
              {fileList.length > 0 && (
                <img
                  src={fileList[0]?.url}
                  alt="Uploaded"
                  style={{ width: "100%", marginTop: 10 }}
                />
              )}
            </div>
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
}

export default ViewGenerus;
