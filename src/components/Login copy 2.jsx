import { useState } from "react";
import { Input, Button } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import Logo from "../assets/logo.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-5">
      {/* Image */}

      {/* Login container */}
      <div className="bg-white flex flex-col md:flex-row rounded-2xl shadow-lg max-w-3xl p-5 items-center w-full md:w-auto">
        {/* Form */}
        <div className="md:w-1/2 px-8 md:px-16">
          <h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
          <p className="text- mt-4 text-[#002D74]">
            If you are already a member, easily log in
          </p>

          <form className="flex flex-col gap-4 mt-8">
            <Input
              size="large"
              placeholder="Username"
              prefix={<UserOutlined className="text-gray-400" />}
            />
            <Input.Password
              size="large"
              placeholder="Password"
              prefix={<LockOutlined className="text-gray-400" />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <Button
              type="primary"
              size="large"
              className="bg-[#002D74] hover:scale-105 duration-300"
            >
              Login
            </Button>
          </form>
        </div>

        {/* Image */}
        <div className="hidden md:block w-1/2">
          <img className="rounded-2xl bg-blue-400" src={Logo} alt="Login" />
        </div>
      </div>
    </section>
  );
};

export default Login;
