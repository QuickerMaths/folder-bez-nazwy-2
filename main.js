window.addEventListener("load", () => {
  fetchAPI().catch((error) => console.log(error));
});
// Fetch API

async function fetchAPI() {
  const response = await fetch("data.json");
  const countryArray = await response.json();

  console.log(countryArray);

  // Append all country containers

  for (i = 0; i < countryArray.length; i++) {
    const countryObject = countryArray[i];

    const country = createCountryContainer(
      countryObject.flags.svg,
      countryObject.name,
      countryObject.population,
      countryObject.region,
      countryObject.capital
    );

    document.getElementById("container").innerHTML += country;
  }

  // Set all parameters for country detail

  function openDetail(countryArray, containerName) {
    const detailContainer = document.getElementById("detailContainer");

    for (i = 0; i < countryArray.length; i++) {
      const countryObject = countryArray[i];
      if (containerName.id === countryObject.name) {
        detailContainer.innerHTML = createDetailContainer(
          countryObject.flags.svg,
          countryObject.name,
          countryObject.nativeName,
          countryObject.population,
          countryObject.region,
          countryObject.subregion,
          countryObject.capital,
          countryObject.topLevelDomain,
          countryObject.currencies[0].name,
          countryObject.languages[0].name
        );

        // Create border countries

        let borderLength = countryObject.borders;
        const borderList = document.getElementById("borderList");

        if (countryObject.borders !== undefined) {
          for (j = 0; j < borderLength.length; j++) {
            const borderCountry = document.createElement("li");
            borderCountry.classList.add(
              "country-detail__border-countries-item"
            );
            let borderName = changeBorderNames(countryObject.borders[j]);
            borderCountry.innerHTML = borderName;

            // Set id to target it in openDetail func, to change detailContainer on click

            borderCountry.setAttribute("id", borderName);

            borderList.appendChild(borderCountry);

            // Change detailContainer using openDetail func by clicking on borderCountries button

            borderCountry.addEventListener("click", (e) => {
              const borderCountry = e.currentTarget;

              openDetail(countryArray, borderCountry);
            });
          }
        } else {
          // append for countries with no borderCountries

          const borderCountry = document.createElement("li");
          borderCountry.classList.add("country-detail__border-countries-item");
          borderCountry.innerHTML = "None";
          borderList.appendChild(borderCountry);
        }
      }
    }

    // Change border names form alpha3Code to country name

    function changeBorderNames(borderObject) {
      for (i = 0; i < countryArray.length; i++) {
        const countryObject = countryArray[i];
        if (countryObject.alpha3Code === borderObject) {
          borderObject = countryArray[i].name;
          return borderObject;
        }
      }
    }

    // Back button on click

    document.getElementById("backButton").addEventListener("click", () => {
      document.getElementById("detailContainer").classList.toggle("hidden");
    });
  }

  // Show country detail on click

  document
    .querySelectorAll(".main-section__country-container")
    .forEach((element) => {
      element.addEventListener("click", (e) => {
        // Target clicked country;

        const containerName = e.currentTarget;

        // show clicked country in detailCountry and toggle it

        openDetail(countryArray, containerName);
        document.getElementById("detailContainer").classList.toggle("hidden");
      });
    });
}

// Search input

document.getElementById("input").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  document
    .querySelectorAll(".main-section__country-container")
    .forEach((country) => {
      // Give hidden class, to elements which doesn't include value form input

      const isVisible = country.id.toLowerCase().includes(value);
      country.classList.toggle("search-hidden", !isVisible);
    });
});

// Filter

document.querySelectorAll(".main-section__item").forEach((element) => {
  element.addEventListener("click", (e) => {
    const regionId = e.currentTarget.innerHTML;

    document.querySelectorAll("#region").forEach((region) => {
      // If region of countryContainer doesn't mach to region clicked on filter,
      // give those countryContainers hidden class

      const isVisible = region.innerHTML === regionId ? true : false;
      region.parentElement.parentElement.parentElement.classList.toggle(
        "search-hidden",
        !isVisible
      );
    });

    // toggle class to open and close filter button

    document.getElementById("filtersContainer").classList.toggle("active");
  });
});

// Filter rewind on click

