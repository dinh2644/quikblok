import Blocks from "../components/Blocks";
import NewBlock from "../components/NewBlock";
import Navbar from "../components/Navbar";
// import { UserContext } from "../../context/userContext";
// import { useContext } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const Home = () => {
  // const userContext = useContext(UserContext);
  // const user = userContext?.user;
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      const { data } = await axios.post(
        "http://localhost:8000",
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      setUsername(user);
      return status
        ? null
        : (removeCookie("token", { path: "/" }), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  return (
    <>
      <Navbar username={username} />
      {username ? <Blocks /> : null}

      <NewBlock />
    </>
  );
};

export default Home;
