import { useState } from "react"
import CommentList from "./CommentList"

export default function Comment({ comment, onDelete, onReply }) {
    const [isReplying, setIsReplying] = useState(false);
    const [text, setText] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!text.trim()) {
            return;
        }
        onReply(comment.id, text);
        setText("")
        setIsReplying(false)
    }

    return (
        <div className="comment">
            <span className="comment-text">{comment.text}</span>
            <button className="delete-btn" onClick={() => onDelete(comment.id)}>Delete</button>
            <button className="reply-btn" disabled={isReplying} onClick={() => setIsReplying((prev) => !prev)}>Reply</button>
            {isReplying && (
                <form className="reply-form" onSubmit={handleSubmit}>
                    <input
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Write a reply..."
                        autoFocus
                    />
                    <button type="submit">Post</button>
                    <button type="button" onClick={() => setIsReplying(false)}>Cancel</button>
                </form>
            )}
            <div className="replies">
                <CommentList comments={comment.children} onDelete={onDelete} onReply={onReply}></CommentList>
            </div>
        </div>
    )
}
