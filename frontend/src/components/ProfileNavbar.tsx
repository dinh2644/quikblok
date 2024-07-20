import { Link } from "react-router-dom";

const ProfileNavbar = () => {

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid" style={{ maxWidth: "1800px" }}>
                    <Link to="/home" className="navbar-brand link-unstyled">
                        QuikBlok
                    </Link>
                    
                    <Link to="/home" style={{ textDecoration: 'none', color: 'inherit', cursor: "pointer",marginRight: "12px"}}>
                        <div style={{fontSize: "25px"}}>Go Back</div>
                    </Link>
                    

                </div>
            </nav>
        </>
    )
}

export default ProfileNavbar