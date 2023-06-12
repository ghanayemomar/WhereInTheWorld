export const dropdownItems = dropdownMenu.querySelectorAll(".dropdown-item");

import { cardContainer, dropdownButton, searchInput } from "../Variables.js";

import { isLoading, handleFetchError } from "../HelperFunctions.js";
import { renderCards } from "../RenderFunctions.js";

const baseURL =
  "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags";
let countriesData = [];
let selectedRegion = "No Filter";
let searchTimer;

fetchData();
searchInput.addEventListener("keyup", handleSearch); 
dropdownItems.forEach((item) => {
  item.addEventListener("click", handleRegionFilter);
});

async function fetchData(url = baseURL) {
  try {
    isLoading();
    const response = await fetch(url);
    if (!response.ok) {
      countriesData = [];
      throw new Error("No Data Found");
    }
    countriesData = await response.json();
    filterByRegion();
  } catch (error) {
    console.log(error);
    handleFetchError(error);
  } finally {
    isLoading();
    cardContainer.classList.remove("d-none");
  }
}

function filterByRegion() {
  var filteredData = countriesData.filter((country) => {
    if (selectedRegion !== "No Filter") {
      return country.region === selectedRegion;
    }
    return true;
  });
  return renderCards(filteredData);
}

function handleSearch(event) {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const searchResult = event.target.value.trim();
    searchResult === "" || null
      ? fetchData()
      : fetchData(baseURL.replace("all", `name/${searchResult}`));
  }, 500);
}

function handleRegionFilter(event) {
  selectedRegion = event.target.innerText;
  filterByRegion();
  if (selectedRegion === "No Filter") {
    dropdownButton.innerText = "Filter by region";
  } else {
    dropdownButton.innerText = selectedRegion;
  }
}
