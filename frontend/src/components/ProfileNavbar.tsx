import { Link } from "react-router-dom";
import BackButton from "../assets/back-button.png";

const ProfileNavbar = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid" style={{ maxWidth: "1800px" }}>
                    <Link to="/Home" className="navbar-brand link-unstyled">
                        QuikBlok
                    </Link>

                    <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <img
                            src={BackButton}
                            alt="Back arrow"
                            width={50}
                        />
                    </Link>

                </div>
            </nav>
        </>
    )
}

export default ProfileNavbar