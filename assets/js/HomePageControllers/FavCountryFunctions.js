const favList = document.getElementById("favList");
const favouritescontainer = document.querySelector(".favourites-container");

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

function favListMainFunction(starIcon, country, countryName) {
  let isFavorite = localStorage.getItem(countryName);
  updateStarIcon(starIcon, isFavorite);
  let selected = {
    name: country.name.common,
    img: country.flags.svg,
  };
  starIcon.addEventListener("click", (event) => {
    event.preventDefault();
    starIcon.className === "fa-star star-icon fa-regular"
      ? (updateStarIcon(starIcon, countryName), saveFavoriteStatus(selected))
      : removeFavoriteStatus(countryName);
  });
}

export function saveFavoriteStatus(country) {
  const countryName = encodeURIComponent(country.name);
  const countryData = {
    name: country.name,
    img: country.img,
  };
  localStorage.setItem(countryName, JSON.stringify(countryData));
  renderFavoriteCountry(countryName, countryData);
}

export function renderFavoriteCountry(countryName, countryData) {
  const favCountry = document.createElement("li");
  favCountry.setAttribute("data-country", countryName);

  const favCountryImgName = document.createElement("div");
  favCountryImgName.className = "fav-country-img-name";

  const img = document.createElement("img");
  img.src = countryData.img;

  const span = document.createElement("span");
  span.textContent = countryData.name;

  favCountryImgName.appendChild(img);
  favCountryImgName.appendChild(span);
  favCountry.appendChild(favCountryImgName);

  const removeIcon = document.createElement("i");
  removeIcon.className = "fa-solid fa-circle-xmark";
  removeIcon.addEventListener("click", () => {
    removeFavoriteStatus(countryName);
  });
  favCountry.appendChild(removeIcon);

  favList.appendChild(favCountry);
}

export function removeFavoriteStatus(countryName) {
  localStorage.removeItem(countryName);
  const favCountry = favList.querySelector(`li[data-country="${countryName}"]`);
  if (favCountry) {
    favList.removeChild(favCountry);
    const card = cardContainer.querySelector(
      `a[href="detail.html?country-name=${countryName}"]`
    );
    if (card) {
      const cardStarIcon = card.querySelector(".star-icon");
      updateStarIcon(cardStarIcon, false);
    }
  }
}

export function updateStarIcon(starIcon, isFavorite) {
  starIcon.classList.toggle("fa-solid", isFavorite);
  starIcon.classList.toggle("fa-regular", !isFavorite);
}

export function initializeFavoriteList() {
  const favoriteCountries = Object.keys(localStorage).filter(
    (key) => key !== "isDarkMode"
  );
  favoriteCountries.forEach((countryName) => {
    const countryData = JSON.parse(localStorage.getItem(countryName));
    renderFavoriteCountry(countryName, countryData);
  });
}

export function getCountryFromCardElement(cardElement) {
  const countryName = decodeURIComponent(
    cardElement.querySelector(".card-title").textContent
  );
  const countryImg = cardElement.querySelector(".card-img-top").src;
  const icon = cardElement.querySelector(".fa-star");
  return {
    name: countryName,
    img: countryImg,
    icon: icon,
  };
}

favouritescontainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  favouritescontainer.classList.add("highlight");
});
favouritescontainer.addEventListener("dragleave", (e) => {
  e.preventDefault();
  favouritescontainer.classList.remove("highlight");
});

favouritescontainer.addEventListener("drop", (e) => {
  e.preventDefault();
  favouritescontainer.classList.remove("highlight");
  const draggable = document.querySelector(".dragging");
  const country = getCountryFromCardElement(draggable);
  country.icon.className === "fa-star star-icon fa-regular"
    ? (updateStarIcon(country.icon, true), saveFavoriteStatus(country))
    : "";
});
