import React, { useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import axios from "axios";
import Cookies from "js-cookie";

// Komponen EditPassword
const EditPassword = ({ isModalOpen, setIsModalOpen }) => {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm(); // Hook untuk menangani form

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields(); // Reset form saat modal ditutup
  };

  const handleSubmit = async () => {
    // Ambil nilai dari form
    const values = form.getFieldsValue();
    const { oldPassword, newPassword, confirmPassword } = values;

    // console.log("Data yang dikirim ke server:", {
    //   oldPassword,
    //   newPassword,
    //   confirmPassword,
    // });

    try {
      const accessToken = Cookies.get("accessToken");

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/update-password`,
        { oldPassword, newPassword, confirmPassword },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true, // Pastikan ini untuk mengirim cookie
        }
      );

      message.success(response.data.msg);
    } catch (error) {
      console.error("Response error:", error.response?.data);
      message.error(error.response?.data?.msg || "Update password gagal");
    }
  };

  return (
    <Modal
      title="Update Password"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Password Lama"
          name="oldPassword"
          rules={[{ required: true, message: "Password lama diperlukan" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Password Baru"
          name="newPassword"
          rules={[{ required: true, message: "Password baru diperlukan" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Konfirmasi Password Baru"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Konfirmasi password diperlukan" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Konfirmasi password tidak cocok!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPassword;
