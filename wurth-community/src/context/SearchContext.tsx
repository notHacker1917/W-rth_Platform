import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface SearchContextValue {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const SearchContext = createContext<SearchContextValue>({
  searchQuery: '',
  setSearchQuery: () => {},
});

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

// Pages that previously did `const { searchQuery } = useOutletContext<...>()`
// now do `const { searchQuery } = useSearch()`.
export const useSearch = () => useContext(SearchContext);
