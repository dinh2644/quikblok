import { useState, useEffect } from "react";
import "../assets/Blocks.css";
import defaultImgPlaceholder from "../assets/placeholder.png";
import SadEmoji from "../assets/sad.png";
import NewBlock1 from "../components/NewBlock1";
import EasyEdit, { Types } from "react-easy-edit";
import axios from "axios";
import toast from "react-hot-toast";

interface BlockInfoProp {
  blockName: string;
  name: string;
  email: string;
  username: string;
  password: string;
  securityQuestions: SecurityQuestion[]; // todo: fix to include this in save()
  decryptedPassword?: string;
  iv: string;
  picture: string;
  _id: string;
}

interface BlocksProp {
  listOfBlocks: BlockInfoProp[];
  handleDeleteBlock: (blockId: string) => void;
}

interface SecurityQuestion {
  question: string;
  answer: string;
}

const Blocks = ({ listOfBlocks, handleDeleteBlock }: BlocksProp) => {
  const [blockList, setBlockList] = useState<BlockInfoProp[]>(
    listOfBlocks.map(() => ({
      blockName: "",
      name: "",
      email: "",
      username: "",
      password: "",
      securityQuestions: [{ question: "", answer: "" }],
      iv: "",
      picture: "",
      _id: "",
      null: null,
    }))
  );
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Automatically decrypt passwords in each block for user's eyes only
  useEffect(() => {
    const decryptAllPasswords = async () => {
      const decryptedBlocks = await Promise.all(
        listOfBlocks.map(async (block) => {
          try {
            const { data } = await axios.post("/decryptPassword", {
              password: block.password,
              iv: block.iv,
            });

            if (data.error) {
              console.error(data.error);
              return {
                ...block,
                decryptedPassword: "********", // Placeholder value if decryption fails
              };
            } else {
              return {
                ...block,
                decryptedPassword: data,
              };
            }
          } catch (error) {
            console.error(error);
            return {
              ...block,
              decryptedPassword: "********", // Placeholder value if an error occurs
            };
          }
        })
      );
      setBlockList(decryptedBlocks);
    };
    decryptAllPasswords();
  }, [listOfBlocks]);

  // Save line edit
  const save = async (
    value: string,
    index: number,
    key: keyof BlockInfoProp
  ) => {
    try {
      const updatedBlocks = [...blockList];

      updatedBlocks[index] = {
        ...updatedBlocks[index],
        [key]: value,
      };

      setBlockList(updatedBlocks);

      const { data } = await axios.put(
        `/updateBlock/${listOfBlocks[index]._id}`,
        {
          ...updatedBlocks[index],
        }
      );
      if (data.error) {
        toast.error("Failed to update block.");

        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Save line edit for security questions
  type UpdateType = string | null;
  const saveSecurityQuestions = async (
    value: string,
    blockIndex: number,
    sqIndex: number,
    updateType: UpdateType
  ) => {
    try {
      const updatedBlocks = [...blockList];

      if (updateType === "question") {
        updatedBlocks[blockIndex].securityQuestions[sqIndex].question = value;
      } else if (updateType === "answer") {
        updatedBlocks[blockIndex].securityQuestions[sqIndex].answer = value;
      }

      setBlockList(updatedBlocks);

      const { data } = await axios.put(
        `/updateBlock/${updatedBlocks[blockIndex]._id}`,
        {
          ...updatedBlocks[blockIndex],
          securityQuestions: updatedBlocks[blockIndex].securityQuestions,
        }
      );

      if (data.error) {
        toast.error("Failed to update block.");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Cancel line edit
  const cancel = () => {
    return;
  };

  return (
    <>
      <div className="container">
        <div className="row">
          {/* Map blocks */}
          {listOfBlocks.length > 0 ? (
            listOfBlocks.map((item, index: number) => (
              <div
                className="col-xxl-2 col-xl-2 col-lg-3 col-md-3 col-sm-4 col-xs-6"
                key={index}
              >
                <div
                  className="card BlocksCards text-center mb-3 mt-4"
                  data-bs-toggle="modal"
                  data-bs-target={`#staticBackdrop${item._id}`}
                >
                  <img
                    src={item.picture ? item.picture : defaultImgPlaceholder}
                    className="card-img-top BlocksCardsImg"
                    alt={item.blockName}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.blockName}</h5>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-content-message">
              <img
                src={SadEmoji}
                alt="Sad emoji"
                width={100}
                className="mb-4"
              />
              <p style={{ fontSize: "var(--mediumTxt)" }}>
                It seems you haven't created any blocks yet. Click the plus sign
                to create one now!
              </p>
            </div>
          )}

          {listOfBlocks.length > 0 && <NewBlock1 />}

          {/* Map respective modal for each block */}
          {listOfBlocks.map((item, index: number) => (
            <div
              key={index}
              className="modal fade BlocksModal"
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
                      <EasyEdit
                        type={Types.TEXT}
                        onSave={(value: string) => {
                          save(value, index, "blockName");
                        }}
                        onValidate={(value: string) => {
                          return value != null;
                        }}
                        onCancel={cancel}
                        saveButtonLabel="Save"
                        cancelButtonLabel="Cancel"
                        attributes={{
                          name: "blockName",
                          id: 0,
                        }}
                        value={blockList[index]?.blockName}
                        placeholder={item.blockName}
                      />
                      {index}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body easyEdit">
                    <strong>Name:</strong>
                    <EasyEdit
                      type={Types.TEXT}
                      onSave={(value: string) => {
                        save(value, index, "name");
                      }}
                      onValidate={(value: string) => {
                        return value != null;
                      }}
                      onCancel={cancel}
                      saveButtonLabel="Save"
                      cancelButtonLabel="Cancel"
                      attributes={{
                        name: "name",
                        id: 1,
                      }}
                      value={blockList[index]?.name}
                      placeholder={item.name}
                    />
                    <strong>Email:</strong>{" "}
                    <EasyEdit
                      type={Types.TEXT}
                      onSave={(value: string) => {
                        save(value, index, "email");
                      }}
                      onValidate={(value: string) => {
                        return value != null;
                      }}
                      onCancel={cancel}
                      saveButtonLabel="Save"
                      cancelButtonLabel="Cancel"
                      attributes={{
                        name: "email",
                        id: 2,
                      }}
                      value={blockList[index]?.email}
                      placeholder={item.email}
                    />
                    <strong>Username:</strong>{" "}
                    <EasyEdit
                      type={Types.TEXT}
                      onSave={(value: string) => {
                        save(value, index, "username");
                      }}
                      onValidate={(value: string) => {
                        return value != null;
                      }}
                      onCancel={cancel}
                      saveButtonLabel="Save"
                      cancelButtonLabel="Cancel"
                      attributes={{
                        name: "username",
                        id: 3,
                      }}
                      value={blockList[index]?.username}
                      placeholder={item.username}
                    />
                    <strong>Password:</strong>{" "}
                    <div
                      onMouseOver={() => setShowPassword(true)}
                      onMouseOut={() => setShowPassword(false)}
                    >
                      <EasyEdit
                        type={showPassword ? Types.TEXT : Types.PASSWORD}
                        onSave={(value: string) => {
                          save(value, index, "password");
                        }}
                        onValidate={(value: string) => {
                          return value != null;
                        }}
                        onCancel={cancel}
                        saveButtonLabel="Save"
                        cancelButtonLabel="Cancel"
                        attributes={{
                          name: "password",
                          id: 4,
                        }}
                        value={blockList[index]?.decryptedPassword}
                        placeholder={blockList[index]?.decryptedPassword}
                      />
                    </div>
                    {item.securityQuestions &&
                      item.securityQuestions.length > 0 && (
                        <div>
                          {item.securityQuestions.map(
                            (item: SecurityQuestion, sqIndex: number) => (
                              <div key={sqIndex}>
                                <p className="my-1">
                                  <strong>
                                    Security Question {sqIndex + 1}:
                                  </strong>
                                </p>
                                <ul className="list-inline">
                                  <li>
                                    <strong>Q:</strong> {sqIndex}
                                    <EasyEdit
                                      type={Types.TEXT}
                                      onSave={(value: string) => {
                                        saveSecurityQuestions(
                                          value,
                                          index,
                                          sqIndex,
                                          "question"
                                        );
                                      }}
                                      onValidate={(value: string) => {
                                        return value != null;
                                      }}
                                      onCancel={cancel}
                                      saveButtonLabel="Save"
                                      cancelButtonLabel="Cancel"
                                      attributes={{
                                        name: "question",
                                        id: sqIndex,
                                      }}
                                      value={item.question}
                                      placeholder={item.question}
                                    />
                                  </li>
                                  <li>
                                    <strong>A:</strong>{" "}
                                    <EasyEdit
                                      type={Types.TEXT}
                                      onSave={(value: string) => {
                                        saveSecurityQuestions(
                                          value,
                                          index,
                                          sqIndex,
                                          "answer"
                                        );
                                      }}
                                      onValidate={(value: string) => {
                                        return value != null;
                                      }}
                                      onCancel={cancel}
                                      saveButtonLabel="Save"
                                      cancelButtonLabel="Cancel"
                                      attributes={{
                                        name: "answer",
                                        id: sqIndex,
                                      }}
                                      value={item.answer}
                                      placeholder={item.answer}
                                    />
                                  </li>
                                </ul>
                              </div>
                            )
                          )}
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

                    <button
                      type="button"
                      className="btn btn-danger"
                      data-bs-dismiss="modal"
                      onClick={() => handleDeleteBlock(item._id)}
                    >
                      Delete block
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
