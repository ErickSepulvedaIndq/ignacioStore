import { createContext, useContext, useMemo, useState } from "react";

const SearchContext = createContext(undefined);

export function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedSearch = useMemo(
    () => searchTerm.trim().toLowerCase(),
    [searchTerm],
  );

  const value = useMemo(
    () => ({ searchTerm, setSearchTerm, normalizedSearch }),
    [searchTerm, normalizedSearch],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch esta siendo usado incorrectamente :(");
  }

  return context;
}
