import { BlockInfo } from "../helper/block-info";

const Blocks = () => {
  {
    /*Blocks*/
  }
  const blockElements = BlockInfo.map((item, index) => (
    <div className="col-xl-2">
      <div
        key={index}
        className="card text-center mb-3 mt-4"
        style={{ width: "18rem", cursor: "pointer" }}
        data-bs-toggle="modal"
        data-bs-target={`#staticBackdrop${index}`}
      >
        <img src={item.picture} className="card-img-top" alt={item.blockName} />
        <div className="card-body">
          <h5 className="card-title">{item.blockName}</h5>
        </div>
      </div>
    </div>
  ));
  {
    /*Modals*/
  }
  const modalElements = BlockInfo.map((item, index) => (
    <div
      key={index}
      className="modal fade"
      id={`staticBackdrop${index}`}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby={`staticBackdropLabel${index}`}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`staticBackdropLabel${index}`}>
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
              <strong>Name:</strong> {item.blockName}
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
            {item.securityQuestions && item.securityQuestions.length > 0 && (
              <div>
                <p>
                  <strong>Security Questions:</strong>
                </p>
                <ul>
                  {item.securityQuestions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
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
  ));

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {blockElements}
          {modalElements}
        </div>
      </div>
    </>
  );
};

export default Blocks;
