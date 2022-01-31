import { useState } from 'react'
import './App.css'
import Route from './route'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Route/>
    </div>
  )
}

export default App
