import React, { useState } from 'react';
import './search.scss';
import { useRouter } from 'next/router';

const Search = () => {
  const [searchKey, setSearchKey] = useState<'movie' | 'tv'>('movie'); // search through 'tv' shows.  Other choice is 'movie'
  const [searchValue, setSearchValue] = useState<string>('');
  const Router = useRouter();
  const handleSelectChange = (event: any) => {
    setSearchKey(event.target.value);
  };

  const handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.value;
    setSearchValue(value);
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (searchKey === 'movie') {
      Router.push(`/search-result?type=movie&query=${searchValue}`);
    }
    else {
      Router.push(`/search-result?type=tv&query=${searchValue}`);
    }
  };
  return (
    <div className="t-search ">
      <div className="search-list">
        <select onChange={handleSelectChange} value={searchKey} >
          <option value="movie">movie</option>
          <option value="tv">tv show</option>
        </select>
      </div>
      <div className="search-input">
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Search for a movie, or TV Show that you are looking for"
            name="search-value" value={searchValue} onChange={handleInputChange} />
          <i className="icon icon-search"></i>
        </form>
      </div>
    </div>
  );
};

export default Search;