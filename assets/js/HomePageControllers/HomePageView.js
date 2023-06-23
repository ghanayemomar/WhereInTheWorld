import { isLoading } from "../Api/LoadingSpinner.js";
import { handleData } from "../HomePage.js";
const cardContainer = document.getElementById("cardContainer");
const searchInput = document.getElementById("input");

export function clearCardContainer() {
  cardContainer.innerHTML = "";
}
export function appendChildToCardContainer(child) {
  cardContainer.appendChild(child);
}
export function noResultFound() {
  cardContainer.innerHTML = `<h2 class="text-center">No result Found.</h2>`;
}

export function loading() {
  isLoading(cardContainer, true);
}
export function loaded() {
  isLoading(cardContainer, false);
}

function debounce(cb, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb.apply(this, args);
    }, delay);
  };
}

function handleSearch(event) {
  const searchResult = event.target.value.trim();
  !searchResult ? handleData() : handleData(searchResult);
}

const debouncedHandleSearch = debounce(handleSearch, 500);
searchInput.addEventListener("keyup", debouncedHandleSearch);
