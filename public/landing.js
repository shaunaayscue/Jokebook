"use strict";
(function () {
  window.addEventListener("load", init);

  /** Initializes the app after the window loads. */
  function init() {
    let refreshButton = id("refresh-btn");
    if (refreshButton) {
      refreshButton.addEventListener("click", () => {
        console.log("Refresh button clicked!");

        fetch("/jokebook/random")
          .then((res) => res.json())
          .then((joke) => {
            const setupEl = id("setup");
            const deliveryEl = id("delivery");

            if (setupEl) {
              setupEl.textContent = joke.setup;
            }
            if (deliveryEl) {
              deliveryEl.textContent = joke.delivery;
            }
          })
          .catch((err) => {
            console.error("Error fetching joke:", err);
          });
      });
    }

    let newButton = id("new-joke-btn");
    newButton.addEventListener("click", function () {
      id("form-popup").style.display = "block";
    });

    let saveButton = id("save-game");
    saveButton.addEventListener("click", function (e) {
      e.preventDefault();
      submitForm();
    });

    let closeButton = id("cancel-btn");
    closeButton.addEventListener("click", function (e) {
      id("form-container").reset();
      id("form-popup").style.display = "none";
    });

    setupSearch();
    loadCategories();
  }

  /** Sets up the category search and category items. */
  function setupSearch() {
    let searchBtn = id("category-search-btn");
    searchBtn.addEventListener("click", () => {
      const input = id("category-input").value.trim();
      if (input !== "") {
        fetchAndDisplayJokes(input);
      }
    });

    const container = id("items-container");
    container.addEventListener("click", function (event) {
      const target = event.target.closest(".category-item");

      if (target) {
        const category = target.dataset.category;
        fetchAndDisplayJokes(category);
      }
    });
  }

  /**
 * Formats a category string to make it more readable.
 * @param {string} str - The category string to format.
 * @returns {string} The formatted category.
 */
  function formatCategoryTitle(str) {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
  }

  /**
   * Fetches jokes for a specific category and displays them.
   * @param {string} category - The category of jokes.
   */
  function fetchAndDisplayJokes(category) {
    const title = id("joke-category-name");
    title.textContent = formatCategoryTitle(category);
    title.style.display = "block";

    fetch("/jokebook/joke/" + encodeURIComponent(category))
      .then(function (res) {
        if (!res.ok) {
          throw new Error("Failed to fetch jokes");
        }
        return res.json();
      })
      .then(function (jokes) {
        const list = id("jokes-list");
        list.innerHTML = "";

        if (jokes.length === 0) {
          const li = document.createElement("li");
          li.textContent = "No jokes found for this category.";
          list.appendChild(li);
          return;
        }

        jokes.forEach(function (joke) {
          const li = document.createElement("li");
          const setupElement = document.createElement("strong");
          setupElement.textContent = joke.setup;
          li.appendChild(setupElement);
          li.appendChild(document.createElement("br"));
          li.appendChild(document.createTextNode(joke.delivery));
          list.appendChild(li);
        });
      })
      .catch(function (err) {
        console.error("Error loading jokes:", err);
      });
  }

  /** Gathers form data and sends a POST request to add a new joke. */
  function submitForm() {
    const form = document.querySelector("#form-container");
    const formData = new FormData(form);
    const formDataObj = Object.fromEntries(formData);
    const jsonBody = JSON.stringify(formDataObj);

    fetch("/jokebook/joke/add", {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: jsonBody
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        form.reset();
        document.querySelector("#form-popup").style.display = "none";

        const addedJokesContainer = id("added-jokes-container");
        addedJokesContainer.style.display = "block";

        const addedJokesList = id("added-jokes-list");
        addedJokesList.innerHTML = "";

        data.jokes.forEach(function (joke) {
          const li = document.createElement("li");
          li.textContent = joke.setup + " - " + joke.delivery;
          addedJokesList.appendChild(li);
        });
      })
      .catch(function (error) {
        console.error("Error adding joke:", error);
      });
  }

  /**
   * Shortcut for `document.getElementById`.
   * @param {string} str - The ID of the element to get.
   * @returns {HTMLElement} The DOM element.
   */
  function id(str) {
    return document.getElementById(str);
  }

  /** Loads all categories from the server and renders them into the DOM. */
  function loadCategories() {
    fetch("/jokebook/categories")
      .then((res) => res.json())
      .then((data) => {
        const list = id("category-list");
        list.innerHTML = "";

        data.forEach((category) => {
          const li = document.createElement("li");
          li.textContent = category;
          li.classList.add("category-item");
          li.dataset.category = category;
          list.appendChild(li);
        });
       
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
      });
  }
  
})();
