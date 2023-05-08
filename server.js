const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const notes = require("./routes/notes.js");

const fs = require("fs");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("develop/public"));

// GET route to retrieve notes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "develop/public/notes.html"));
});

app.use("/api", notes);

// GET route to return all other routes to the home page
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "develop/public/index.html"));
});

// Listener to connect to port
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);