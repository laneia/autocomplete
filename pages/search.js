import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

const Search = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState([]);
  const [selected, setSelected] = useState('');
  const inputRef = useRef();

  const onSearchText = useCallback((input) => {
    // .then .catch older way of doing async operations on
    // more modern is to use async keyword on function declaration and await right before the api call
    axios
      .get(`https://peaceful-headland-63045.herokuapp.com/dictionaries/search`, { params: { input: input } })
      .then((result) => {
        console.log(result.data)
        setResult(result.data);
        setSelected("");
      })
      .catch((error) => {
        console.log(error)
      });
  }, []);

  const handleInputChange = (event) => {
    const input = event.target.value;
    setInput(input);
    inputRef.current(input);
  };

  const onSelect = async (selection, e) => {
    await e
    console.log(selection)
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
    // initialize debounce function to search once user has stopped typing every .2 seconds 
    inputRef.current = debounce(onSearchText, 200);
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
