import { Outlet, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Navbar from "./Navbar";

interface UsernameProps {
  username: string;
}

const PrivateRoutes = ({ username }: UsernameProps) => {
  const [cookies] = useCookies(["token"]);

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
