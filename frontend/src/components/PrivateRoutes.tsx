import { Outlet, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Navbar from "./Navbar";

const PrivateRoutes = () => {
  const [cookies] = useCookies(["token"]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const verifyCookie = async () => {
      const { data } = await axios.post(
        "http://localhost:8000",
        {},
        { withCredentials: true }
      );
      const { user } = data;
      setUsername(user);
    };
    verifyCookie();
  }, [cookies]);

  return cookies.token ? (
    <>
      {" "}
      <Navbar username={username} /> <Outlet />{" "}
    </>
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoutes;
