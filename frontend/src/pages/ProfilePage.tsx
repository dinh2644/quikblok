import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../assets/ProfilePage.css";
import { Link } from "react-router-dom";
import ProfileNavbar from "../components/ProfileNavbar";

interface UserProps {
  userData: {
    _id: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  };
}


interface StateObjectType {
  [key: string]: string;
}

const ProfilePage = ({userData}: UserProps) => {
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState("accountDetails");
  const [noOfBlocks, setNoOfBlocks] = useState<number>(0);
  // personal info
  const [personalInfo, setPersonalInfo] = useState<StateObjectType>({
    firstName: "",
    lastName: "",
    username: "",
  });
  // email
  const [emailInfo, setEmailInfo] = useState<StateObjectType>({
    email: "",
  });
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  // password
  const [passwordInfo, setPasswordInfo] = useState<StateObjectType>({
    password: "",
    oldPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  // delete account
  const [deletePassword, setDeletePassword] = useState<StateObjectType>({
    deletePassword: ""
  });
  const [confirmDelete, setConfirmDelete] = useState<string>("");

  // Get no. of blocks for display
  useEffect(()=>{
    const getNoOfBlocks = async() =>{
      try {
        const response = await axios.get("/getNoOfBlocks");
        setNoOfBlocks(response.data.count);

      } catch (error) {
        console.error("Can't get number of blocks", error);
      }
    } 
    getNoOfBlocks();
  }, [])

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
       window.location.href="/"  
      } else {
        toast.error("Logout failed")
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
    setDeletePassword((prev)=>{
      return {
        ...prev,
        [name]: value,
      }
    })
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

  // delete account
  const handleDeleteAccount = async (e: React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    try {

      if(deletePassword.deletePassword.trim() !== confirmDelete.trim()){
        toast.error("Confirm password does not match. Try again.");
        return;
      }
  
      const {data} = await axios.delete("/deleteAccount", {data: { password: deletePassword.deletePassword }})

      if(data.error){
        toast.error(data.error);
        return;
      }else{
        await axios.post(
          "/logout",
        );

        localStorage.removeItem('token')
        setTimeout(() => {
          navigate("/login")
        }, 1000);

        setDeletePassword({deletePassword: ""})
        setConfirmDelete("")
        toast('Account Deleted! Sorry to see you go.', {
          icon: '🥺',
        });
      }
      
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
  

  return (
    <>
      <section>
      <ProfileNavbar/>
        <div className="container"> 
          <h1 style={{marginTop: "15px"}}>Edit Profile</h1>      
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
                <a
                  href="#"
                  className={`list-group-item list-group-item-action ${activeTab === "deleteAccount" ? "active" : ""
                    }`}
                  onClick={() => handleTabClick("deleteAccount")}
                >
                  Delete Account
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

            {/* Logout modal */}
            <div
              className="modal fade"
              id="logoutModal"
              tabIndex={-1}
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-3 text-center logoutModalShape">
                  <div
                    className="modal-header border-0 "
                    style={{ margin: "0 auto", marginBottom: "-10px" }}
                  >
                    <h3 className="mt-1">Are you sure you want to log out?</h3>
                  </div>
                  <div className="modal-body logoutBody">
                    <button className="logoutBtn" onClick={handleLogout} data-bs-dismiss="modal">
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
                      <p>{userData?.firstName}</p>
                      <hr style={{marginTop: "5px"}}/>
                    </div>
                    <div className="detail">
                      <h4>Last Name:</h4>
                      <p>{userData?.lastName}</p>
                      <hr style={{marginTop: "5px"}}/>
                    </div>
                    <div className="detail">
                      <h4>Username:</h4>
                    <p>{userData?.username}</p>
                      <hr style={{marginTop: "5px"}}/>
                    </div>
                    <div className="detail">
                      <h4>Email:</h4>
                      <p>{userData?.email}</p>
                      <hr style={{marginTop: "5px"}}/>
                    </div>
                    <div className="detail">
                      <h4>No. Of Blocks</h4>
                      <p>{noOfBlocks}</p>
                      <hr style={{marginTop: "5px"}}/>
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

                    <div className="form-group mb-3">
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
                 
                      <div className="col-md-8 ">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          value="Update Information"
                          onClick={handleUpdatePersonalInfo}
                          style={{marginRight: "10px"}}
                         
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
                         Clear 
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

                    <div className="form-group mb-3 ">
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
                      
                      <div className="col-md-8">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          value="Update Information"
                          onClick={handleUpdateEmail}
                          style={{marginRight: "10px"}}
                        >
                          Update
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
                          Clear
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


                    <div className="form-group mt-3">
                     
                      <div className="col-md-8">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          value="Update Information"
                          onClick={handleUpdatePassword}
                          style={{marginRight: "10px"}}
                        >
                          Update
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
                          Clear
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}
              {/* Delete Account */}
              {activeTab === "deleteAccount" && (
                <>
                  <h3>Delete Account</h3>
                  <form className="form-horizontal" role="form">
                    <div className="form-group">
                      <label className="col-md-3 control-label">
                        Enter Current Password:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          type="password"
                          name="deletePassword"
                          id="deletePassword"
                          value={deletePassword.deletePassword}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                   
                    <div className="form-group mb-3">
                      <label className="col-md-3 control-label">
                        Confirm password:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          type="password"
                          name="confirmDelete"
                          value={confirmDelete}
                          onChange={(e) => {
                            setConfirmDelete(e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                     
                      <div className="col-md-8">
                        <button
                          type="submit"
                          className="btn btn-danger"
                          value="Update Information"
                          onClick={handleDeleteAccount}
                           style={{marginRight: "10px"}}
                        >
                          Delete My Account
                        </button>
                        <button
                          type="reset"
                          className="btn btn-default"
                          value="Update Information"
                          onClick={() => {
                            setConfirmDelete("");
                            setDeletePassword({ deletePassword: ""});
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </form>
                  <p className="mt-2" style={{fontSize: "15px", opacity: "50%"}}>This action is permanent and irreversible.</p>
                </>
              )}
            </div>
          </div>
        </div>
        
   </section>

    </>
  );
};

export default ProfilePage;
