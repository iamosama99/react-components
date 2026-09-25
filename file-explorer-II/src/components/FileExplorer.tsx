import FileTree from './FileTree'
import './FileExplorer.css'
import { Children, useReducer } from 'react'

function updateTree(nodes, targetId, updater) {
    return nodes.map(node => {
        if (node.id === targetId) return updater(node)
        if (node.children) return { ...node, children: updateTree(node.children, targetId, updater) }
        return node
    })
}

function deleteFromTree(nodes, targetId) {

    const filtered = nodes.filter(node => node.id !== targetId)

    return filtered.map(node => {
        if (node.children) return { ...node, children: deleteFromTree(node.children, targetId) }
        return node
    })
}

function addToTree(nodes, parentId, newNode) {
    return nodes.map( node => {
        if(node.id === parentId){
            return { ...node, children: node.children ? [...node.children, newNode] : [newNode] };
        }
        if(node.children) {
            return {...node, children: addToTree(node.children, parentId, newNode)}
        }
        return node;
    })
}

function treeReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return addToTree(state, action.parentId, action.node);
    case 'RENAME':
      return updateTree(state, action.id, node => ({ ...node, name: action.name }));
    case 'DELETE':
      return deleteFromTree(state, action.id);
    default:
      return state
  }
}


export default function FileExplorer({initialData}) {

    const [data, dispatch] = useReducer(treeReducer, initialData)

    function handleRename(id, name) {
        dispatch({ type: 'RENAME', id, name })
    }

    function handleDelete(id) {
        dispatch({ type: 'DELETE', id })
    }
    
    function handleAdd(parentId, node) {
        dispatch({ type: 'ADD', parentId, node })
    }

    return (
        <FileTree data={data} onRename={handleRename} onDelete={handleDelete} onAdd={handleAdd}/>
    )
} 