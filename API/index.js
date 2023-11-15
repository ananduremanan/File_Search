const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// ***** Tesseract imports starts here *****
const util = require("util");
const pdfPoppler = require("pdf-poppler");
const { createWorker } = require("tesseract.js");
// ***** Tesseract imports ends here *****

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

// ***** Tesseract logic starts here *****
app.post("/upload", upload.single("file"), async (req, res) => {
  const worker = await createWorker("eng");
  try {
    const filePath = path.join(__dirname, req.file.path);
    const imageDir = path.join(__dirname, "generatedimages");
    fs.mkdirSync(imageDir, { recursive: true });
    const opts = {
      format: "jpeg",
      out_dir: imageDir,
      out_prefix: path.basename(filePath, path.extname(filePath)),
      page: null,
    };

    await pdfPoppler.convert(filePath, opts);

    const files = fs.readdirSync(opts.out_dir);
    const images = files.filter(
      (file) => file.includes(opts.out_prefix) && path.extname(file) === ".jpg"
    );
    console.log(images);
    let finalText = "";

    for (const image of images) {
      const imagePath = path.join(opts.out_dir, image);
      const {
        data: { text },
      } = await worker.recognize(imagePath);
      finalText += text + "\n";
    }

    await worker.terminate();

    const textFilePath = path.join(
      path.dirname(filePath),
      `${opts.out_prefix}.txt`
    );
    await util.promisify(fs.writeFile)(textFilePath, finalText);

    res.send(
      `File uploaded and text extracted successfully. The text file is saved as ${opts.out_prefix}.txt.`
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
// ***** Tesseract logic ends here *****

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
