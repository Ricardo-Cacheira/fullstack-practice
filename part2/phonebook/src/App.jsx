import { useState } from 'react'

const Header = ({ text }) => {
  return <h2>{text}</h2>
}

const Phonebook = ({ persons }) => {
  return (
    <div>
      {persons.map(person => 
        <li key={person.name}>{person.name}</li>
      )}
    </div>
    )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleAddName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
    }
    setPersons(persons.concat(nameObject))
    setNewName('')
  }

  return (
    <div>
      <Header text="Phonebook" />
      <form>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button onClick={handleAddName} type="submit">add</button>
        </div>
      </form>
      <Header text="Numbers" />
      <Phonebook persons={persons} />
    </div>
  )
}

export default App