const express = require('express')
const app = express()
let morgan = require('morgan')
const cors = require('cors')

app.use(express.json())

app.use(cors())

morgan.token('content', (req, res, param) =>{
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      "number": "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    },
    {
      name: "Teste",
      number: "39-23-6423122",
      id: 5
    }
  ]
  
app.get('/info', (req, res) => {
  const text = `<p>Phonebook has info for ${persons.length} people</p>`
  const date = new Date()

  res.send(text.concat(date))
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) { //undefined is false
    response.json(person)
  } else {
    response.status(404).end()
  }
})
  
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => Math.floor(Math.random()*10000)

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  if(persons.find(person => person.name === body.name)){
    return response.status(400).json({
      error : 'name must be unique'
    })
  }
  
  const person = {
    name : body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

