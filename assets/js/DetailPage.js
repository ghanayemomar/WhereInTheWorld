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

function toggleNoBorderCountries() {
  noBorder.classList.toggle("d-none");
}

function toggleContainerVisibility() {
  contentContainer.classList.toggle("d-none");
}

function toggleLoadingSpinner() {
  loadingSpinner.classList.toggle("d-none");
}

function toggleErrorMsg() {
  errorMsg.classList.toggle("d-none");
}

function handleFetchError(error) {
  if ((error.message = "Cannot read properties of undefined")) {
    errorMessage.textContent = "No Detail Found For This Country.";
  } else {
    errorMessage.textContent =
      "An error occurred while fetching data. Please try again later.";
  }
  toggleContainerVisibility();
  toggleErrorMsg();
  console.log(error);
}

async function fetchDetail() {
  try {
    toggleLoadingSpinner();
    const countryParam = params.get("country-name");
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${countryParam}?fields=name,population,region,subregion,tld,borders,currencies,capital,flags,languages`
    );
    const data = await response.json();
    const country = data[0];

    if (!country) {
      window.location.href = "/";
    }

    const flagSrc = country.flags
      ? country.flags.svg
      : "../assets/images/No_flag.svg";
    const languageNames = Object.values(data[0].languages).join(", ");
    const borders = Object.values(data[0].borders);
    borders.length === 0
      ? toggleNoBorderCountries()
      : borders.forEach((border) => {
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
    topLevelDomain.textContent = country.tld;
    currencies.textContent =
      country.currencies[Object.keys(country.currencies)[0]].name;
    languages.textContent = languageNames;
  } catch (error) {
    handleFetchError(error);
  } finally {
    toggleLoadingSpinner();
    toggleContainerVisibility();
  }
}

function init() {
  var link = document.getElementById("back");
  link.href = window.location.href.substring(
    0,
    window.location.href.indexOf("detail.html")
  );
  const urlCountryName = params.get("country-name");
  if (urlCountryName == null || urlCountryName === "") {
    window.location.href = link;
  }

  fetchDetail();
}
