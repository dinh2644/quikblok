import Blocks from "../components/Blocks";
import "../assets/HomePage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast/headless";
import Navbar from "../components/Navbar";
import { createContext, Dispatch, SetStateAction } from "react";
import SadEmoji from "../assets/sad.png";
import NewBlock from "../components/NewBlock";



interface BlockInfoProp {
  blockName: string;
  name: string;
  email: string;
  username: string;
  password: string;
  securityQuestions: SecurityQuestion[];
  decryptedPassword?: string;
  iv: string;
  picture: string;
  _id: string;
}

interface SecurityQuestion {
  question: string;
  answer: string;
}

interface SearchContextType {
  searchValue: string
  setSearchValue: Dispatch<SetStateAction<string>>;
}
export const SearchValueContext = createContext<SearchContextType>({
  searchValue: "",
  setSearchValue: () => { }
});

interface UserProps{
 user: string 
}

const Home = ({user}: UserProps) => {
  const [listOfBlocks, setListOfBlocks] = useState<BlockInfoProp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("")


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

  // Filtered data
  const filteredData = listOfBlocks?.filter((data) => {
    return (
      searchValue.toLowerCase() === "" ||
      (data.blockName && data.blockName.toLowerCase().includes(searchValue.toLowerCase()))
    )
  })


  // Delete blocks
  const handleDeleteBlock = (blockId: string) => {
    axios
      .delete(`/deleteBlock/${blockId}`)
      .then(() => {
        const updatedBlockList = listOfBlocks.filter(
          (block) => block._id !== blockId
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
        <SearchValueContext.Provider value={{ searchValue, setSearchValue }}>
          <div>
            <Navbar user={user}/>
            <section>
              <div className="container" style={{ maxWidth: "1800px" }}>
                <div className="row">
                  <Blocks
                    listOfBlocks={filteredData}
                    handleDeleteBlock={handleDeleteBlock}
                  />
                </div>
                <div>
                  {listOfBlocks.length > 0 ? (
                    filteredData.length > 0 ? (
                      null
                    ) : (
                      <p className="text-center mt-5">No Results...</p>
                    )
                  ) : (
                    <>
                      <div className="row mt-5">
                        <div className="col-12">
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
                        </div>
                      </div>
                      <div className="row">
                        <div className="d-flex justify-content-center">
                          <NewBlock />
                        </div>
                      </div>
                    </>
                  )}
                </div>

              </div>
            </section>
          </div>
        </SearchValueContext.Provider>
  

      <div className="text-muted text-center" style={{fontSize: "20px"}}>
      &copy; {new Date().getFullYear()} QuikBlok. All rights reserved.
      </div>
    </>
  );
};

export default Home;
