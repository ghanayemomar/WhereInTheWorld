export function isLoading() {
  cardContainer.classList.add("d-none");
  loadingSpinner.classList.toggle("d-none");
}

export function handleFetchError(error) {
  cardContainer.innerHTML = "";
  var errorMessage;
  if (error.message === "No Data Found.") {
    errorMessage = "No result Found, Please Enter Valid Country Name.";
  } else if (error.message === "Failed to fetch") {
    errorMessage =
      "An error occurred while fetching data. Please try again later.";
  } else {
    errorMessage = "No Data Found.";
  }

  const errorCard = document.createElement("div");
  errorCard.innerHTML = `
    <div class="alert h2 text-center" role="alert">
      ${errorMessage}
    </div>`;
  cardContainer.appendChild(errorCard);
}
