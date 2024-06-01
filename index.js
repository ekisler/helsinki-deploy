const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { connectDB } = require("./mongo");

const { Person } = require("./mongo.js");

const app = express();
app.use(cors());

connectDB();

app.use(express.static("public"));

app.use(express.json());

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(morgan("tiny"));

app.use((req, res, next) => {
  if (req.method === "POST") {
    console.log(`POST request received: ${JSON.stringify(req.body)}`);
  }
  next();
});

app.post("/api/persons", async (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: "Missing name or number",
    });
  }

  // Verifica si el nombre ya existe en la agenda
  const existingPerson = await Person.findOne({ name });
  if (existingPerson) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  // Genera un ID aleatorio utilizando Math.random()

  const person = new Person({ name, number });
  await person.save();

  response.json(person);
});

app.get("/", (request, response) => {
  response.send("<h1>Hallo Welt!</h1>");
});

app.get("/api/persons", async (request, response) => {
  try {
    const persons = await Person.find({});
    response.json(persons);
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
});

app.get("/api/persons/:id", async (request, response) => {
  const id = request.params.id;
  try {
    const person = await Person.findById(id);
    if (person) {
      response.json(person);
    } else {
      response.status(404).send("Not found");
    }
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`);
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
