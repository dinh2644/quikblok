import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

const PublicRoutes = () => {
    const [cookies] = useCookies(["token"]);

    return cookies.token ? (
        <>
            <Navigate to="/Home" replace />
        </>
    ) : (
        <>
            <Outlet />
        </>

    );
};

export default PublicRoutes;
