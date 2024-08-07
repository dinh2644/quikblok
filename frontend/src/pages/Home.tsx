import Blocks from "../components/Blocks";
import "../assets/HomePage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast/headless";
import Navbar from "../components/Navbar";
import { createContext, Dispatch, SetStateAction } from "react";
import SadEmoji from "../assets/sad.png";
import NewBlock from "../components/NewBlock";
import Loading from "../components/Loading";



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

interface UserDataProps{
  userData: string
}

const Home = ({userData}: UserDataProps) => {
  const [listOfBlocks, setListOfBlocks] = useState<BlockInfoProp[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBlocks = async () => {
    try {
      const blockData = await axios.get("/getBlock");
      setListOfBlocks(blockData.data.myBlocks);
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching blocks:", error);
      toast.error("Failed to fetch blocks");
    }finally{
      setIsLoading(false)
    }
  };

  // Fetch user's blocks
  useEffect(() => {
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
  const handleDeleteBlock = async (blockId: string) => {
    try {
      const response = await axios.delete(`/deleteBlock/${blockId}`)
      if(response.status === 201){
        const updatedBlockList = listOfBlocks.filter(
          (block) => block._id !== blockId
        );
        setListOfBlocks(updatedBlockList);
        toast.success("Block deleted");
      }
    } catch (error) {
      console.error("Error deleting block", error);
      
    }
  };

 if(isLoading){
  return <Loading/>;
 } 

  return (
    <>
        <SearchValueContext.Provider value={{ searchValue, setSearchValue }}>
          <div>
            <Navbar userData={userData}/>
            <section>
              <div className="container" style={{ maxWidth: "1800px" }}>
                <div className="row">
                  <Blocks
                    listOfBlocks={filteredData}
                    handleDeleteBlock={handleDeleteBlock}
                    fetchBlocks={fetchBlocks}
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
                          <NewBlock fetchBlocks={fetchBlocks} />
                        </div>
                      </div>
                    </>
                  )}
                </div>

              </div>
            </section>
          </div>
        </SearchValueContext.Provider>
  

      <div className="text-muted text-center" style={{fontSize: "18px"}}>
      &copy; {new Date().getFullYear()} QuikBlok. All rights reserved.
      </div>
    </>
  );
};

export default Home;
