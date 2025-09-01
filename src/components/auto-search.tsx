import React, { useState, useEffect } from "react";

type Item = {
  id: number;
  name: string;
};

function AutoSearch() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Item[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetch(`https://api.example.com/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.items as Item[]);
        })
        .catch((err) => console.error(err));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="جستجو..."
        className="w-full px-4 py-2 rounded-2xl border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-primary-light
                   shadow-sm"
      />

      <ul className="mt-4 space-y-2">
        {results.map((item) => (
          <li key={item.id} className="p-2 bg-neutral-light rounded">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AutoSearch;
