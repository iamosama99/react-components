import { useState } from 'react'
import './FileExplorer.css'

export default function FileExplorer({data}) {
    return(
        <div className="container">
            {
                data.map((item) => <FileNode key={item.id} item={item} />)
            }
        </div>
    )
}

function FileNode({item}) {
    const [open, setOpen] = useState(false);

    if(!item.isFolder){
        return <div className='file-item'>{item.name}</div>
    }

    return (
        <>
        <button onClick={() => setOpen((o) => !o)} className='file-item'>
            <span>
                {open ? '▼' : '▶'}
            </span>
            {item.name}
        </button>
        {open && !!item.children && <FileExplorer data={item.children}></FileExplorer>}
        </>
    )
}