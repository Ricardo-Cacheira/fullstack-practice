import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers:{
    createAnecdote(state, action){
      state.push(action.payload)
    },
    addVote(state, action)
    {
      const id = action.payload
      return state.map((anecdote) =>
        anecdote.id === id
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

const { setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const notes = await anecdoteService.getAll()
    dispatch(setAnecdotes(notes))
  }
}

export const { createAnecdote, addVote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
