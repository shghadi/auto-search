import React, { useState } from "react";

function AutoSearch() {
  const [query, setQuery] = useState("");
  return (
    <>
      <div>AutoSearch</div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="search...."
      />
    </>
  );
}

export default AutoSearch;
