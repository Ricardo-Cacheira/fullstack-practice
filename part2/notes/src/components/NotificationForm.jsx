import { useState } from 'react'
import noteService from '../services/notes'

const NotificationForm = ({ user, notes, setNotes, setErrorMessage }) => {
  const [newNote, setNewNote] = useState('')
  
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

    noteService
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
    .catch(error => {
      setErrorMessage( error.message)
    })
  }

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
  )

  return(
    <>
    {user && (
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
        </div>
    )}
    </>
  )
}


export default NotificationForm