const cardContainer = document.getElementById("cardContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownButton = document.getElementById("dropdownButton");
const dropdownItems = dropdownMenu.querySelectorAll(".dropdown-item");
const searchInput = document.getElementById("input");

let countriesData = [];

const baseURL =
  "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags";

let selectedRegion = "No Filter";
let searchTimer;

function isLoading() {
  loadingSpinner.classList.toggle("d-none");
}

async function fetchData(url = baseURL) {
  try {
    isLoading();
    const response = await fetch(url);
    if (!response.ok) {
      countriesData=[];
      throw new Error("No Data Found");
    }
    countriesData = await response.json();
    filterByRegion();
  } catch (error) {
    handleFetchError(error);
  } finally {
    isLoading();
    cardContainer.classList.remove("d-none");
  }
}

function filterByRegion() {
  filterData = countriesData.filter((country) => {
    if (selectedRegion !== "No Filter") {
      return country.region === selectedRegion;
    }
    return true;
  });
  return renderCards(filterData);
}

function renderCards(filterData) {
  cardContainer.innerHTML = "";
  filterData.forEach((country) => {
    const card = document.createElement("div");
    card.className = "card-container col-12 col-md-6 col-lg-4 col-xxl-3";
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
    </div>
  </a>`;
    cardContainer.appendChild(card);
  });
}

function handleFetchError(error) {
  cardContainer.innerHTML = "";
  var errorMessage;
  if (error.message === "No Data Found") {
    errorMessage = "No Countries Found, Please Enter Valid Country Name.";
  } else {
    errorMessage =
      "An error occurred while fetching data. Please try again later.";
  }

  const errorCard = document.createElement("div");
  errorCard.innerHTML = `
    <div class="alert alert-danger h2 text-center" role="alert">
      ${errorMessage}
    </div>`;
  cardContainer.appendChild(errorCard);
  console.log(error);
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

function init() {
  fetchData();
  searchInput.addEventListener("keyup", handleSearch); //registration event lisner
  dropdownItems.forEach((item) => {
    item.addEventListener("click", handleRegionFilter);
  });
}
