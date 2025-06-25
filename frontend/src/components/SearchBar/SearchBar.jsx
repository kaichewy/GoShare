import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './SearchBar.css'

const SearchBar = ({ onSearch }) => {
    const [ query, setQuery ] = useState('')
    
    const handleQuery = (event) => {
        setQuery(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        onSearch(query)
    }

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
            type='text'
            placeholder='Find groups...'
            value={query}
            onChange={handleQuery}></input>
            <button
            type='submit'>
                <i className="fas fa-search"></i>
            </button>
        </form>
    )
}

export default SearchBar