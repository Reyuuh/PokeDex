import React from "react";
import '../styles/SearchBar.scss'

interface SearchBarProps {
    query: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({query, onSearchChange}) => {

return(
    <div className="searchbar-container" >
<input 
className="search-bar"
type="text" 
placeholder="Search Pokémon"
value={query}
onChange={onSearchChange}
/>
</div>
 );

};