document.getElementById("filter").addEventListener("click", () => {
  document.getElementById("filtersContainer").classList.toggle("active");
});

// Theme switch animation

document.getElementById("modeContainer").addEventListener("click", () => {
  document.querySelectorAll(".header__mode").forEach((el) => {
    el.classList.toggle("mode-active");
  });
});

// Dark mode handler

document.getElementById("darkMode").addEventListener("click", () => {
  document.body.classList.remove("light-mode");
  document.body.classList.add("dark-mode");
});

// Light mode handler

document.getElementById("lightMode").addEventListener("click", () => {
  document.body.classList.remove("dark-mode");
  document.body.classList.add("light-mode");
});

// Create country container

function createCountryContainer(img, countryName, population, region, capital) {
  // Id of the container is set to countryName
  // which allows to target by id, and set specify parameters for detail section

  return `
          <div class="main-section__country-container" id="${countryName}">
            <img
              class="main-section__country-flag"
              id="countryFlag"
              src="${img}"
              alt="flag ${countryName}"
            />
            <div class="main-section__content-container">
              <h2 class="main-section__country" id="countryName">${countryName}</h2>
              <p class="main-section__population" id="countryPopulation">
                Population: <span class="main-section__span">${population}</span>
              </p>
              <p class="main-section__region" id="countryRegion">
                Region: <span class="main-section__span" id="region">${region}</span>
              </p>
              <p class="main-section__capital" id="countryCapital">
                Capital: <span class="main-section__span">${capital}</span>
              </p>
            </div>
          </div>
  `;
}

// Create detail container

function createDetailContainer(
  detailImg,
  detailName,
  detailNativeName,
  detailPopulation,
  detailRegion,
  detailSubRegion,
  detailCapital,
  detailDomain,
  detailCurrencies,
  detailLanguages
) {
  return `
  <div class="country-detail__container">
  <button class="country-detail__button-back" id="backButton">
    <svg
      class="country-detail__arrow-svg"
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M5.854 4.646a.5.5 0 010 .708L3.207 8l2.647 2.646a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0z"
        clip-rule="evenodd"
      ></path>
      <path
        fill-rule="evenodd"
        d="M2.5 8a.5.5 0 01.5-.5h10.5a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"
        clip-rule="evenodd"
      ></path>
    </svg>
    Back
  </button>
  <div class="country-detail__main-container">
    <img
      src="${detailImg}"
      alt="flag"
      class="country-detail__img"
      id="detailFlag"
    />
    <div class="country-detail__content-container">
      <h2 class="country-detail__name" id="detailName">${detailName}</h2>
      <div class="country-detail__content">
        <ul class="country-detail__main-content">
          <li class="country-detail__item">
            Native Name:
            <span class="country-detail__span" id="detailNativeName">${detailNativeName}</span>
          </li>
          <li class="country-detail__item">
            Population:
            <span id="detailPopulation" class="country-detail__span">${detailPopulation}</span>
          </li>
          <li class="country-detail__item">
            Region:
            <span id="detailRegion" class="country-detail__span">${detailRegion}</span>
          </li>
          <li class="country-detail__item">
            Sub Region:
            <span id="detailSubRegion" class="country-detail__span">${detailSubRegion}</span>
          </li>
          <li class="country-detail__item">
            Capital:
            <span id="detailCapital" class="country-detail__span">${detailCapital}</span>
          </li>
        </ul>
        <ul class="country-detail__side-content">
          <li class="country-detail__item">
            Top Level Domain:
            <span id="detailDomain" class="country-detail__span">${detailDomain}</span>
          </li>
          <li class="country-detail__item">
            Currencies:
            <span id="detailCurrencies" class="country-detail__span">${detailCurrencies}</span>
          </li>
          <li class="country-detail__item">
            Languages:
            <span id="detailLanguages" class="country-detail__span">${detailLanguages}</span>
          </li>
        </ul>
        </div>
        <div class="country-detail__border-countries">
          <h3 class="country-detail__border-countries-title">
            Border Countries:
          </h3>
          <ul class="country-detail__border-countries-list" id="borderList">
          </ul>
        </div>
    </div>
  </div>
</div>
  `;
}
