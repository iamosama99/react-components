import FileExplorer from './components/FileExplorer'
import './App.css'

function App() {

  const data = [
    {
      name : 'src',
      isFolder : true,
      id: 1,
      children : [
        {
          name : 'components',
          isFolder : true,
          id: 2,
          children : [
            {
              name: 'app.tsx',
              isFolder: false,
              id : 3
            }
          ]
        },
        {
          name : 'main.tsx',
          isFolder : false,
          id : 4
        }
      ]
    },
    {
      name: '.gitignore',
      isFolder: false,
      id : 5
    },
    {
      name: 'package-lock.json',
      isFolder: false,
      id : 6
    },

  ]

  return (
    <div className="app">
      <FileExplorer data={data}></FileExplorer>
    </div>
  )
}

export default App
