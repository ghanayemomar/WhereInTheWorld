const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownButton = document.getElementById("dropdownButton");
const dropdownItems = dropdownMenu.querySelectorAll(".dropdown-item");

export function filterDropDownHandler(callback) {
  let selectedRegion = "No Filter";
  dropdownItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      selectedRegion = event.target.innerText;
      if (selectedRegion === "No Filter") {
        dropdownButton.innerText = "Filter by";
      } else {
        dropdownButton.innerText = selectedRegion;
      }
      callback(selectedRegion);
    });
  });
}

export function filterByRegion(countriesData, selectedRegion) {
  var filteredData = countriesData.filter((country) => {
    if (selectedRegion === "No Filter") {
      return true;
    } else if (selectedRegion === "Favorite") {
      const favoriteCountries = Object.keys(localStorage);
      return favoriteCountries.includes(
        encodeURIComponent(country.name.common)
      );
    }
    return country.region === selectedRegion;
  });
  return filteredData;
}
