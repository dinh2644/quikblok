import { Outlet, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Navbar from "./Navbar";

interface UsernameProps {
  userData: {
    firstName: string;
  };
}

const PrivateRoutes = ({ userData }: UsernameProps) => {
  const [cookies] = useCookies(["token"]);

  return cookies.token ? (
    <>
      {" "}
      <Navbar username={userData.firstName} /> <Outlet />{" "}
    </>
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoutes;
