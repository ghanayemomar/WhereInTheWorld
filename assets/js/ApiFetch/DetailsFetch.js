export async function fetchDetail(
  cardContainer,
  isLoading,
  handleFetchError,
  renderDetails,
  urlCountryName
) {
  try {
    isLoading();
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${urlCountryName}?fields=name,population,region,subregion,tld,borders,currencies,capital,flags,languages`
    );
    if (!response.ok) {
      throw new Error();
    }
    const detailData = await response.json();
    const country = detailData[0];

    let countryFullName = [];
    const borders = Object.values(country.borders).join(",");
    if (borders) {
      const bordersResponse = await fetch(
        `https://restcountries.com/v3.1/alpha?codes=${borders}`
      );
      const bordersData = await bordersResponse.json();
      countryFullName = bordersData.map((country) => country.name.common);
    }
    if (!country) {
      window.location.href = backButton.href;
      return;
    }
    renderDetails(country, countryFullName);
  } catch (error) {
    console.log(error);
    handleFetchError(error);
  } finally {
    isLoading();
    cardContainer.classList.remove("d-none");
  }
}
