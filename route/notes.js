const express = require("express");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

const notes = express.Router();
const dbFilePath = "./develop/db/db.json";

// Function to write notes to db.json file
const writeToFile = async (destination, content) => {
  try {
    await fs.writeFile(destination, JSON.stringify(content, null, 4));
    console.info(`\nData written to ${destination}`);
  } catch (err) {
    console.error(err);
  }
};

// Function to read from db.json file
const readFromFile = async (file) => {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
};

// GET route for retrieving all the notes from db.json file
notes.get("/notes", async (req, res) => {
  try {
    const data = await readFromFile(dbFilePath);
    res.json(data);
  } catch (err) {
    res.status(500).json("Error in retrieving notes");
  }
});

// POST route for adding notes and giving them a unique id using uuid node package
notes.post("/notes", async (req, res) => {
  try {
    console.info(`${req.method} request received to add a note`);
    const { title, text } = req.body;

    if (!title || !text) {
      return res.status(400).json("Title and text are required");
    }

    const newNote = {
      id: uuidv4(),
      title,
      text,
    };

    const existingNotes = await readFromFile(dbFilePath);
    existingNotes.push(newNote);
    await writeToFile(dbFilePath, existingNotes);

    res.status(201).json(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error in posting note");
  }
});

// DELETE request to delete notes that have been added
notes.delete("/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const existingNotes = await readFromFile(dbFilePath);
    const newNotes = existingNotes.filter((note) => note.id !== id);
    await writeToFile(dbFilePath, newNotes);

    const response = {
      status: "success",
      body: id,
    };
    console.log(response);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error in deleting note");
  }
});

module.exports = notes;
