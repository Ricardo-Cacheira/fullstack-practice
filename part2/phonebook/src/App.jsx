import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'

const Header = ({ text }) => {
  return <h2>{text}</h2>
}

const Entry = ({ person }) => {

  const remove = () => {
    if(window.confirm(`Delete ${person.name} ?`)) {
      phonebookService
        .remove(person.id)
        .then(() => {
          window.location.reload()
        })
    }
  }

  return (
    <li key={person.name}>
      {person.name} {person.number}
      <button onClick={remove}> delete </button>
      </li>
  )
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
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    phonebookService
    .getAll()
    .then(people => {
      setPersons(people)
    })
  }, [])

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

    if(persons.some(person => person.name === newName))
    {
      if(window.confirm(`${newName} is already added to phonebook, update the number instead?`)) {
      phonebookService
        .update(persons.find(p => p.name === newName).id, {name: newName, number: newNumber})
        .then(() => {
          window.location.reload()
        })
    }
      return
    }
    const nameObject = {
      name: newName,
      number: newNumber,
    }
    phonebookService
      .add(nameObject)
      .then(returnedNumber => {
        setPersons(persons.concat(nameObject))
        setNewName('')
        setNewNumber('')
      })
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