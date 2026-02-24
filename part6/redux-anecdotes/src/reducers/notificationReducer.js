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

const { notify, clearNotification } = notificationSlice.actions

export const setNotification = (content, time = 5) => {
  return async (dispatch) => {
    dispatch(notify(content))
    setTimeout(() => {
      dispatch(clearNotification())
    }, time*1000)
  }
}

export default notificationSlice.reducer