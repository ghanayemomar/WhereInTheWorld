import { handleFetchError } from "../js/Api/ErrorHandler.js";
import { filterByRegion } from "./HomePageControllers/FilterCountries.js";
import { initializeFavoriteList } from "./HomePageControllers/FavCountryFunctions.js";
import fetchHomePageData from "./Api/ApiController.js";
import {
  clearCardContainer,
  appendChildToCardContainer,
  loading,
  loaded,
  renderCards,
} from "./HomePageControllers/HomePageView.js";

const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownButton = document.getElementById("dropdownButton");
const dropdownItems = dropdownMenu.querySelectorAll(".dropdown-item");
let selectedRegion = "No Filter";

export async function handleData(searchResult) {
  let countriesData = [];
  dropdownItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      selectedRegion = event.target.innerText;
      const filteredCountries = filterByRegion(countriesData, selectedRegion);
      renderCards(filteredCountries);
      if (selectedRegion === "No Filter") {
        dropdownButton.innerText = "Filter by";
      } else {
        dropdownButton.innerText = selectedRegion;
      }
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
