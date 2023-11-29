# File Search Using Node.js, Express.js and React.js

### Introduction

A search system designed for locating files through keyword searches, where the search functionality scans the contents of various file types such as PDFs, Excel sheets, Word documents, images, etc. The results are then indexed and displayed in the front end. Powered by OCR even scanned pdf can also be indexed for searching.

### How to Run

##### Warning !! This Project uses the npm package [pdf-poppler](https://www.npmjs.com/package/pdf-poppler) which only supports in Windows and Mac.

Clone this repository by running

```bash
git clone git@github.com:ananduremanan/File-Search.git
```

Run the project by

```bash
npm start
```

### Time Took for processing

| Task                            | Duration           | Pages | Word Count | Notes       |
| ------------------------------- | ------------------ | ----- | ---------- | ----------- |
| Convert 1 Page PDF (14 Words)   | 1.70 s             | 1     | 14         |             |
| Convert 4 Page PDF (1880 Words) | 19.05 s            | 4     | 1880       |             |
| Convert 4 Page PDF (Image)      | 13.10 s            | 4     | -          | Scanned PDF |
| Convert 618 Page PDF (Image)    | 15.01.44 (Minutes) | 618   | -          | Scanned PDF |
