import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

interface IdProp {
  userData: {
    _id: string;
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
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType>({
    firstName: "",
    lastName: "",
    username: "",
  });
  const [emailInfo, setEmailInfo] = useState<EmailInfoType>({
    email: "",
  });
  const [confirmEmail, setConfirmEmail] = useState<string>("");

  const [password, setPassword] = useState<string>("");

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
        navigate("/");
        console.log("Logged out successfully");
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

      const response = await axios.put(
        `/updateUser/${userData._id}`,
        personalInfo
      );

      if (response) {
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
      const verificationResponse = await axios.post("/newEmailVerification", {
        email: emailInfo.email,
      });

      if (verificationResponse.status === 201) {
        setEmailInfo({ email: "" });
        setConfirmEmail("");
        toast.success("A new verification link has been sent to your email.");
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
                  className={`list-group-item list-group-item-action ${
                    activeTab === "accountDetails" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("accountDetails")}
                >
                  Personal
                </a>
                <a
                  href="#"
                  className={`list-group-item list-group-item-action ${
                    activeTab === "changeEmail" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("changeEmail")}
                >
                  Email
                </a>
                <a
                  href="#"
                  className={`list-group-item list-group-item-action ${
                    activeTab === "changePassword" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("changePassword")}
                >
                  Password
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
              {/* Personal Info */}
              {activeTab === "accountDetails" && (
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
                          type="password"
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
                          name="password"
                          id="password"
                          value=""
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
                          value=""
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
                          value=""
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
                        >
                          Save
                        </button>
                        <button
                          type="reset"
                          className="btn btn-default"
                          value="Update Information"
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
