import { handleFetchError } from "./controllers/ErrorHandler.js";
import { isLoading } from "./controllers/loadingSpinner.js";
import { fetchData } from "./controllers/fetchModule.js";

const cardContainer = document.getElementById("cardContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownButton = document.getElementById("dropdownButton");
const dropdownItems = dropdownMenu.querySelectorAll(".dropdown-item");
const searchInput = document.getElementById("input");
const favList = document.getElementById("favList");

let searchTimer;
let selectedRegion = "No Filter";

async function handleData(apiUrl = "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags") {
  let countriesData = [];

  dropdownItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      handleRegionFilter(event, countriesData);
    });
  });

  searchInput.addEventListener("keyup", handleSearch);

  try {
    isLoading(cardContainer, loadingSpinner);
    countriesData = await fetchData(apiUrl);
    filterByRegion(countriesData, selectedRegion);
  } catch (error) {
    cardContainer.innerHTML = "";
    cardContainer.appendChild(handleFetchError(error));
  } finally {
    isLoading(cardContainer, loadingSpinner);
    cardContainer.classList.remove("d-none");
  }
}

handleData();

function filterByRegion(countriesData, selectedRegion) {
  var filteredData = countriesData.filter((country) => {
    if (selectedRegion === "No Filter") {
      return true;
    } else if (selectedRegion === "Favorite") {
      const favoriteCountries = Object.keys(localStorage).filter((key) => {
        return localStorage.getItem(key) === "true";
      });
      return favoriteCountries.includes(
        encodeURIComponent(country.name.common)
      );
    }
    return country.region === selectedRegion;
  });
  renderCards(filteredData);
}

function renderCards(filteredData) {
  cardContainer.innerHTML = "";
  filteredData.length === 0
    ? (cardContainer.innerHTML = `<h2 class="text-center">No result Found.</h2>`)
    : filteredData.forEach((country) => {
        const card = createCardElement(country);
        cardContainer.appendChild(card);
      });
}

function createCardElement(country) {
  const card = document.createElement("div");
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
          <i class="fa-regular fa-star star-icon"></i> 
        </div>
      </a>`;

  const starIcon = card.querySelector(".star-icon");
  let isFavorite = localStorage.getItem(countryName) === "true";
  updateStarIcon(starIcon, isFavorite);

  starIcon.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    isFavorite = !isFavorite;
    updateStarIcon(starIcon, isFavorite);
    isFavorite
      ? saveFavoriteStatus(country)
      : removeFavoriteStatus(countryName);
  });

  return card;
}

function updateStarIcon(starIcon, isFavorite) {
  starIcon.classList.toggle("fa-solid", isFavorite);
  starIcon.classList.toggle("fa-regular", !isFavorite);
}

function saveFavoriteStatus(country) {
  const countryName = encodeURIComponent(country.name.common);
  localStorage.setItem(countryName, true);

  const existingFavCountry = favList.querySelector(
    `li[data-country="${countryName}"]`
  );
  if (!existingFavCountry) {
    const favCountry = document.createElement("li");
    favCountry.setAttribute("data-country", countryName);

    const favCountryImgName = document.createElement("div");
    favCountryImgName.className = "fav-country-img-name";

    const img = document.createElement("img");
    img.src = country.flags ? country.flags.svg : "./assets/img/No_flag.svg";

    const span = document.createElement("span");
    span.textContent = country.name.common;

    favCountryImgName.appendChild(img);
    favCountryImgName.appendChild(span);
    favCountry.appendChild(favCountryImgName);

    const removeIcon = document.createElement("i");
    removeIcon.className = "fa-solid fa-circle-xmark";
    removeIcon.addEventListener("click", function () {
      removeFavoriteStatus(countryName);
    });
    favCountry.appendChild(removeIcon);

    favList.appendChild(favCountry);
  }
}

function removeFavoriteStatus(countryName) {
  localStorage.removeItem(countryName);
  const favCountry = favList.querySelector(`li[data-country="${countryName}"]`);
  if (favCountry) {
    favList.removeChild(favCountry);
  }
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
  filterByRegion(countriesData, selectedRegion);
  if (selectedRegion === "No Filter") {
    dropdownButton.innerText = "Filter by";
  } else {
    dropdownButton.innerText = selectedRegion;
  }
}
