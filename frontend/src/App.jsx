import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState("Connecting to server...")

  useEffect(() => {
    // Call our backend server
    axios.get('http://localhost:5000/')
      .then(res => setMessage(res.data))
      .catch(err => setMessage("Backend is not connected ❌"))
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to EduFlowAI</h1>
      <p>Server Status: <strong>{message}</strong></p>
    </div>
  )
}

export default App