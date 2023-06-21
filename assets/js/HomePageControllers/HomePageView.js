import { isLoading } from "../Api/LoadingSpinner.js";

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

export function debounce(cb, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb.apply(this, args);
    }, delay);
  };
}
