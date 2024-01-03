import "../assets/Blocks.css";
import defaultImgPlaceholder from "../assets/placeholder.png";
import SadEmoji from "../assets/sad.png";
import NewBlock1 from "../components/NewBlock1";
import EasyEdit, { Types } from "react-easy-edit";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

interface BlocksProp {
  listOfBlocks: any[];
  handleDeleteBlock: (blockId: string) => void;
}

interface BlockInfoProp {
  name: string;
  email: string;
  username: string;
  password: string;
}

const Blocks = ({ listOfBlocks, handleDeleteBlock }: BlocksProp) => {
  const [updatedBlockInfo, setUpdatedBlockInfo] = useState<BlockInfoProp>({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  // Save line edit
  const save = async (
    value: string,
    index: number,
    key: keyof BlockInfoProp
  ) => {
    try {
      const updatedInfo = { ...updatedBlockInfo, [key]: value };
      setUpdatedBlockInfo(updatedInfo);

      const { data } = await axios.put(
        `/updateBlock/${listOfBlocks[index]._id}`,
        updatedInfo
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
                      {item.blockName}
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
                      value={updatedBlockInfo.name}
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
                      value={updatedBlockInfo.email}
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
                      value={updatedBlockInfo.username}
                      placeholder={item.username}
                    />
                    <strong>Password:</strong>{" "}
                    <EasyEdit
                      type={Types.TEXT}
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
                      value={updatedBlockInfo.password}
                      placeholder={item.password}
                    />
                    {item.securityQuestions &&
                      item.securityQuestions.length > 0 && (
                        <div>
                          {item.securityQuestions.map(
                            (item: any, index: number) => (
                              <div key={index}>
                                <p>
                                  <strong>
                                    Security Question {index + 1}:
                                  </strong>
                                </p>
                                <ul className="list-inline">
                                  <li>
                                    <strong>Q:</strong> {item.question}
                                  </li>
                                  <li>
                                    <strong>A:</strong> {item.answer}
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
