import { Outlet, Navigate } from "react-router-dom";
import Footer from "./Footer";
import { useAuthContext } from "../hooks/useAuthContext";



const PrivateRoutes = () => {
  //const [cookies] = useCookies(["token"]);
  const currentYear = new Date().getFullYear();
  const { user } = useAuthContext();
  return user ? (
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
