import "../assets/Blocks.css";
import defaultImgPlaceholder from "../assets/placeholder.png";
import SadEmoji from "../assets/sad.png";
import NewBlock1 from "../components/NewBlock1";

interface BlocksProps {
  listOfBlocks: any[];
  handleDeleteBlock: (blockId: string) => void;
}

const Blocks = ({ listOfBlocks, handleDeleteBlock }: BlocksProps) => {
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
