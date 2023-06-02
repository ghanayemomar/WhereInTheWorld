const cardContainer = document.getElementById("cardContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownButton = document.getElementById("dropdownButton");
const dropdownItems = dropdownMenu.querySelectorAll(".dropdown-item");
const searchInput = document.getElementById("input");
let data = [];
const base ="https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags"
let selectedRegion = "No Filter"

function toggleLoadingSpinner() {
  loadingSpinner.classList.toggle("d-none");
}

function toggleCardContainer() {
  cardContainer.classList.toggle("d-none");
}


async function fetchData(url=base) {
  try {
    toggleLoadingSpinner();
    const response = await fetch(url);
    data = await response.json();
    filterData_w()
  } catch (error) {
    handleFetchError(error);
  } finally {
    toggleLoadingSpinner();
  }
}

toggleCardContainer();

function filterData_w (){
  filter = data.filter((country) => {
    if (selectedRegion !== "No Filter") {
      return country.region === selectedRegion;
    }
    return true;
  });
  return renderCards(filter)
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
          <span class="value">${country.population.toLocaleString()}</span>
        </li>
        <li>
          <span class="label">Region:</span>
          <span class="value">${country.region}</span>
        </li>
        <li>
          <span class="label">Capital:</span>
          <span class="value">${country.capital}</span>
        </li>
      </ul>
    </div>
  </a>`;

    cardContainer.appendChild(card);
  });
}

function handleFetchError(error) {
  const errorMessage =
    "An error occurred while fetching data. Please try again later.";

  const errorCard = document.createElement("div");
  errorCard.innerHTML = `
    <div class="alert alert-danger h2 text-center" role="alert">
      ${errorMessage}
    </div>`;
  cardContainer.appendChild(errorCard);
  console.log(error);
}

let countryName = "";
searchInput.addEventListener("keyup", handleSearch);
let searchTimer;

function handleSearch(event) {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const searchQuery = event.target.value.trim();

    searchQuery === "" || null
      ? fetchData()
      : ((countryName = searchQuery), fetchData(base.replace("all",`name/${countryName.toLowerCase()}`)));
  }, 500);
}





function handleRegionFilter(event) {
  selectedRegion = event.target.innerText;
  filterData_w();

  if (selectedRegion === "No Filter") {
    dropdownButton.innerText = "Filter by region";
  } else {
    dropdownButton.innerText = selectedRegion;
  }
}

dropdownItems.forEach((item) => {
  item.addEventListener("click", handleRegionFilter);
});

fetchData();
