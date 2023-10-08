import { useState } from "react";
import Axios from "axios";
import FileBase64 from "react-file-base64";
interface sqTypes {
  question: string;
  answer: string;
}

const NewBlock = () => {
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
    Axios.post("http://localhost:3001/postBlock", {
      blockName,
      name,
      email,
      username,
      password,
      picture,
      securityQuestions,
    })
      .then((response) => {
        const createdBlock = response.data; // Assuming the response contains the created block including its ID
        const createdBlockId = createdBlock._id; // Assuming "_id" is the field that holds the block's ID

        // Now that you have the createdBlockId, you can update its picture
        updateBlockPictureInMongoDB(createdBlockId, picture);

        closeModal();
      })
      .catch((err) => {
        console.error("Error in creating block: ", err);
      });
  };
  const closeModal = () => {
    let modal = document.getElementById("staticBackdrop");
    modal?.classList.remove("show");

    let cancelButton = modal?.querySelector(
      '[data-bs-dismiss="modal"]'
    ) as HTMLElement;
    if (cancelButton) {
      cancelButton.click();
    }
  };

  const updateBlockPictureInMongoDB = (blockId: string, picture: string) => {
    fetch(`/updateBlockPicture/${blockId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ picture: picture }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Block picture updated:", data);
      })
      .catch((error) => {
        console.error("Error updating block picture:", error);
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
                    <FileBase64
                      className="file-base64-input "
                      type="file"
                      accept="image/*"
                      multiple={false}
                      id="setpictureInput"
                      onDone={({ base64 }: { base64: string }) =>
                        setPicture(base64)
                      }
                      value={picture}
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

export default NewBlock;
