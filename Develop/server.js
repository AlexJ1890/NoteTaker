const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 5500;
const notes = require("./db/db.json");
const uuid = require("./helpers/uuid");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
    console.log('Accessing /notes');
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  var currentData;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log(data);
      currentData = JSON.parse(data);
      console.log(currentData);
      res.status(200).json(currentData);
    }
  });
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    fs.readFile("./db/db.json", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(newNote);

        fs.writeFile(
          "./db/db.json",

          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated Notes!")
        );
      }
    });

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(200).json(response);
  } else {
    res.status(500).json("Error in posting note");
  }
});

// DELETE -----------------------

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  if (id) {
    fs.readFile("./db/db.json", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        const filteredNotes = parsedNotes.filter((data) => data.id !== id);

        fs.writeFile(
          "./db/db.json",

          JSON.stringify(filteredNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully deleted Note!")
        );
      }
    });

    const response = {
      status: "success",
    };

    console.log(response);
    res.status(200).json(response);
  } else {
    res.status(500).json("Error in deleting note");
  }
});

// ---------------

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});