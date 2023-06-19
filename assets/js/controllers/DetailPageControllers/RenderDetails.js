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
