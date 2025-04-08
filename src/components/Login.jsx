import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/kmmlink.png";
import { Input, Button, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
          credentials: "include", // Menggunakan cookie HttpOnly
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        message.success("Login Berhasil");
        login(data.accessToken, data.role);
      } else {
        setError(data.msg || "Login gagal. Silakan coba lagi.");
        message.error(error);
      }
    } catch (error) {
      message.error("Login Gagal. Periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
      <div className="flex flex-col md:flex-row bg-white p-4 shadow-lg rounded-[30px] overflow-hidden w-[930px] box-area">
        {/* Left Box */}
        <div className="md:w-1/2 bg-[#0385ff] rounded-[30px] flex flex-col justify-center items-center left-box">
          <img src={logo} alt="Logo" className="w-64" />
          {/* <p className="text-white text-2xl font-semibold text-center">
            KMM Bandar Lampung
          </p> */}
        </div>
        {/* Right Box */}
        <div className="md:w-1/2 p-10 right-box">
          <h2 className="text-2xl font-bold text-black">Login</h2>
          <p className="text-gray-600 mb-6">
            Jika anda ingin masuk harap login terlebih dahulu
          </p>
          {/* Alert */}
          {error && (
            <div
              role="alert"
              className="alert alert-error t mb-3 bg-red-400/20"
            >
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-4">
              <Input
                size="large"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                prefix={<UserOutlined className="text-gray-400" />}
              />
              <Input.Password
                size="large"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                prefix={<LockOutlined className="text-gray-400" />}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
              <Button
                type="primary"
                size="large"
                className="bg-[#0385ff] hover:scale-105 duration-300"
                disabled={loading}
                htmlType="submit"
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </div>
          </form>
          <p className="mt-4 text-gray-600 text-center">
            Don't have an account?{" "}
            <a href="#" className="text-[#0385ff]">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
