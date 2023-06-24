import { isLoading } from "../Api/LoadingSpinner.js";
import {} from "./SearchHandler.js";
import { favListMainFunction } from "./FavCountryFunctions.js";
const cardContainer = document.getElementById("cardContainer");

export function clearCardContainer() {
  cardContainer.innerHTML = "";
}
export function appendChildToCardContainer(child) {
  cardContainer.appendChild(child);
}
export function noResultFound() {
  cardContainer.innerHTML = `<h2 class="text-center">No result Found.</h2>`;
}

export function loading() {
  isLoading(cardContainer, true);
}
export function loaded() {
  isLoading(cardContainer, false);
}

export function renderCards(filteredData) {
  clearCardContainer();
  filteredData.length === 0
    ? noResultFound()
    : filteredData.forEach((country) => {
        const card = createCardElement(country);
        appendChildToCardContainer(card);
      });
}

export function createCardElement(country) {
  const card = document.createElement("div");

  card.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", "");
    event.dataTransfer.setDragImage(card.querySelector(".card-img-top"), 0, 0);
    card.classList.add("dragging");
  });
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });

  card.setAttribute("draggable", "true");
  card.className = "card-container col-12 col-md-6 col-lg-6 col-xxl-4";

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
          <i class="fa-star star-icon"></i> 
        </div>
      </a>`;

  const starIcon = card.querySelector(".star-icon");
  favListMainFunction(starIcon, country, countryName);
  return card;
}
