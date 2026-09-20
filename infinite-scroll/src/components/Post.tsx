import './Post.css'

export default function Post({url}){
    return (
        <img className="post" src={url} alt="" loading="lazy"></img>
    )
}
