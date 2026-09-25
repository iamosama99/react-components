import { useState } from "react";

export default function FileTree({data, onRename, onDelete, onAdd}) {
    return(
        <div className="container">
            {
                data.map((item) => (
                    <TreeNode
                        key={item.id}
                        item={item}
                        onRename={onRename}
                        onDelete={onDelete}
                        onAdd={onAdd}
                    />
                ))
            }
        </div>
    )
}

function TreeNode({item, onRename, onDelete, onAdd}) {
    const [open, setOpen] = useState(false);

    function handleRename(event) {
        event.stopPropagation();
        const newName = window.prompt('Rename to:', item.name);
        if (newName && newName.trim()) onRename(item.id, newName.trim());
    }

    function handleDelete(event) {
        event.stopPropagation();
        if (window.confirm(`Delete "${item.name}"?`)) onDelete(item.id);
    }

    function handleAddFile(event) {
        event.stopPropagation();
        const name = window.prompt('New file name:');
        if (name && name.trim()) {
            onAdd(item.id, { id: crypto.randomUUID(), name: name.trim(), isFolder: false });
        }
    }

    function handleAddFolder(event) {
        event.stopPropagation();
        const name = window.prompt('New folder name:');
        if (name && name.trim()) {
            onAdd(item.id, { id: crypto.randomUUID(), name: name.trim(), isFolder: true, children: [] });
        }
    }

    if(!item.isFolder){
        return (
            <div className='file-item'>
                <span className='file-item-label'>{item.name}</span>
                <span className='file-item-actions'>
                    <button onClick={handleRename}>Rename</button>
                    <button onClick={handleDelete}>Delete</button>
                </span>
            </div>
        )
    }

    return (
        <>
        <div className='file-item'>
            <button onClick={() => setOpen((o) => !o)} className='file-item-toggle'>
                <span>
                    {open ? '▼' : '▶'}
                </span>
                {item.name}
            </button>
            <span className='file-item-actions'>
                <button onClick={handleRename}>Rename</button>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={handleAddFile}>+ File</button>
                <button onClick={handleAddFolder}>+ Folder</button>
            </span>
        </div>
        {open && !!item.children && (
            <FileTree
                data={item.children}
                onRename={onRename}
                onDelete={onDelete}
                onAdd={onAdd}
            />
        )}
        </>
    )
}