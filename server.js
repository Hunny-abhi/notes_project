const express = require("express");
require("dotenv").config();
const connectDB = require("./db/mongo_db");
const Note = require("./model/notes");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Notes API");
});

app.post("/notes/create", async (req, res) => {
  try {
    const { title, content, name } = req.body;

    const newNote = new Note({
      title: title,
      content: content,
      name: name,
    });

    await newNote.save();

    res.status(201).send("Note created successfully");
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).send("Error creating note");
  }
});

app.delete("/notes/delete:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).send("Note not found");
    }
    res.status(200).send("Note deleted successfully");
  } catch (err) {
    res.status(500).send("Server error");
  }
});
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 4000;
const start = async function () {
  try {
    await connectDB();
    console.log(`mongoDB is connect...`);

    app.listen(PORT, () => {
      console.log(`Server is Listening on PORT: ${PORT}...`);
    });
  } catch (error) {
    console.log("Server error");
  }
};

start();
