import { useState } from "react";

interface sqTypes {
  question: string;
  answer: string;
}

interface FormProps {
  onSubmit: (data: {
    blockName: string;
    name: string;
    email: string;
    username: string;
    password: string;
    picture: string;
    securityQuestions: sqTypes[];
  }) => void;
}

const CardBodyForm = ({ onSubmit }: FormProps) => {
  const [blockName, setBlockName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [picture, setPicture] = useState("");
  const [securityQuestions, setSecurityQuestions] = useState<sqTypes[]>([
    {
      question: "",
      answer: "",
    },
  ]);

  const handleAddQuestion = (e: React.MouseEvent<HTMLButtonElement>) => {
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

  const handleSubmit = () => {
    const formData = {
      blockName,
      name,
      email,
      username,
      password,
      picture,
      securityQuestions,
    };
    onSubmit(formData);
  };

  return (
    <>
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
          <input
            type="image"
            className="form-control"
            id="setpictureInput"
            onChange={(e) => setPicture(e.target.value)}
            value={picture}
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
              value={sq.question}
            />
            <label htmlFor={`answer${index}`} className="form-label">
              Answer
            </label>
            <input
              type="text"
              className="form-control"
              id={`answer${index}`}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              value={sq.answer}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion}>
          Add Security Question
        </button>
      </form>
      <button type="button" className="btn btn-primary">
        Add block
      </button>
      <button type="button" onClick={handleSubmit}>
        Submit
      </button>
    </>
  );
};

export default CardBodyForm;
