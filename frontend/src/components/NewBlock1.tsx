import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../assets/NewBlocks.css";
import AddBlockPLus from "../assets/grayplussign.png";

interface sqTypes {
  question: string;
  answer: string;
}

// THIS COMPONENT IS FOR WHEN THERE ARE NO BLOCKS INNITIALLY

const NewBlock1 = () => {
  const [blockName, setBlockName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [picture, setPicture] = useState("");
  const [securityQuestions, setSecurityQuestions] = useState<sqTypes[]>([]);

  const handleAddSecurityQuestion = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setSecurityQuestions([...securityQuestions, { question: "", answer: "" }]);
  };

  const handleQuestionChange = (index: number, newQuestion: string) => {
    const updatedSecurityQuestions = [...securityQuestions];
    updatedSecurityQuestions[index].question = newQuestion;
    setSecurityQuestions(updatedSecurityQuestions);
  };

  const handleAnswerChange = (index: number, newAnswer: string) => {
    const updatedSecurityQuestions = [...securityQuestions];
    updatedSecurityQuestions[index].answer = newAnswer;
    setSecurityQuestions(updatedSecurityQuestions);
  };
  const handleCreateBlock = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (blockName != "") {
      axios
        .post("/createBlock", {
          blockName,
          name,
          email,
          username,
          password,
          picture,
          securityQuestions,
        })
        .then(() => {
          closeModal();
          setBlockName("");
          setName("");
          setEmail("");
          setUsername("");
          setPassword("");
          setPicture("");
          setSecurityQuestions([]);
          toast.success(`${blockName} block created!`);
          window.location.reload();
        })
        .catch((err) => {
          console.error("Error in creating block: ", err);
          toast.error("Error creating block");
        });
    } else {
      toast.error("Fields cannot be empty!");
    }
  };
  const closeModal = () => {
    const modal = document.getElementById("staticBackdrop");
    modal?.classList.remove("show");

    const cancelButton = modal?.querySelector(
      '[data-bs-dismiss="modal"]'
    ) as HTMLElement;
    if (cancelButton) {
      cancelButton.click();
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await convertBase64(file);
      setPicture(base64);
    }
  };

  const convertBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        if (typeof fileReader.result === "string") {
          resolve(fileReader.result);
        } else {
          reject(new Error("Failed to read file as base64."));
        }
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const cancelClick = () => {
    setBlockName("");
    setName("");
    setEmail("");
    setUsername("");
    setPassword("");
    setPicture("");
    setSecurityQuestions([]);
  };

  return (
    <>
      <div
        className="col-xxl-2 col-xl-2 col-lg-3 col-md-3 col-sm-4 col-xs-6 d-flex justify-content-center align-items-center"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        <img
          src={AddBlockPLus}
          alt="Gray plus sign"
          width={200}
          className="addBlockSign"
        />
      </div>

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
              {/********** FORM BODY START**********/}
              <form>
                <div className="mb-3">
                  <label htmlFor="blockName" className="form-label">
                    Block name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="blockName"
                    onChange={(e) => setBlockName(e.target.value)}
                    value={blockName}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="nameInput" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameInput"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    pattern="/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/"
                    className="form-control"
                    id="emailInput"
                    aria-describedby="emailHelp"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="usernameInput" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="usernameInput"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="passwordInput" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="setpictureInput" className="form-label">
                    Set picture
                  </label>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="setpictureInput"
                      className="form-control"
                      onChange={(e) => uploadImage(e)}
                    />
                  </div>
                </div>
                {securityQuestions.map((sq, index: number) => (
                  <div className="mb-3" key={index}>
                    <label htmlFor={`question${index}`} className="form-label">
                      Security question {index + 1}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`question${index}`}
                      onChange={(e) =>
                        handleQuestionChange(index, e.target.value)
                      }
                      value={sq.question}
                    />
                    <label htmlFor={`answer${index}`} className="form-label">
                      Answer
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`answer${index}`}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      value={sq.answer}
                    />
                  </div>
                ))}
                <button type="button" onClick={handleAddSecurityQuestion}>
                  Add Security Question
                </button>
              </form>
              {/********** FORM BODY END**********/}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={cancelClick}
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

export default NewBlock1;
