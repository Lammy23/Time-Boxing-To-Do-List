"use client"

import { createContext, ReactNode, useContext, useState } from "react";

interface searchContextInterface {
  keyword: string;
  searchTodoist: boolean;
}

const searchContextDefaultValues: searchContextInterface = {
  keyword: "",
  searchTodoist: false,
};

const SearchContext = createContext<searchContextInterface>(
  searchContextDefaultValues
);

interface searchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: searchProviderProps) {
  const [keyword, setKeyword] = useState<string>("");
  const [searchTodoist, setSearchTodoist] = useState<boolean>(false);

  const value = {
    keyword,
    searchTodoist,
  };

  return (
    <>
      <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
    </>
  );
}
