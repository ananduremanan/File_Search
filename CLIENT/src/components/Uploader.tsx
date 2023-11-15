import { useState } from "react";
import { AiFillCloseCircle, AiOutlinePaperClip } from "react-icons/ai";
import { BiSolidCloudUpload } from "react-icons/bi";

const Uploader = () => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      // if (file.type === "application/pdf") {
      //   setSelectedFile(file);
      //   setError("");
      // } else {
      //   setSelectedFile(null);
      //   setError("Please select a valid PDF file.");
      // }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8080/upload", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setSelectedFile(null);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex gap-2">
      <span>
        {selectedFile && (
          <div className="flex items-center gap-2">
            {selectedFile.name}{" "}
            <AiFillCloseCircle
              onClick={() => {
                setSelectedFile(null);
              }}
              className="cursor-pointer"
            />
          </div>
        )}
      </span>
      <input
        type="file"
        accept=".pdf"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {selectedFile ? (
        <button
          className="bg-violet-600 p-1 text-white rounded-lg mb-2 flex items-center cursor-pointer hover:bg-violet-800"
          onClick={handleUpload}
        >
          <BiSolidCloudUpload />
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      ) : (
        <label
          htmlFor="fileInput"
          className="bg-violet-600 p-1 text-white rounded-lg mb-2 flex items-center cursor-pointer hover:bg-violet-800"
        >
          <AiOutlinePaperClip />
          Select File
        </label>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Uploader;
