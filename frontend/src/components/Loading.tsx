import "../assets/Loading.css";

const Loading = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <div className="loader mb-2"></div>
        <h3>Just few seconds</h3>
        <p>We are fetching your blocks.</p>
      </div>
    </div>
  );
};

export default Loading;
