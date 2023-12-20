import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("accountDetails");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/");
        console.log("Logged out successfully");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section>
        <div className="container">
          <h1>Edit Profile</h1>
          <hr />
          <div className="row">
            {/* Left column - Tabs */}
            <div className="col-md-3">
              <div className="list-group">
                <a
                  href="#"
                  className={`list-group-item list-group-item-action ${
                    activeTab === "accountDetails" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("accountDetails")}
                >
                  Account Details
                </a>
                <a
                  href="#"
                  className={`list-group-item list-group-item-action ${
                    activeTab === "changePassword" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("changePassword")}
                >
                  Change Password
                </a>
                <button
                  className="list-group-item list-group-item-action text-danger font-weight-bold"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>

            {/* Edit form column */}
            <div className="col-md-9 personal-info">
              {activeTab === "accountDetails" && (
                <>
                  <h3>Personal info</h3>
                  <form className="form-horizontal" role="form">
                    <div className="form-group">
                      <label className="col-lg-3 control-label">
                        First name:
                      </label>
                      <div className="col-lg-8">
                        <input
                          className="form-control"
                          type="text"
                          value="Jane"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-lg-3 control-label">
                        Last name:
                      </label>
                      <div className="col-lg-8">
                        <input
                          className="form-control"
                          type="text"
                          value="Bishop"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-lg-3 control-label">Email:</label>
                      <div className="col-lg-8">
                        <input
                          className="form-control"
                          type="text"
                          value="janesemail@gmail.com"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-3 control-label">
                        Username:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          type="text"
                          value="janeuser"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-3 control-label"></label>
                      <div className="col-md-8">
                        <input
                          type="button"
                          className="btn btn-primary"
                          value="Save Changes"
                        />
                        <span></span>
                        <input
                          type="reset"
                          className="btn btn-default"
                          value="Cancel"
                        />
                      </div>
                    </div>
                  </form>
                </>
              )}

              {activeTab === "changePassword" && (
                <>
                  <h3>Change Password</h3>
                  <form className="form-horizontal" role="form">
                    <div className="form-group">
                      <label className="col-md-3 control-label">
                        Current Password:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          type="password"
                          value=""
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-md-3 control-label">
                        Confirm password:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          type="password"
                          value=""
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-3 control-label"></label>
                      <div className="col-md-8">
                        <input
                          type="button"
                          className="btn btn-primary"
                          value="Save Changes"
                        />
                        <span></span>
                        <input
                          type="reset"
                          className="btn btn-default"
                          value="Cancel"
                        />
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
        <hr />
      </section>
    </>
  );
};

export default ProfilePage;
