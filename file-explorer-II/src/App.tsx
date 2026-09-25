import FileExplorer from './components/FileExplorer'
import './App.css'


 
function App() {

  const data  = [
    {
      name : 'src',
      isFolder : true,
      id: crypto.randomUUID(),
      children : [
        {
          name : 'components',
          isFolder : true,
          id: crypto.randomUUID(),
          children : [
            {
              name: 'app.tsx',
              isFolder: false,
              id : crypto.randomUUID()
            }
          ]
        },
        {
          name : 'main.tsx',
          isFolder : false,
          id : crypto.randomUUID()
        }
      ]
    },
    {
      name: '.gitignore',
      isFolder: false,
      id : crypto.randomUUID()
    },
    {
      name: 'package-lock.json',
      isFolder: false,
      id : crypto.randomUUID()
    },

  ]
  


  return (
    <div className="app">
      <FileExplorer initialData={data}></FileExplorer>
    </div>
  )
}

export default App
