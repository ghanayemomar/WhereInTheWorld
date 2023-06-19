export function isLoading(cardContainer, loadingSpinner, loading) {
  var updatedCardContainer;
  var updatedLoadingSpinner;

  loading
    ? ((updatedLoadingSpinner = loadingSpinner.classList.toggle("d-none")),
      (updatedCardContainer = cardContainer.classList.add("d-none")))
    : ((updatedCardContainer = cardContainer.classList.remove("d-none")),
      (updatedLoadingSpinner = loadingSpinner.classList.toggle("d-none")));

  return {
    cardContainer: updatedCardContainer,
    loadingSpinner: updatedLoadingSpinner,
  };
}
