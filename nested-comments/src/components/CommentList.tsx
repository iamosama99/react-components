import Comment from "./Comment"

export default function CommentList({ comments, onDelete, onReply }) {
    return (
        <>
            {comments.map((comment) => (
                <Comment key={comment.id} comment={comment} onDelete={onDelete} onReply={onReply}/>
            ))}
        </>
    )
}
