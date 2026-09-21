import './Post.css'

export default function Post({url}: {url: string}){
    return (
        <img className="post" src={url} alt="" loading="lazy"></img>
    )
}
