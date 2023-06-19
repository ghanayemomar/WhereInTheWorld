const favList = document.getElementById("favList");
const favouritescontainer = document.querySelector(".favourites-container");

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
