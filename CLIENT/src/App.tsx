import "./App.css";
import { HiOutlineSearch } from "react-icons/hi";
import ShowFile from "./components/ShowFile";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

// App Component
export default function App() {
  const [searchParam, setSearchParam] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (searchParam) {
      try {
        const response = await fetch(
          `http://localhost:8080/search?keyword=${searchParam}`
        );
        const data = await response.json();
        console.log(data);
        setResults(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <main>
      <nav className="w-screen p-4 flex justify-center bg-violet-600 items-center">
        <div className="flex">
          <div className="relative">
            <input
              type="text"
              className="bg-gray-100 h-8 w-64 lg:w-96 rounded-lg p-2 mr-1 outline-none"
              placeholder="Enter Files to Search"
              onChange={(event: any) => {
                setSearchParam(event.target.value);
              }}
              value={searchParam}
            />
            {searchParam && (
              <button
                onClick={() => setSearchParam("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <AiOutlineCloseCircle />
              </button>
            )}
          </div>
          <button
            className="bg-white p-2 rounded-lg hover:bg-slate-100"
            onClick={handleSearch}
          >
            <HiOutlineSearch />
          </button>
        </div>
      </nav>
      <ShowFile results={results} searchParam={searchParam} />
    </main>
  );
}
