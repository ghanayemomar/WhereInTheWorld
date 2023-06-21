const params = new URLSearchParams(window.location.search);
const contentContainer = document.getElementById("contentContainer");
var backButton = document.getElementById("back");
var urlCountryName;
import { renderDetails } from "./DetailPageControllers/RenderDetails.js";
import {
  fetchDetailPage,
  fetchFullBordersName,
} from "../js/Api/ApiController.js";
import { isLoading } from "./Api/LoadingSpinner.js";
import { handleFetchError } from "./Api/ErrorHandler.js";
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
    isLoading(contentContainer, true);
    const detailData = await fetchDetailPage(urlCountryName);
    const country = detailData[0];

    let countryFullName = [];
    const borders = Object.values(country.borders).join(",");
    if (borders) {
      const bordersData = await fetchFullBordersName(borders);
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
    isLoading(contentContainer, false);
  }
}
