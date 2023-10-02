import { useState } from "react";
import Blocks from "../components/Blocks";
import Axios from "axios";
import CardBodyForm from "../components/CardBodyForm";

const MainPage = () => {
  const [blockName, setBlockName] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [picture, setPicture] = useState(null);
  const [securityQuestions, setSecurityQuestions] = useState(null);

  const handleCreateBlock = () => {
    Axios.post("http://localhost:3001/postBlock", {
      blockName: blockName,
      name: name,
      email: email,
      username: username,
      password: password,
      picture: picture,
      securityQuestions: [securityQuestions],
    }).then((response) => {
      alert("Block was created!");
    });
  };

  return (
    <>
      <Blocks />
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        New block
      </button>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Modal title
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <CardBodyForm />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateBlock}
              >
                Add block
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
