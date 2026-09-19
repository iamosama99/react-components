
import { useState } from 'react'
import Modal from './Modal'
import './App.css'

function App() {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className="container">
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>.
          <input placeholder="name" />
          <button>Save</button>
      </Modal>
      <button onClick={() => setIsOpen(true)}>open modal</button>
    </div>
  )
}

export default App
