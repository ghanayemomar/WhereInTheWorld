import { fetchData } from "./FetchModule.js";

const baseUrl =
  "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags";

export async function fetchHomePageData(searchResult) {
  let url = baseUrl;
  if (searchResult) {
    url = `https://restcountries.com/v3.1/name/${searchResult}?fields=name,population,region,capital,flags`;
  }
  const data = await fetchData(url);
  return data;
}

export async function fetchDetailPage(urlCountryName) {
  let url = `https://restcountries.com/v3.1/name/${urlCountryName}?fields=name,population,region,subregion,tld,borders,currencies,capital,flags,languages`;
  const data = await fetchData(url);
  return data;
}
export async function fetchFullBordersName(borders) {
  let url = `https://restcountries.com/v3.1/alpha?codes=${borders}`;
  const data = await fetchData(url);
  return data;
}
export default fetchHomePageData;
