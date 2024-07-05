import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../assets/NewBlocks.css";

interface sqTypes {
  question: string;
  answer: string;
}

interface BlockObjectType{
  [key: string]: string;
}

const NewBlock = () => {
  const [blockInfo, setBlockInfo] = useState<BlockObjectType>({
    blockName: "",
    name: "",
    email: "",
    username: "",
    password: "",
    picture: "",
  })
  const [securityQuestions, setSecurityQuestions] = useState<sqTypes[]>([]); 
 
  
  // Block input 
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const {name, value} = e.target;
    setBlockInfo((prev) => {
     return {
      ...prev,
      [name]: value,
     } 
    })
  }

  // Security Questions events
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

  // Handle create block
  const handleCreateBlock = async(e: React.MouseEvent<HTMLButtonElement>) => {
    
    e.preventDefault();
    try {
      if (!blockInfo.blockName || !blockInfo.name) {
      toast.error("Must at least have block name.");
      return;
    }
      const response = await axios.post("/createBlock",  {
        blockName: blockInfo.blockName,
        name: blockInfo.name,
        email: blockInfo.email,
        username: blockInfo.username,
        password: blockInfo.password,
        picture: blockInfo.picture,
        securityQuestions: securityQuestions
      } )

      if (response.status === 201) {
        closeModal();
        setBlockInfo({
          blockName: "",
          name: "",
          email: "",
          username: "",
          password: "",
          picture: "",
        });
        setSecurityQuestions([]);
        toast.success(`${blockInfo.blockName} block created!`);
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating block");
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
      setBlockInfo({...blockInfo, picture: base64});
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
     setBlockInfo({
          blockName: "",
          name: "",
          email: "",
          username: "",
          password: "",
          picture: "",
        });
        setSecurityQuestions([])

        const fileInput = document.getElementById('setpictureInput') as HTMLInputElement;
        if (fileInput) {
          const emptyFileList = new DataTransfer().files;
          fileInput.files = emptyFileList;
        }
  };

  return (
    <>
      <button
        type="button"
        className="btn newBlockBtn"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        <svg className="svg-circleplus" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" strokeWidth="2"></circle>
          <line x1="32.5" y1="50" x2="67.5" y2="50" strokeWidth="2"></line>
          <line x1="50" y1="32.5" x2="50" y2="67.5" strokeWidth="2"></line>
        </svg>
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
                New Block
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
                    name="blockName"
                    onChange={handleChange}               
                    value={blockInfo.blockName}
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
                    name="name"
                    onChange={handleChange}               
                    value={blockInfo.name}
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
                    name="email"
                    onChange={handleChange}               
                    value={blockInfo.email}
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
                    name="username"
                    onChange={handleChange}               
                    value={blockInfo.username}
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
                    name="password"
                    onChange={handleChange}               
                    value={blockInfo.password}
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
                <button className="btn btn-secondary" type="button" onClick={handleAddSecurityQuestion}>
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
