import { AiFillFilePdf } from "react-icons/ai";
import Uploader from "./Uploader";
import { BiSolidDownload } from "react-icons/bi";
import Highlighter from "react-highlight-words";

const ShowFile = ({ results, searchParam }: any) => {
  async function downloadFile(filename: any) {
    const response = await fetch(
      `http://localhost:8080/download?filename=${filename}`
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <section className="flex mt-4 flex-col items-center md:mx-20 lg:mx-32">
      <div className="flex text-left w-full px-5 justify-between md:px-16">
        <div>Search Results</div>
        <Uploader />
      </div>
      <hr className="w-11/12 border-gray-200" />
      {results.length > 0 &&
        results.map((item: any) => {
          return (
            <div
              className="bg-gray-100 w-11/12 p-4 rounded-lg flex justify-between drop-shadow-md mt-2 items-center gap-2 cursor-pointer"
              key={item.filename}
            >
              <div className="flex items-center gap-2">
                <div className="bg-violet-200 p-2 rounded-full">
                  <AiFillFilePdf />
                </div>

                <Highlighter
                  searchWords={[searchParam]}
                  autoEscape={true}
                  textToHighlight={item.preview}
                  className="text-sm"
                />
              </div>
              <div className="text-right text-red-500 flex items-center">
                <div className="text-gray-500 mr-2 text-xs">
                  {item.filename}
                </div>
                <BiSolidDownload
                  onClick={() => {
                    downloadFile(item.filename);
                  }}
                />
              </div>
            </div>
          );
        })}
    </section>
  );
};

export default ShowFile;
