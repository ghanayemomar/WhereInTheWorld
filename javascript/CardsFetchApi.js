const cardContainer = document.querySelector("#cardContainer");
const loadingSpinner = document.querySelector("#loadingSpinner");
const dropdownMenu = document.querySelector(".dropdown-menu");

function toggleLoadingSpinner() {
  loadingSpinner.classList.toggle("d-none");
}
function toggleCardContainer() {
  cardContainer.classList.toggle("d-none");
}

function renderCards(data) {
  data.forEach((country) => {
    const card = document.createElement("div");
    card.classList.add(
      "card-container",
      "col-12",
      "col-md-6",
      "col-lg-4",
      "col-xxl-3"
    );
    const flagSrc = country.flags
      ? country.flags.svg
      : "../assets/images/No_flag.svg";
    const countryName = encodeURIComponent(country.name.common);
    card.innerHTML = `
          <a class="card" href="/detail.html?country-name=${countryName}">
            <img src="${flagSrc}" class="card-img-top" alt="${
      country.name.common
    }">
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
          </a>
        `;
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

async function fetchData() {
  try {
    toggleLoadingSpinner();
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags"
    );
    const data = await response.json();
    renderCards(data);
  } catch (error) {
    handleFetchError(error);
  } finally {
    toggleLoadingSpinner();
    toggleCardContainer();
  }
}
fetchData();
