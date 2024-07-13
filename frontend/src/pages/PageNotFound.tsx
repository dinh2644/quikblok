
import { Link } from "react-router-dom";
import "../assets/PageNotFound.css" 

const PageNotFound = () => {
  const isLoggedIn = localStorage.getItem('token')
  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold one">404</h1>
        <p className="fs-3 two">
          {" "}
          <span className="text-secondary ">Oops!</span> Page not found.
        </p>
        <p className="lead three">The page you’re looking for doesn’t exist.</p>
        <Link className="btn btn-secondary four" to={isLoggedIn ? "/" : "/login"}>
          <div style={{color: "white"}}>Return Home</div>
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;