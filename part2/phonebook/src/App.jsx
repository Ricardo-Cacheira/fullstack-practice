import { useState } from 'react'

const Header = ({ text }) => {
  return <h2>{text}</h2>
}

const Entry = ({ person }) => {
return <li key={person.name}>{person.name} {person.number}</li>
}

const Phonebook = ({ persons }) => {
  return (
    <div>
      {persons.map(person => <Entry key={person.name} person={person} />)}
    </div>
    )
}

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <form>
      <div>
        filter shown with: <input value={filter} onChange={handleFilterChange} />
      </div>
    </form>
  )
}

const PersonForm = ({ handleAddPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button onClick={handleAddPerson} type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const numbersToShow = filter === ''
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    //console.log(event.target.value)
    setFilter(event.target.value)
    
  }

  const handleAddPerson = (event) => {
    event.preventDefault()
    if(newName === '' || newNumber === '') {
      alert('Name or Number cannot be empty')
      return
    }

    if(persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    const nameObject = {
      name: newName,
      number: newNumber,
    }
    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <Header text="Phonebook" />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Header text="add a new" />
      <PersonForm 
        handleAddPerson={handleAddPerson} 
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <Header text="Numbers" />
      <Phonebook persons={numbersToShow} />
    </div>
  )
}

export default App