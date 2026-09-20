import { useEffect, useState, useRef} from 'react'
import Post from './components/Post'

import './App.css'

function App() {

  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef(null);


  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=4`, {signal: controller.signal});
        const data = await response.json();
        if(data.length === 0) setHasMore(false);  
        setResults((prev) => [...prev, ...data]);
      } catch (err) {
        if(err.name === 'AbortError') return;
        console.error(err.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    fetchData();

    return () => controller.abort();
  }, [page])

  useEffect(() => {
    const el = sentinelRef.current;
    if(!el) return;

    const observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting && !loading && hasMore) {
        setPage( p => p+1);
      }
    },);

    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  return (
    <>
    <div className="container">

      {
        results.map((post) => (
          <Post key={post.id} url={post.download_url}></Post>
        )
      )
    }
    {loading && <p>Loading...</p>}
    {!hasMore && <p>No more photos</p>}
    </div>
    {hasMore && <div ref={sentinelRef} />}
    </>
  )
}

export default App
