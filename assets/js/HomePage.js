import { handleFetchError } from "../js/Api/ErrorHandler.js";
import { filterByRegion } from "./HomePageControllers/FilterCountries.js";
import {
  saveFavoriteStatus,
  removeFavoriteStatus,
  updateStarIcon,
  initializeFavoriteList,
  getCountryFromCardElement,
} from "./HomePageControllers/FavCountryFunctions.js";
import fetchHomePageData from "./Api/ApiController.js";
import {
  clearCardContainer,
  appendChildToCardContainer,
  noResultFound,
  loading,
  loaded,
} from "./HomePageControllers/HomePageView.js";

const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownButton = document.getElementById("dropdownButton");
const dropdownItems = dropdownMenu.querySelectorAll(".dropdown-item");
const favouritescontainer = document.querySelector(".favourites-container");
let selectedRegion = "No Filter";

export async function handleData(searchResult) {
  let countriesData = [];
  dropdownItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      handleRegionFilter(event, countriesData);
    });
  });

  try {
    loading();
    countriesData = await fetchHomePageData(searchResult);
    var filteredCountries = filterByRegion(countriesData, selectedRegion);
    renderCards(filteredCountries);
  } catch (error) {
    console.log(error);
    clearCardContainer();
    appendChildToCardContainer(handleFetchError(error));
  } finally {
    loaded();
  }
}

handleData();
initializeFavoriteList();

function renderCards(filteredData) {
  clearCardContainer();
  filteredData.length === 0
    ? noResultFound()
    : filteredData.forEach((country) => {
        const card = createCardElement(country);
        appendChildToCardContainer(card);
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
