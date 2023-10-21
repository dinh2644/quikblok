import Blocks from "../components/Blocks";
import NewBlock from "../components/NewBlock";
import Navbar from "../components/Navbar";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";

const Home = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;

  return (
    <>
      <Navbar />
      {user ? <Blocks /> : null}

      <NewBlock />
    </>
  );
};

export default Home;
