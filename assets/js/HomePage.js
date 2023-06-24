import { handleFetchError } from "../js/Api/ErrorHandler.js";
import {
  filterByRegion,
  filterDropDownHandler,
} from "./HomePageControllers/FilterCountries.js";
import { initializeFavoriteList } from "./HomePageControllers/FavCountryFunctions.js";
import fetchHomePageData from "./Api/ApiController.js";
import {
  clearCardContainer,
  appendChildToCardContainer,
  loading,
  loaded,
  renderCards,
} from "./HomePageControllers/HomePageView.js";

let selectedRegion = "No Filter";

export async function handleData(searchResult) {
  let countriesData = [];

  filterDropDownHandler((newSelectedRegion) => {
    selectedRegion = newSelectedRegion;
    var filteredCountries = filterByRegion(countriesData, selectedRegion);
    renderCards(filteredCountries);
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
