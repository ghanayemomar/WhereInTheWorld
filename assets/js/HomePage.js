import { handleFetchError } from "./Controllers/ErrorHandler.js";
import { isLoading } from "./Controllers/LoadingSpinner.js";
import { fetchData } from "./Controllers/FetchModule.js";
import { filterByRegion } from "./Controllers/HomePageControllers/FilterCountries.js";
import {
  saveFavoriteStatus,
  removeFavoriteStatus,
  updateStarIcon,
  initializeFavoriteList,
  getCountryFromCardElement,
} from "./controllers/HomePageControllers/FavCountryFunctions.js";

const favouritescontainer = document.querySelector(".favourites-container");
const cardContainer = document.getElementById("cardContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownButton = document.getElementById("dropdownButton");
const dropdownItems = dropdownMenu.querySelectorAll(".dropdown-item");
const searchInput = document.getElementById("input");
let searchTimer;
let selectedRegion = "No Filter";

async function handleData(
  apiUrl = "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags"
) {
  let countriesData = [];

  dropdownItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      handleRegionFilter(event, countriesData);
    });
  });

  searchInput.addEventListener("keyup", handleSearch);

  try {
    isLoading(cardContainer, loadingSpinner, true);
    countriesData = await fetchData(apiUrl);
    var filteredCountries = filterByRegion(countriesData, selectedRegion);
    renderCards(filteredCountries);
  } catch (error) {
    console.log(error);
    cardContainer.innerHTML = "";
    cardContainer.appendChild(handleFetchError(error));
  } finally {
    isLoading(cardContainer, loadingSpinner, false);
  }
}

handleData();
initializeFavoriteList();

function renderCards(filteredData) {
  cardContainer.innerHTML = "";
  filteredData.length === 0
    ? (cardContainer.innerHTML = `<h2 class="text-center">No result Found.</h2>`)
    : filteredData.forEach((country) => {
        const card = createCardElement(country);
        cardContainer.appendChild(card);
      });
}

//-------------//
export function createCardElement(country) {
  const card = document.createElement("div");

  card.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", "");
    event.dataTransfer.setDragImage(card.querySelector(".card-img-top"), 0, 0);
    card.classList.add("dragging");
  });
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });
  card.setAttribute("draggable", "true");
  card.className = "card-container col-12 col-md-6 col-lg-6 col-xxl-4";
  const countryName = encodeURIComponent(country.name.common);
  card.innerHTML = `
      <a class="card" href="detail.html?country-name=${countryName}">
        <img src="${
          country.flags ? country.flags.svg : "../assets/images/No_flag.svg"
        }" class="card-img-top" alt="${country.name.common}">
        <div class="card-body d-flex flex-column gap-2 mx-2">
          <span class="card-title mt-3">${country.name.common}</span>
          <ul>
            <li>
              <span class="label">Population:</span>
              <span class="value">${
                country.population == null
                  ? "No Data Found"
                  : country.population.toLocaleString()
              }</span>
            </li>
            <li>
              <span class="label">Region:</span>
              <span class="value">${
                country.region == "" ? "No Data Found" : country.region
              }</span>
            </li>
            <li>
              <span class="label">Capital:</span>
              <span class="value">${
                country.capital == "" ? "No Data Found" : country.capital
              }</span>
            </li>
          </ul>
          <i class="fa-star star-icon"></i> 
        </div>
      </a>`;

  const starIcon = card.querySelector(".star-icon");
  let isFavorite = localStorage.getItem(countryName);
  updateStarIcon(starIcon, isFavorite);
  let selected = {
    name: country.name.common,
    img: country.flags.svg,
  };
  starIcon.addEventListener("click", (event) => {
    event.preventDefault();
    starIcon.className === "fa-star star-icon fa-regular"
      ? (updateStarIcon(starIcon, true), saveFavoriteStatus(selected))
      : removeFavoriteStatus(countryName);
  });

  return card;
}

function handleSearch(event) {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const searchResult = event.target.value.trim();
    !searchResult
      ? handleData()
      : handleData(
          `https://restcountries.com/v3.1/name/${searchResult}?fields=name,population,region,capital,flags`
        );
  }, 500);
}

function handleRegionFilter(event, countriesData) {
  selectedRegion = event.target.innerText;
  const filteredCountries = filterByRegion(countriesData, selectedRegion);
  renderCards(filteredCountries);
  if (selectedRegion === "No Filter") {
    dropdownButton.innerText = "Filter by";
  } else {
    dropdownButton.innerText = selectedRegion;
  }
}
favouritescontainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  favouritescontainer.classList.add("highlight");
});
favouritescontainer.addEventListener("dragleave", (e) => {
  e.preventDefault();
  favouritescontainer.classList.remove("highlight");
});

favouritescontainer.addEventListener("drop", (e) => {
  e.preventDefault();
  favouritescontainer.classList.remove("highlight");
  const draggable = document.querySelector(".dragging");
  const country = getCountryFromCardElement(draggable);
  country.icon.className === "fa-star star-icon fa-regular"
    ? (updateStarIcon(country.icon, true), saveFavoriteStatus(country))
    : "";
});
