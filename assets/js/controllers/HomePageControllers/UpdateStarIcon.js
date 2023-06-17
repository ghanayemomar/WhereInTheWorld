export function updateStarIcon(starIcon, isFavorite) {
    starIcon.classList.toggle("fa-solid", isFavorite);
    starIcon.classList.toggle("fa-regular", !isFavorite);
  }
  