import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

type Item = { id: number; name: string };

export default function AutoSearch() {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all items once on mount
    fetch(`http://localhost:3001/items`)
      .then((res) => res.json())
      .then((data: Item[]) => setAllItems(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(allItems);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`http://localhost:3001/items`)
      .then((res) => res.json())
      .then((data: Item[]) => {
        const normalizedQuery: string = debouncedQuery.toLowerCase();
        const filtered: Item[] = data.filter((item) => {
          const nameLower: string = item.name.toLowerCase();
          return (
            nameLower === normalizedQuery || nameLower.includes(normalizedQuery)
          );
        });
        setResults(filtered.length ? filtered : allItems);
      })
      .catch(() => setError("Error fetching data"))
      .finally(() => setLoading(false));
  }, [debouncedQuery, allItems]);

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
        {results.map((item: Item) => (
          <li key={item.id} className="p-2 bg-neutral-100 rounded">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
