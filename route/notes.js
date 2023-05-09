const notes = require("express").Router();
const uuid = require("uuid");
const util = require("util");
const fs = require("fs");

// Function to write notes to db.json file
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

// Function to read and append notes to db.json file
const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// Function to read from db.json file
const readFromFile = util.promisify(fs.readFile);

// GET route for retrieving all the notes from db.json file
notes.get("/notes", (req, res) => {
  readFromFile("./develop/db/db.json").then((data) =>
    res.json(JSON.parse(data))
  );
});

// POST route for adding notes and giving them a unique id using uuid node package
notes.post("/notes", (req, res) => {
  // Logs that the POST request was received
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;
  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid.v4(),
    };

    readAndAppend(newNote, "./develop/db/db.json");

    const response = {
      status: "success",
      body: newNote,
    };
    console.log(response);
    res.status(201).json(newNote);
  } else {
    res.status(500).json("Error in posting note");
  }
});

// DELETE request to delete notes that have been added
notes.delete("/notes/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./develop/db/db.json", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      const newNotes = parsedNotes.filter((note) => note.id !== id);
      fs.writeFile(
        "./develop/db/db.json",
        JSON.stringify(newNotes),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info("Successfully deleted note!")
      );
    }
  });
  const response = {
    status: "success",
    body: id,
  };
  console.log(response);
  res.json(response);
});

module.exports = notes;