const params = new URLSearchParams(window.location.search);
const flag = document.getElementById("flag");
const countryName = document.getElementById("countryName");
const nativeName = document.getElementById("nativeName");
const population = document.getElementById("population");
const region = document.getElementById("region");
const subRegion = document.getElementById("subRegion");
const capital = document.getElementById("capital");
const topLevelDomain = document.getElementById("topLevelDomain");
const currencies = document.getElementById("currencies");
const languages = document.getElementById("languages");
const borderContainer = document.getElementById("borderContainer");
const noBorder = document.getElementById("noBorder");
const contentContainer = document.getElementById("contentContainer");
const errorMessage = document.getElementById("errorMessage");
const root = document.getElementById("root");
const loadingSpinner = document.getElementById("loadingSpinner");
var backButton = document.getElementById("back");
var urlCountryName;
function toggleContainerVisibility() {
  contentContainer.classList.toggle("d-none");
}

function toggleLoadingSpinner() {
  loadingSpinner.classList.toggle("d-none");
}

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
    toggleLoadingSpinner();
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${urlCountryName}?fields=name,population,region,subregion,tld,borders,currencies,capital,flags,languages`
    );
    if (!response.ok) {
      throw new Error();
    }
    const detailData = await response.json();
    const country = detailData[0];

    let countryFullName = [];
    const borders = Object.values(country.borders).join(",");
    if (borders) {
      const bordersResponse = await fetch(
        `https://restcountries.com/v3.1/alpha?codes=${borders}`
      );
      const bordersData = await bordersResponse.json();
      countryFullName = bordersData.map((country) => country.name.common);
    }
    if (!country) {
      window.location.href = backButton.href;
      return;
    }
    renderDetails(country, countryFullName);
  } catch (error) {
    console.log(error);
    handleFetchError(error);
  } finally {
    toggleLoadingSpinner();
    toggleContainerVisibility();
  }
}

function renderDetails(country, countryFullName) {
  const flagSrc = country.flags
    ? country.flags.svg
    : "../assets/images/No_flag.svg";
  const languageNames = Object.values(country.languages).join(", ");
  countryFullName.length === 0
    ? (borderContainer.innerHTML = `<div class="text">No Border For This Country.</div>`)
    : countryFullName.forEach((border) => {
        const borderCode = document.createElement("span");
        borderCode.classList.add("text");
        borderCode.textContent = border;
        borderContainer.appendChild(borderCode);
      });

  flag.setAttribute("src", flagSrc);
  countryName.textContent = country.name.common;
  nativeName.textContent =
    country.name.nativeName[Object.keys(country.name.nativeName)[0]].official;
  population.textContent = country.population.toLocaleString();
  subRegion.textContent = country.subregion;
  capital.textContent = country.capital;
  region.textContent = country.region;
  topLevelDomain.textContent = country.tld.join(", ");
  currencies.textContent =
    country.currencies[Object.keys(country.currencies)[0]].name;
  languages.textContent = languageNames;
}

function handleFetchError(error) {
  contentContainer.innerHTML = ``;
  var errorMessage;
  if (error.message === "Failed to fetch") {
    errorMessage =
      "An error occurred while fetching data. Please try again later.";
  } else {
    errorMessage = "No data found for this country.";
  }
  const errorCard = document.createElement("div");
  errorCard.innerHTML = `
    <div class="alert h2 text-center" role="alert">
      ${errorMessage}
    </div>`;
  contentContainer.appendChild(errorCard);
}
