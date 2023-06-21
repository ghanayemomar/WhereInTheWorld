function handleSearch(event) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const searchResult = event.target.value.trim();
      !searchResult ? handleData() : handleData(searchResult);
    }, 500);
  }