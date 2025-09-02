import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import { useDebounce } from "use-debounce";

type Item = { id: number; name: string };

export default function AutoSearch() {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;

    fetch(`http://localhost:3001/items?search=${debouncedQuery}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data: Item[]) => {
        const normalizedQuery = debouncedQuery.toLowerCase();
        // exact match اول و سپس شامل query
        const exact = data.filter(
          (item) => item.name.toLowerCase() === normalizedQuery
        );
        const partial = data.filter(
          (item) =>
            item.name.toLowerCase() !== normalizedQuery &&
            item.name.toLowerCase().includes(normalizedQuery)
        );
        setResults([...exact, ...partial]);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError("Error fetching data");
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        className="w-full px-4 py-2 rounded-2xl border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-primary-light
                   shadow-sm"
      />

      {loading && <div className="mt-3 text-sm opacity-70">Loading...</div>}
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

      <ul className="mt-4 space-y-2">
        {results.map((item: Item) => (
          <li key={item.id} className="p-2 bg-neutral-100 rounded">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
