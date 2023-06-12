export function renderCards(filteredData) {
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

export function renderDetails(country, countryFullName) {
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
