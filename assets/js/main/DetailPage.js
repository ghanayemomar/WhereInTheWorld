import { params, cardContainer, backButton } from "../constants/Variables.js";
import { isLoading, handleFetchError } from "../helper/HelperFunctions.js";
import { renderDetails } from "../component/RenderDetails.js";
import { fetchDetail } from "../ApiFetch/DetailsFetch.js";

var urlCountryName;

backButton.href = window.location.href.substring(
  0,
  window.location.href.indexOf("detail.html")
);
urlCountryName = params.get("country-name");
if (urlCountryName == null || urlCountryName === "") {
  window.location.href = backButton.href;
}
fetchDetail(
  cardContainer,
  isLoading,
  handleFetchError,
  renderDetails,
  urlCountryName
);
