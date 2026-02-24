import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers:{
    notify(state, action){
      return action.payload
    },
    clearNotification(){
      return ''
    }
  }
})

export const { notify, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer