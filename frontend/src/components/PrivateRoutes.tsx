import { Outlet, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Footer from "./Footer";



const PrivateRoutes = () => {
  const [cookies] = useCookies(["token"]);
const currentYear = new Date().getFullYear();
  return cookies.token ? (
    <>
      {" "}
      <Outlet />{" "} 
<Footer year={currentYear} />
    </>
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoutes;
