
import { useState, useRef, useEffect} from 'react'
import './App.css'

type Toast = {
  id: string
  message: string,
  type: string,
}

function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeouts = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    return () => timeouts.current.forEach((id) => clearTimeout(id));
  },[])

  function handleOpen (type: string, message: string) {
    const newToast: Toast = {
      id : crypto.randomUUID(),
      type: type,
      message: message
    }
    setToasts((prev) => {
      return [...prev, newToast];
    })
    const timoutId = setTimeout(() => {
      handleClose(newToast.id);
    }, 3000);

    timeouts.current.set(newToast.id, timoutId);
  }

  function handleClose (id: string) {
    clearTimeout(timeouts.current.get(id));
    timeouts.current.delete(id);
    setToasts((prev) => {
      return prev.filter((toast) => toast.id !== id);
    })
  }
  
  return (
    <div className='container'>
      <div aria-live='polite' className='toast-container'>
        {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <span className='toast-message'>{toast.message}</span>
          <button aria-label='dismiss' className='toast-cancel' onClick={() => handleClose(toast.id)}>x</button>
        </div>
        ))}
      </div>
      <button onClick={() => handleOpen('success', 'Success Toast')}>open Success</button>
      <button onClick={() => handleOpen('error','Error Toast')}>open Error</button>
    </div>
  )
}

export default App
