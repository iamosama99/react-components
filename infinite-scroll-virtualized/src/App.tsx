import { useEffect, useState } from 'react'
import Post from './components/Post'

import './App.css'
import VirtualList from './components/VirtualList';

type Photo = {
  id: string;
  download_url: string;
};

function App() {

  const [page, setPage] = useState(1);
  const [results, setResults] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=20`, {signal: controller.signal});
        const data = await response.json();
        if(data.length === 0) setHasMore(false);  
        setResults((prev) => [...prev, ...data]);
      } catch (err) {
        if(!(err instanceof Error) || err.name === 'AbortError') return;
        console.error(err.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    fetchData();

    return () => controller.abort();
  }, [page])

  return (
    <>
    <div className="container">

    <VirtualList
      count={results.length}
      itemHeight={300}
      renderItem={(index) => <Post url={results[index].download_url}></Post>}
      onEndReached={() => {
        if (!loading && hasMore) setPage(p => p + 1);
      }}
    ></VirtualList>
    {loading && <p>Loading...</p>}
    {!hasMore && <p>No more photos</p>}
    </div>
    </>
  )
}

export default App
