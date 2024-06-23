import Blocks from "../components/Blocks";
import NewBlock from "../components/NewBlock";
import "../assets/HomePage.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast/headless";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import React, {createContext,Dispatch,SetStateAction} from "react";

interface UserData {
  firstName: string;
}

interface HomeProps {
  userData: UserData; 
}

interface SearchContextType{
  searchValue: string
  setSearchValue: Dispatch<SetStateAction<string>>;
}
export const SearchValueContext = createContext<SearchContextType>({
  searchValue: "",
  setSearchValue: () => {}
});

const Home = ({userData}: HomeProps) => {
  const [listOfBlocks, setListOfBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("")

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
  const filteredData = listOfBlocks.filter((data)=>{
    return(
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
        <SearchValueContext.Provider value={{searchValue,setSearchValue}}>
        <div>
          <Navbar userData={userData}/>
        <section>
          <div className="container" style={{ maxWidth: "1800px" }}>
            <div className="row">
              <Blocks
                listOfBlocks={filteredData}
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
        </div>
        </SearchValueContext.Provider>
      )}
    </>
  );
};

export default Home;
