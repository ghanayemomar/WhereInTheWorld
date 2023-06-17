// export function filterByRegion(countriesData, selectedRegion) {
//   var filteredData = countriesData.filter((country) => {
//     if (selectedRegion === "No Filter") {
//       return true;
//     } else if (selectedRegion === "Favorite") {
//       const favoriteCountries = Object.keys(localStorage).filter((key) => {
//         return localStorage.getItem(key) === "true";
//       });
//       return favoriteCountries.includes(
//         encodeURIComponent(country.name.common)
//       );
//     }
//     return country.region === selectedRegion;
//   });
//   return filteredData;
// }
