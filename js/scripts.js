//==========================
// Author: Mark Bradley (github.com/bradsec)
//==========================

const JSON_DATA_FILE = "json/data.json";
const IMAGES_PATH = "img/";
const MIN_SEARCH_LENGTH = 2;
const SEARCH_BAR = document.getElementById("sercxilo");
const DATA_OUTPUT_DIV = document.getElementById("resultat");
const LOAD_MORE_BUTTON = document.getElementsByClassName("load-more");
const TOTAL_RECORD_COUNT = document.getElementById("total-record-count");
const SEARCH_RESULT_COUNT = document.getElementById("search-result-count");
const LOAD_TIME_ID = document.getElementById("load-time");
const SALE_RESULT_COUNT = document.getElementById("sale-count");
const DEBUG_DIV = document.getElementById("debug");

// Sort JSON results by specified property
function sortJsonByProperty(property) {
  return function (a, b) {
    if (a[property] > b[property]) return 1;
    else if (a[property] < b[property]) return -1;
    return 0;
  };
}

// Input format YYYYMMDD 20210118 and output result: MONTH DAY YYYY Jan 18 2021
function formatDate(dateInput) {
  let datePattern = /(\d{4})(\d{2})(\d{2})/;
  let dateNew = new Date(
    dateInput.replace(datePattern, "$1-$2-$3"));
  dateNew = dateNew.toString().substring(4, 15);
  return dateNew;
}

// Reset fields and hide components
function resetDefaults() {
  RESULT_COUNTERS_ID.style.display = "none";
  SEARCH_BAR.value = "";
  DATA_OUTPUT_DIV.innerHTML = "";
  LOAD_MORE_ID.style.display = "none";
  LOAD_TIME_ID.style.display = "none";
  BUTTON_TOP_ID.style.display = "none";
  DEBUG_DIV.style.display = "none";
  SEARCH_BAR.focus();
}

SEARCH_BAR.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    SEARCH_BAR.blur();
  }
});

SEARCH_BAR.addEventListener("keyup", e => {
  let searchString = e.target.value;
  let timerStart = performance.now();
  fetch(JSON_DATA_FILE)
    .then(res => res.json())
    .then(function (data) {

      searchString = searchString.trim();
      searchString = searchString.replace(/[|&;$%@"<>()\.//\\+,]/g, "");
      let regExString = "";
      var displayCount = 6;
      const incrementCount = 6;
      let resultCount = 0;
      let saleCount = 0;
      let resultDataOutput = "";
      let runtimeOutput = "";

      if (resultCount !== 0 || searchString.length > MIN_SEARCH_LENGTH) {
        let keywords = searchString.split(" ");
        keywords.forEach(function (keyword) {
          keyword = keyword.trim();
          regExString += `(?=.*${keyword})`;
        });
        let regex = new RegExp(regExString, "gi");
        data.forEach(function (val, key) {
          if (
            val.titol.search(regex) != -1 ||
            val.descripcio.search(regex) != -1
          ) {
            resultCount += 1;

            //aquí va el codi com es mostren els resultats. Les variables són del tipus ${val.[nom_clau]}
            resultDataOutput += `

          <div class="videoelement">
                  <a href="https://www.youtube.com/watch?v=${val.videoid}" target="_blank"><img src="${IMAGES_PATH}${val.portada}" class="miniatura"></a>
                <p><strong>${val.titol}</strong></p>
                <p>${val.descripcio}</p>
        </div>
        `;
          }
        });
      }

      DATA_OUTPUT_DIV.innerHTML = resultDataOutput;
      SEARCH_RESULT_COUNT.innerHTML = resultCount;
      SALE_RESULT_COUNT.innerHTML = saleCount;
      var productList = document.querySelectorAll(".product-item");



      let timerStop = performance.now();
      if (resultCount !== 0 && searchString.length > MIN_SEARCH_LENGTH) {
        let runTime = (timerStop - timerStart).toFixed(2);
        runtimeOutput = `${runTime} ms`;
      }
      LOAD_TIME_ID.style.display = "block";
      LOAD_TIME_ID.innerHTML = runtimeOutput;
    })
    .catch(function (error) {
      console.log("There was an error with the JSON data file request.", error);
    });
});

// Do a total object record count on JSON data file
document.addEventListener("DOMContentLoaded", function () {
  fetch(JSON_DATA_FILE)
    .then(res => res.json())
    .then(function (data) {
      let objCount = Object.keys(data).length;
      let totalOutput = "";
      if (objCount) {
        totalOutput = `${objCount}`;
      }
      TOTAL_RECORD_COUNT.innerHTML = totalOutput;
    })
    .catch(function (error) {
      console.log("There was an error with the JSON data file request.", error);
    });
});

// Replace missing product images with placeholder to preserve card layout.
document.addEventListener("error", function (event) {
  if (event.target.tagName.toLowerCase() !== "img") return;
  let altText = event.target.alt.toLowerCase();
  let altTextKeywords = "Product Image";
  if (altText.includes(altTextKeywords.toLowerCase())) {
    event.target.src = `${IMAGES_PATH}placeholder/product.jpg`;
    event.target.alt = "Image not found.";
  }
},
  true
);
