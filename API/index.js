const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Multer is for Storage
const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  console.log(req.file);

  try {
    let dataBuffer = fs.readFileSync(req.file.path);
    let data = await pdfParse(dataBuffer);

    // Save the extracted text to a new .txt file
    await fs.promises.writeFile(
      `./uploads/${req.file.originalname}.txt`,
      data.text
    );
    console.log("Text extracted and saved successfully.");
    res.send(
      `File uploaded and text extracted successfully. The text file is saved as ${req.file.originalname}.txt.`
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        "An error occurred while extracting text from the PDF or saving the extracted text to a file."
      );
  }
});

app.get("/download", function (req, res) {
  const file = `${__dirname}/uploads/${req.query.filename}`;
  res.download(file); // Set disposition and send it.
});

app.get("/search", async (req, res) => {
  const keyword = req.query.keyword.toLowerCase(); // Convert keyword to lowercase
  const directoryPath = path.join(__dirname, "uploads");
  let filesContainingKeyword = [];

  try {
    const files = await fs.promises.readdir(directoryPath);

    for (let file of files) {
      if (file.endsWith(".txt")) {
        let filePath = path.join(directoryPath, file);
        let data = await fs.promises.readFile(filePath, "utf8");
        let lowerCaseData = data.toLowerCase();
        if (lowerCaseData.includes(keyword)) {
          // Convert data to lowercase
          let index = lowerCaseData.indexOf(keyword);
          let preview = data.substring(index, index + 100) + "..."; // Get a substring of 100 characters around the keyword
          let pdfFile = file.replace(".txt", "");
          filesContainingKeyword.push({ filename: pdfFile, preview: preview });
          console.log(`Found keyword in ${filePath}`);
        } else {
          console.log(`Keyword not found in ${filePath}`);
        }
      }
    }

    res.send(filesContainingKeyword);
  } catch (err) {
    console.error("Unable to scan directory: " + err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/", (req, res) => {
  res.send("Node API For Local Indexing.");
});

app.listen(8080, () => console.log("Server started on port 8080"));
