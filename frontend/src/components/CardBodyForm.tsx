import { useState } from "react";

const CardBodyForm = () => {
  const [securityQuestions, setSecurityQuestions] = useState<
    { question: string; answer: string }[]
  >([{ question: "", answer: "" }]);

  const handleAddQuestion = (e) => {
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
  return (
    <>
      <form>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Block name
          </label>
          <input type="text" className="form-control" id="" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputPassword1"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Set picture
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        {securityQuestions.map((sq, index: number) => (
          <div className="mb-3" key={index}>
            <label htmlFor={`question${index}`} className="form-label">
              Security questions {index + 1}
            </label>
            <input
              type="text"
              className="form-control"
              id={`question${index}`}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              value={sq.answer}
            />
            <label htmlFor={`answer${index}`} className="form-label">
              Answer
            </label>
            <input
              type="text"
              className="form-control"
              id={`answer${index}`}
              value={sq.answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion}>
          Add Security Question
        </button>
      </form>
    </>
  );
};

export default CardBodyForm;
