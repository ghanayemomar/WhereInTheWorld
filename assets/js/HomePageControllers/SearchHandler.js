import { handleData } from "../HomePage.js";
const searchInput = document.getElementById("input");

export function debounce(cb, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb.apply(this, args);
    }, delay);
  };
}

export function handleSearch(event) {
  const searchResult = event.target.value.trim();
  !searchResult ? handleData() : handleData(searchResult);
}

const debouncedHandleSearch = debounce(handleSearch, 500);
searchInput.addEventListener("keyup", debouncedHandleSearch);
