import { Outlet, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";



const PrivateRoutes = () => {
  const [cookies] = useCookies(["token"]);

  return cookies.token ? (
    <>
      {" "}
      <Outlet />{" "}
    </>
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoutes;
