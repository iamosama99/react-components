import { useState } from 'react'
import './App.css'
import initialData from './initialData.json'
import CommentList from './components/CommentList'

function App() {

  const [comments, setComments] = useState(initialData);

  function removeComment(list, id) {
    const filteredComments = list.filter(comment => comment.id !== id);
    return filteredComments.map(comment => {
      return { ...comment, children: removeComment(comment.children, id) }
    })
  }

  function handleDelete(id) {
    setComments(removeComment(comments, id))
  }

  function addReply(list, id, text) {
    return list.map(comment => {
      if(comment.id === id){
        return {...comment, children: [...comment.children, {text: text, id: crypto.randomUUID(), children:[]}]}
      }
      return {...comment, children: addReply(comment.children, id, text)}
    })
  }

  function handleReply(id, text) {
    setComments(addReply(comments, id, text));
  }

  return (
    <div className="app">
      <CommentList comments={comments} onDelete={handleDelete} onReply={handleReply}></CommentList>
    </div>
  )
}

export default App
