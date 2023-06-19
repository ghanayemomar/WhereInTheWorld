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
