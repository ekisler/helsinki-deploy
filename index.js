const express = require("express");
const morgan = require("morgan");

const app = express();

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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  // Verifica si falta el nombre o el número
  if (!name || !number) {
    return response.status(400).json({
      error: "Missing name or number",
    });
  }

  // Verifica si el nombre ya existe en la agenda
  const existingPerson = persons.find((p) => p.name === name);
  if (existingPerson) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  // Genera un ID aleatorio utilizando Math.random()
  const randomId = parseInt(Math.random() * 10000000);

  const person = {
    id: randomId,
    name: name,
    number: number,
  };

  // Añade la nueva persona a la lista de personas
  persons.push(person);

  response.json(person);
});

app.get("/", (request, response) => {
  response.send("<h1>Hallo Welt!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).send("Not found");
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
