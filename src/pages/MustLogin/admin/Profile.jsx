import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/kmmlink.png";
import Background from "../../../assets/back.jpg";
import axios from "axios";
import { Button, Form, Input, Upload, message, Skeleton, Spin } from "antd";
import { IoMdCloudUpload } from "react-icons/io";
import Cookies from "js-cookie";
import useGetMe from "../../../hooks/useFetchUserData";
import EditPassword from "../../../components/modal/EditPassword";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { user, loading, error } = useGetMe();

  useEffect(() => {
    if (user) {
      setUsername(user.username || ""); // Hindari nilai undefined
      setAvatarPreview(
        user.avatar
          ? `${import.meta.env.VITE_API_URL}${user.avatar}`
          : `${import.meta.env.VITE_API_URL}/uploads/avatar.png`
      );
    }
  }, [user]);

  const handleAvatarChange = (file) => {
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      message.error("Hanya file JPG atau PNG yang diperbolehkan.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
    setAvatar(file);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("username", username);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Pastikan ini untuk mengirim cookie
        }
      );
      message.success(response.data.msg);
    } catch (error) {
      console.error("Error during update:", error);
      if (error.response?.status === 401) {
        message.error("Session expired. Silakan login ulang.");
        Cookies.remove("accessToken");
        navigate("/login");
      } else {
        message.error(error.response?.data?.msg || "Update gagal");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div
        className="h-auto p-10 flex flex-col md:flex-row justify-between items-center"
        style={{ backgroundImage: `url(${Background})` }}
      >
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="w-16" />
          <div>
            <h3 className="text-xl font-semibold">
              Muda - Mudi Bandar Lampung
            </h3>
            <p className="text-sm">M2BL</p>
          </div>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button
            className="bg-blue-500 text-white"
            onClick={() => navigate("/dashboard")}
          >
            Beranda
          </Button>
          <Button
            className="bg-green-500 text-white"
            onClick={handleSubmit}
            loading={submitting}
          >
            Simpan
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-black">Edit Profil</h2>
          <Form>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600 mb-2">
                Username
              </label>
              <Input
                type="text"
                value={username}
                id="username"
                name="username"
                className="w-full px-3 py-2 border rounded-md"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
              <EditPassword
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />
            </div>
          </Form>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Ubah Password
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold mb-4">Foto Profil</h2>
          {loading ? (
            <Skeleton.Avatar size={150} shape="circle" />
          ) : (
            <img
              src={avatarPreview || null} // Pastikan null jika kosong
              alt="Avatar"
              className="w-40 h-40 rounded-full object-cover mx-auto"
            />
          )}
          <div className="mt-4">
            <Upload
              beforeUpload={(file) => {
                handleAvatarChange(file);
                return false;
              }}
              accept=".jpg,.jpeg,.png"
            >
              <Button icon={<IoMdCloudUpload />}>Ganti Foto</Button>
            </Upload>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
