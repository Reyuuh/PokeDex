import React from "react";

interface SearchBarProps {
    query: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({query, onSearchChange}) => {

return(
<input 
type="text" 
placeholder="Search Pokémon..."
value={query}
onChange={onSearchChange}
/>

 );

};