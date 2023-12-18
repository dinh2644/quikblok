import Blocks from "../components/Blocks";
import NewBlock from "../components/NewBlock";
import Navbar from "../components/Navbar";
import "../assets/HomePage.css";

interface usernameProp {
  username: string;
}

const Home = ({ username }: usernameProp) => {
  return (
    <section>
      <Navbar username={username} />
      <div className="container">
        <div className="row">
          <Blocks />
        </div>
        <div className="row">
          <div className="col d-flex justify-content-end">
            <NewBlock />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
