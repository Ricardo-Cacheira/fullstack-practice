const Notification = ({ message, type}) => {
  if (message === null || message === undefined) {
    return null
  }

  return (
    <div className={type === 'error' ? 'error' : 'notification'}>
      {message}
    </div>
  )
}

export default Notification