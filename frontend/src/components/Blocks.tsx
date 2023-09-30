//import { BlockInfo } from "../helper/block-info";
import { useState, useEffect } from "react";
import Axios from "axios";

const Blocks = () => {
  const [listOfBlocks, setListOfBlocks] = useState<any[]>([]);
  const [blockName, setBlockName] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [picture, setPicture] = useState(null);
  const [securityQuestions, setSecurityQuestions] = useState(null);

  useEffect(() => {
    Axios.get("http://localhost:3001/getBlock").then((response) => {
      setListOfBlocks(response.data);
    });
  });

  const createBlock = () => {
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
      <div className="container-fluid">
        <div className="row">
          {listOfBlocks.map((item) => (
            <div className="col-xl-2">
              <div
                key={item._id}
                className="card text-center mb-3 mt-4"
                style={{ width: "18rem", cursor: "pointer" }}
                data-bs-toggle="modal"
                data-bs-target={`#staticBackdrop${item._id}`}
              >
                <img
                  src={item.picture}
                  className="card-img-top"
                  alt={item.blockName}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.blockName}</h5>
                </div>
              </div>
            </div>
          ))}

          {listOfBlocks.map((item) => (
            <div
              key={item._id}
              className="modal fade"
              id={`staticBackdrop${item._id}`}
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex={-1}
              aria-labelledby={`staticBackdropLabel${item._id}`}
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5
                      className="modal-title"
                      id={`staticBackdropLabel${item._id}`}
                    >
                      {item.blockName}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>
                      <strong>Name:</strong> {item.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {item.email}
                    </p>
                    <p>
                      <strong>Username:</strong> {item.username}
                    </p>
                    <p>
                      <strong>Password:</strong> {item.password}
                    </p>
                    {item.securityQuestions &&
                      item.securityQuestions.length > 0 && (
                        <div>
                          <p>
                            <strong>Security Questions:</strong>
                          </p>
                          <ul>
                            {item.securityQuestions.map(
                              (question: string, index: number) => (
                                <li key={index}>{question}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="button" className="btn btn-primary">
                      Save block
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Blocks;
