import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { notify, clearNotification } from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, handleClick }) => {
  return(
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({filter, anecdotes}) =>{
      //can't sort the state without making a copy first
      const anecdoteList = anecdotes.filter(anecdotes => anecdotes.content.includes(filter))
      return anecdoteList.sort((a, b) => b.votes - a.votes)
    }
  )

  const vote = anecdote => {
    dispatch(voteAnecdote(anecdote))
    dispatch(notify(`You voted on '${anecdote.content}'`))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  return(
    <div>
      {anecdotes.map(anecdote => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote)}
        />
      ))}
    </div>
  )
}

export default AnecdoteList