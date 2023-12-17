import Blocks from "../components/Blocks";
import NewBlock from "../components/NewBlock";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const Home = () => {
  // const userContext = useContext(UserContext);
  // const user = userContext?.user;
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      await axios.post("http://localhost:8000", {}, { withCredentials: true });
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  return (
    <>
      <Navbar />
      <Blocks />

      <NewBlock />
    </>
  );
};

export default Home;
