import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

const Search = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState([]);
  const [selected, setSelected] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();

  

  const onSearchText = useCallback((input) => {
      console.log('making a call')
    setIsLoading(true);
    axios
      .get(`http://localhost:3001/dictionaries/search`, { params: { input: input } })
      .then((result) => {
        console.log(result.data)
        setResult(result.data);
        setErrorMsg('');
        setIsLoading(false);
        setSelected("");
      })
      .catch((error) => {
        console.log(error)
        setErrorMsg('Something went wrong. Try again later.');
        setIsLoading(false);
      });
  }, []);

  const debouncedSearch = useMemo(() => {
    return debounce(onSearchText, 1000)
  }, [onSearchText])

  const handleInputChange = (event) => {
    const input = event.target.value;
    setInput(input);
    inputRef.current(input);
  };

  const onSelect = async (selection, e) => {
    await e
    setSelected(selection);
    setInput(selection)
  }

  const resultMarkup = (
    <div className="search-result">
        {
        result.map((item, index) => (
            <div onClick={(e) => onSelect(item.word, e)} key={index}>{item.word}</div>
         ))}
    </div>
  )

  useEffect(() => {
    // initialize debounce function to search once user has stopped typing every half second
    inputRef.current = debounce(onSearchText, 500);
  }, []);

  
  return (
    <div className="container">
        <input className="search-field"
            onChange={handleInputChange}
            value={input} placeholder="Search">
        </input>
        { selected === "" && resultMarkup }
    </div> 
  )
};

export default Search;