import { Link, useNavigate } from "react-router-dom";

const ProfileNavbar = () => {
    const Navigate = useNavigate();
    const handleNavigateHome = () => {
        Navigate("/")
      };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid" style={{ maxWidth: "1800px" }}>
                    <Link to="/" className="navbar-brand link-unstyled">
                        QuikBlok
                    </Link>

                    <div onClick={handleNavigateHome} style={{ textDecoration: 'none', color: 'inherit', cursor: "pointer"}}>
                        <div style={{fontSize: "25px"}}>Go Back</div>
                    </div>

                </div>
            </nav>
        </>
    )
}

export default ProfileNavbar