import React, { useState } from "react";

function AutoSearch() {
  const [query, setQuery] = useState("");

  return (
    <div className="container max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-neutral-dark">
        AutoSearch
      </h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="search..."
        className="w-full rounded-2xl border border-neutral 
                     px-4 py-2 pl-10 shadow-sm
                     placeholder-neutral
                     focus:border-primary focus:ring-2 focus:ring-primary-light 
                     transition-all duration-200"
      />
    </div>
  );
}

export default AutoSearch;
