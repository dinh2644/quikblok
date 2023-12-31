import Blocks from "../components/Blocks";
import NewBlock from "../components/NewBlock";
import "../assets/HomePage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast/headless";
import Loading from "../components/Loading";

const Home = () => {
  const [listOfBlocks, setListOfBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch blocks
  useEffect(() => {
    setIsLoading(true);
    const fetchBlocks = async () => {
      try {
        const response = await axios.get("/getBlock");
        setIsLoading(false);
        setListOfBlocks(response.data.myBlocks);
      } catch (error) {
        console.error("Error fetching blocks:", error);
        toast.error("Failed to fetch blocks");
      }
    };
    fetchBlocks();
  }, []);

  // Delete blocks
  const handleDeleteBlock = (blockId: string) => {
    axios
      .delete(`/deleteBlock/${blockId}`)
      .then(() => {
        const updatedBlockList = listOfBlocks.filter(
          (block) => block.id !== blockId
        );
        setListOfBlocks(updatedBlockList);
        toast.success("Block deleted");
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error deleting block: ", err);
      });
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <section>
          <div className="container" style={{ maxWidth: "1800px" }}>
            <div className="row">
              <Blocks
                listOfBlocks={listOfBlocks}
                handleDeleteBlock={handleDeleteBlock}
              />
            </div>
            <div className="row">
              <div className="col d-flex justify-content-center">
                {listOfBlocks.length > 0 ? null : <NewBlock />}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
