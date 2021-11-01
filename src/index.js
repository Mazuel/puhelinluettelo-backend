const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms :body"));
app.use(cors());

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Jari Kallio",
    number: "050-1235552",
    id: 2,
  },
  {
    name: "Mari Matti",
    number: "013-42123",
    id: 3,
  },
  {
    name: "Kari Miesukka",
    number: "0421-321321",
    id: 4,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

//TODO
app.post("/api/persons", (req, res) => {
  const person = req.body;
  person.id = getRandomInt(0, 10000);
  if (person.name === undefined || person.name === "") {
    return res.status(400).json({
      error: "Name is missing!",
    });
  }

  const checkPerson = persons.find(
    (existingPerson) => existingPerson.name === person.name
  );

  if (checkPerson) {
    return res.status(400).json({
      error: `Name must be unique!`,
    });
  }

  if (person.number === undefined || person.number === "") {
    return res.status(400).json({
      error: "Number is missing!",
    });
  }
  persons.push(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
