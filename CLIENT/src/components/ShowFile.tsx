import {
  AiFillFilePdf,
  AiFillFileExcel,
  AiFillFileWord,
  AiFillFile,
} from "react-icons/ai";
import { TbFaceIdError } from "react-icons/tb";
import Uploader from "./Uploader";
import { BiSolidDownload } from "react-icons/bi";
import Highlighter from "react-highlight-words";

const ShowFile = ({ results, searchParam, noSearchData }: any) => {
  async function downloadFile(filename: any) {
    try {
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
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="flex mt-4 flex-col items-center md:mx-20 lg:mx-32">
      <div className="flex text-left w-full px-5 justify-between md:px-16">
        <div>Search Results</div>
        <Uploader />
      </div>
      <hr className="w-11/12 border-gray-200" />
      {noSearchData ? (
        <div className="flex flex-col items-center border-dashed border-2 border-gray-200 mt-20 w-11/12 p-4">
          <TbFaceIdError className="text-4xl text-gray-500" />
          <div className="text-gray-500 text-center">
            No Corresponding Files Found with the Search Keyword.
          </div>
        </div>
      ) : (
        results.length > 0 &&
        results.map((item: any) => {
          const fileExt = item.filename.split(".").pop();
          let Icon;
          let color;
          switch (fileExt) {
            case "pdf":
              Icon = AiFillFilePdf;
              color = "red";
              break;
            case "xlsx":
            case "xls":
              Icon = AiFillFileExcel;
              color = "green";
              break;
            case "docx":
            case "doc":
              Icon = AiFillFileWord;
              color = "blue";
              break;
            default:
              Icon = AiFillFile;
              color = "#ffc721";
          }
          return (
            <div
              className="bg-gray-100 w-11/12 p-4 rounded-lg flex justify-between drop-shadow-md mt-2 items-center gap-2 cursor-pointer"
              key={item.filename}
            >
              <div className="flex items-center gap-2">
                <div className="bg-violet-200 p-2 rounded-full">
                  <Icon color={color} />
                </div>

                <Highlighter
                  searchWords={[searchParam]}
                  autoEscape={true}
                  textToHighlight={item.preview}
                  className="text-sm"
                />
              </div>
              <div className="text-right text-red-500 flex items-center">
                <div className="text-gray-500 mr-2 text-xs overflow-hidden overflow-ellipsis whitespace-nowrap max-w-200">
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
        })
      )}
    </section>
  );
};

export default ShowFile;
