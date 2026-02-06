import ReactDOM from 'react-dom/client'
import './index.css'
import axios from 'axios'
import App from './App'

axios.get('/api/notes').then(response => {
  const notes = response.data
  ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)
})

const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocolll',
    important: true
  }
]

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <App notes={notes} />
// )