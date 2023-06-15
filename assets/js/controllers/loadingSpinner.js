export function isLoading(cardContainer, loadingSpinner) {
    const updatedCardContainer = cardContainer.classList.add("d-none");
    const updatedLoadingSpinner = loadingSpinner.classList.toggle("d-none");
  
    return {
      cardContainer: updatedCardContainer,
      loadingSpinner: updatedLoadingSpinner,
    };
  }