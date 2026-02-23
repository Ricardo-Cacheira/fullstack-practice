import { createSlice } from '@reduxjs/toolkit'

const initialState = 'notification Test'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers:{
    notify(state, action){
      return action.payload
    }
  }
})

export const { notify } = notificationSlice.actions
export default notificationSlice.reducer