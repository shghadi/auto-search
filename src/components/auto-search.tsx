import React, { useEffect, useRef, useState } from "react";

type Item = { id: number; name: string };

export default function AutoSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceMs = 500;
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Fetch all items once on mount
    fetch(`http://localhost:5000/items`)
      .then((res) => res.json())
      .then((data: Item[]) => setAllItems(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      // show full list if search is empty
      setResults(allItems);
      setError(null);
      controllerRef.current?.abort();
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;

    const t = setTimeout(() => {
      fetch(`http://localhost:3001/items`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: Item[]) => {
          const normalizedQuery = query.toLowerCase();
          const filtered = data.filter((item) => {
            const nameLower = item.name.toLowerCase();
            return (
              nameLower === normalizedQuery ||
              nameLower.includes(normalizedQuery)
            );
          });
          setResults(filtered.length ? filtered : allItems);
        })
        .catch((err) => {
          if (err?.name !== "AbortError") setError("Error fetching data");
        })
        .finally(() => setLoading(false));
    }, debounceMs);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query, allItems]);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full px-4 py-2 rounded-2xl border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-primary-light
                   shadow-sm"
      />

      {loading && <div className="mt-3 text-sm opacity-70">Loading...</div>}
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

      <ul className="mt-4 space-y-2">
        {results.map((item) => (
          <li key={item.id} className="p-2 bg-neutral-100 rounded">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
