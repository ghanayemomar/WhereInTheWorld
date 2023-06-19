const params = new URLSearchParams(window.location.search);
const contentContainer = document.getElementById("contentContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
var backButton = document.getElementById("back");
var urlCountryName;
import { renderDetails } from "./controllers/DetailPageControllers/RenderDetails.js";
import { fetchData } from "./controllers/FetchModule.js";
import { handleFetchError } from "./controllers/ErrorHandler.js";
import { isLoading } from "./controllers/LoadingSpinner.js";

backButton.href = window.location.href.substring(
  0,
  window.location.href.indexOf("detail.html")
);
urlCountryName = params.get("country-name");
if (urlCountryName == null || urlCountryName === "") {
  window.location.href = backButton.href;
}

fetchDetail();

async function fetchDetail() {
  try {
    isLoading(contentContainer, loadingSpinner, true);
    const detailData = await fetchData(
      `https://restcountries.com/v3.1/name/${urlCountryName}?fields=name,population,region,subregion,tld,borders,currencies,capital,flags,languages`
    );
    const country = detailData[0];

    let countryFullName = [];
    const borders = Object.values(country.borders).join(",");
    if (borders) {
      const bordersData = await fetchData(
        `https://restcountries.com/v3.1/alpha?codes=${borders}`
      );
      countryFullName = bordersData.map((country) => country.name.common);
    }
    if (!country) {
      window.location.href = backButton.href;
      return;
    }
    renderDetails(country, countryFullName);
  } catch (error) {
    contentContainer.innerHTML = ``;
    console.log(error);
    contentContainer.appendChild(handleFetchError(error));
  } finally {
    isLoading(contentContainer, loadingSpinner, false);
  }
}
