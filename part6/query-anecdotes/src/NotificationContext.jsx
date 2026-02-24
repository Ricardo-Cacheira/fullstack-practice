import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'NEW_NOTE':
      return `anecdote '${action.payload}' created`
    case 'NEW_VOTE':
      return `anecdote '${action.payload}' voted`
    case 'ERROR':
      return action.payload
    case 'RESET':
      return ''
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  const setNotification = (action) => {
    notificationDispatch(action)

    setTimeout(() => {
      notificationDispatch({ type: 'RESET' })
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, notificationDispatch: setNotification }}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
