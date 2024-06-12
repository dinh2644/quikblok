import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../assets/ProfilePage.css";
import { Link } from "react-router-dom";

interface IdProp {
  userData: {
    _id: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  };
}

interface PersonalInfoType {
  [key: string]: string;
}
interface EmailInfoType {
  [key: string]: string;
}
interface PasswordType {
  [key: string]: string;
}

const ProfilePage = ({ userData }: IdProp) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("accountDetails");
  // personal info
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType>({
    firstName: "",
    lastName: "",
    username: "",
  });
  // email
  const [emailInfo, setEmailInfo] = useState<EmailInfoType>({
    email: "",
  });
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  // password
  const [passwordInfo, setPasswordInfo] = useState<PasswordType>({
    password: "",
    oldPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // handle tab click
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  // logout user
  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        window.location.reload();

        navigate("/");

        console.log("Logged out successfully"); // do toast for this
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    setEmailInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    setPasswordInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // update personal info
  const handleUpdatePersonalInfo = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      if (
        personalInfo.firstName.trim() === "" ||
        personalInfo.firstName.trim().length < 2 ||
        personalInfo.lastName.trim() === "" ||
        personalInfo.lastName.trim().length < 2
      ) {
        toast.error(
          "First and last name cannot be empty and must be longer than 1 character."
        );
        return;
      }
      if (
        personalInfo.username.trim() === "" ||
        personalInfo.username.trim().length < 3
      ) {
        toast.error(
          "Username cannot be empty and must be 3 characters or longer."
        );
        return;
      }

      const response = await axios.put("/updatePersonalInfo", personalInfo);

      if (response.status === 200) {
        setPersonalInfo({
          firstName: "",
          lastName: "",
          username: "",
        });
        toast.success("Success! Your information has been updated.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // update email
  const handleUpdateEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (emailInfo.email.trim() !== confirmEmail.trim()) {
        toast.error("New emails don't match. Try again.");
        return;
      }

      const response = await axios.put("/updateEmail", {
        email: emailInfo.email,
      });

      if (response.status === 200) {
        setEmailInfo({ email: "" });
        setConfirmEmail("");
        toast.success("A new verification link has been sent to your email.");
        await axios.post("/newEmailVerification", {
          email: emailInfo.email,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // update password
  const handleUpdatePassword = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      if (!passwordInfo.password || passwordInfo.password.length < 6) {
        toast.error("New password must be at least 6 characters long.");
        return;
      }
      if (passwordInfo.password.trim() !== confirmPassword.trim()) {
        toast.error("New passwords don't match. Try again.");
        return;
      }

      const { data } = await axios.put("/updatePassword", passwordInfo);

      if (data.error) {
        toast.error(data.error);
        return;
      } else {
        setPasswordInfo({ password: "", oldPassword: "" });
        setConfirmPassword("");
        toast.success("Success! Your password has been updated.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
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
                  className={`list-group-item list-group-item-action ${activeTab === "accountDetails" ? "active" : ""
                    }`}
                  onClick={() => handleTabClick("accountDetails")}
                >
                  Your Account
                </a>
                <a
                  href="#"
                  className={`list-group-item list-group-item-action ${activeTab === "personalDetails" ? "active" : ""
                    }`}
                  onClick={() => handleTabClick("personalDetails")}
                >
                  Personal
                </a>
                <a
                  href="#"
                  className={`list-group-item list-group-item-action ${activeTab === "changeEmail" ? "active" : ""
                    }`}
                  onClick={() => handleTabClick("changeEmail")}
                >
                  Email
                </a>
                <a
                  href="#"
                  className={`list-group-item list-group-item-action ${activeTab === "changePassword" ? "active" : ""
                    }`}
                  onClick={() => handleTabClick("changePassword")}
                >
                  Password
                </a>
                <button
                  className="list-group-item list-group-item-action text-danger font-weight-bold"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#logoutModal"
                >
                  Log out
                </button>
              </div>
            </div>

            <div
              className="modal fade"
              id="logoutModal"
              tabIndex={-1}
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              {/* Logout modal */}
              <div className="modal-dialog modal-dialog-centered ">
                <div className="modal-content rounded-3 text-center logoutModalShape">
                  <div
                    className="modal-header border-0 "
                    style={{ margin: "0 auto", marginBottom: "-10px" }}
                  >
                    <h3 className="mt-1">Are you sure you want to log out?</h3>
                  </div>
                  <div className="modal-body logoutBody">
                    <button className="logoutBtn" onClick={handleLogout}>
                      Log Out
                    </button>
                    <button className="cancelBtn" data-bs-dismiss="modal">
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit form column */}
            <div className="col-md-9 personal-info">
              {/* Account information */}
              {activeTab === "accountDetails" && (
                <>
                  <div className="account-details">
                    <h3>Your Account Details</h3>
                    <div className="detail">
                      <h4>First Name:</h4>
                      <p>{userData.firstName}</p>
                    </div>
                    <div className="detail">
                      <h4>Last Name:</h4>
                      <p>{userData.lastName}</p>
                    </div>
                    <div className="detail">
                      <h4>Username:</h4>
                      <p>{userData.username}</p>
                    </div>
                    <div className="detail">
                      <h4>Email:</h4>
                      <p>{userData.email}</p>
                    </div>
                  </div>
                </>
              )}
              {/* Change personal */}
              {activeTab === "personalDetails" && (
                <>
                  <h3>Change Personal Info</h3>
                  <form className="form-horizontal" role="form">
                    <div className="form-group">
                      <label className="col-lg-3 control-label">
                        First name:
                      </label>
                      <div className="col-lg-8">
                        <input
                          className="form-control"
                          type="text"
                          value={personalInfo.firstName}
                          name="firstName"
                          id="firstName"
                          onChange={handleChange}
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
                          value={personalInfo.lastName}
                          name="lastName"
                          id="lastName"
                          onChange={handleChange}
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
                          value={personalInfo.username}
                          name="username"
                          id="username"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-3 control-label"></label>
                      <div className="col-md-8">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          value="Update Information"
                          onClick={handleUpdatePersonalInfo}
                        >
                          Update
                        </button>
                        <button
                          type="reset"
                          className="btn btn-default"
                          value="Update Information"
                          onClick={() => {
                            setPersonalInfo({
                              firstName: "",
                              lastName: "",
                              username: "",
                            });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}

              {/* Change Email */}
              {activeTab === "changeEmail" && (
                <>
                  <h3>Change Email</h3>
                  <form className="form-horizontal" role="form">
                    <div className="form-group">
                      <label className="col-md-3 control-label">
                        New Email:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          type="email"
                          name="email"
                          id="email"
                          value={emailInfo.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-3 control-label">
                        Confirm Email:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          type="email"
                          name="confirmEmail"
                          id="confirmEmail"
                          value={confirmEmail}
                          onChange={(e) => {
                            setConfirmEmail(e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-3 control-label"></label>
                      <div className="col-md-8">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          value="Update Information"
                          onClick={handleUpdateEmail}
                        >
                          Save
                        </button>
                        <button
                          type="reset"
                          className="btn btn-default"
                          value="Update Information"
                          onClick={() => {
                            setEmailInfo({
                              email: "",
                            });
                            setConfirmEmail("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}

              {/* Change Password */}
              {activeTab === "changePassword" && (
                <>
                  <h3>Change Password</h3>
                  <form className="form-horizontal" role="form">
                    <div className="form-group">
                      <label className="col-md-3 control-label">
                        Old Password:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          type="password"
                          name="oldPassword"
                          id="oldPassword"
                          value={passwordInfo.oldPassword}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-md-3 control-label">
                        New password:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          type="password"
                          name="password"
                          value={passwordInfo.password}
                          onChange={handleChange}
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
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <Link to="/forgotPassword" style={{ textDecoration: 'none', fontSize: '15px', paddingLeft: '3px' }}>Forgot Password</Link>


                    <div className="form-group">
                      <label className="col-md-3 control-label"></label>
                      <div className="col-md-8">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          value="Update Information"
                          onClick={handleUpdatePassword}
                        >
                          Save
                        </button>
                        <button
                          type="reset"
                          className="btn btn-default"
                          value="Update Information"
                          onClick={() => {
                            setConfirmPassword("");
                            setPasswordInfo({ password: "", oldPassword: "" });
                          }}
                        >
                          Cancel
                        </button>
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
