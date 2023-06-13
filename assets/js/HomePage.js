const cardContainer = document.getElementById("cardContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownButton = document.getElementById("dropdownButton");
const dropdownItems = dropdownMenu.querySelectorAll(".dropdown-item");
const searchInput = document.getElementById("input");
let searchTimer;
let selectedRegion = "No Filter";

function isLoading() {
  cardContainer.classList.add("d-none");
  loadingSpinner.classList.toggle("d-none");
}

fetchData();

async function fetchData(
  url = "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags"
) {
  let countriesData = [];

  dropdownItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      handleRegionFilter(event, countriesData);
    });
  });

  searchInput.addEventListener("keyup", handleSearch);

  try {
    isLoading();
    const response = await fetch(url);
    if (!response.ok) {
      countriesData = [];
      throw new Error("No Data Found");
    }
    countriesData = await response.json();
    filterByRegion(countriesData, selectedRegion);
  } catch (error) {
    console.log(error);
    handleFetchError(error);
  } finally {
    isLoading();
    cardContainer.classList.remove("d-none");
  }
}

function filterByRegion(countriesData, selectedRegion) {
  var filteredData = countriesData.filter((country) => {
    if (selectedRegion !== "No Filter") {
      return country.region === selectedRegion;
    }
    return true;
  });
  return renderCards(filteredData);
}

function renderCards(filteredData) {
  cardContainer.innerHTML = "";
  filteredData.length === 0
    ? (cardContainer.innerHTML = `<h2 class="text-center">No result Found.</h2>`)
    : filteredData.forEach((country) => {
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

function handleSearch(event) {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const searchResult = event.target.value.trim();
    !searchResult
      ? fetchData()
      : fetchData(
          `https://restcountries.com/v3.1/name/${searchResult}?fields=name,population,region,capital,flags`
        );
  }, 500);
}

function handleRegionFilter(event, countriesData) {
  selectedRegion = event.target.innerText;
  // Save the selected region to localStorage
  localStorage.setItem("selectedRegion", selectedRegion);
  filterByRegion(countriesData, selectedRegion);
  if (selectedRegion === "No Filter") {
    dropdownButton.innerText = "Filter by region";
  } else {
    dropdownButton.innerText = selectedRegion;
  }
}

function handleFetchError(error) {
  cardContainer.innerHTML = "";
  var errorMessage;
  if (error.message === "No Data Found") {
    errorMessage = "No result Found, Please Enter Valid Country Name.";
  } else {
    errorMessage =
      "An error occurred while fetching data. Please try again later.";
  }

  const errorCard = document.createElement("div");
  errorCard.innerHTML = `
    <div class="alert h2 text-center" role="alert">
      ${errorMessage}
    </div>`;
  cardContainer.appendChild(errorCard);
}
