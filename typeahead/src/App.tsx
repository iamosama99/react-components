import { useEffect, useState } from 'react'
import './App.css'

type Product = {
  id: number;
  title: string;
  category: string
}

type Status = 'idle' | 'loading' | 'success' | 'error';

function useDebounce<T>(value: T, delay: number): T  {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}

function App() {
  
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery !== '';
  const debouncedQuery = useDebounce(trimmedQuery, 300);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setStatus('idle');
      return
    }
    const controller = new AbortController();
    async function fetchData() {
      try {
        setStatus('loading');
        const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(debouncedQuery)}&limit=10&select=id,title,category`, {signal: controller.signal});
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setResults(data.products);
        setStatus('success');
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setStatus('error');
        console.error(err);
      }
    }
    fetchData();
    return () => controller.abort();
  },[debouncedQuery])

  return (
    <div className="container">
      <input value={query} onChange={(e) => setQuery(e.target.value)}></input>
      {!hasQuery && <div>Type something</div>}
      {hasQuery && status === 'loading' && <div>Loading..</div>}
      {hasQuery && status === 'error' && <div>Error</div>}
      {hasQuery && status === 'success' && results.length === 0 && <div>No results</div>}
      {hasQuery && (
        <ul>
        {
          results.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))
        }
        </ul>
      )}
    </div>
  )
}

export default App
