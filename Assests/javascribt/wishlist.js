document.addEventListener("DOMContentLoaded", function () {
  function loadContent(url, elementId) {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        document.getElementById(elementId).innerHTML = data;
        // Ensure the badge is updated after the navigation is loaded
        if (elementId === "mainNavigation") {
          // Call the updateCartBadge function defined in nav.js
          updateCartBadge();
          updateFavoritesBadge()
        }
      })
      .catch((error) => console.error("Error loading content:", error));
  }

  // Load navigation and footer
  loadContent("nav.html", "mainNavigation");
  loadContent("footer.html", "footer");
});

$(document).ready(function () {
  // Function to get favorites from localStorage
  function getData() {
    const favdata = localStorage.getItem("favorites");
    return JSON.parse(favdata) || [];
  }

  // Initial load of favorites
  const allfavorite = getData();

  // Function to display favorites
  function displayfav(favorites) {
    const favcontainer = $("#fav-conatainer");

    // Add fadeOut animation
    favcontainer.fadeOut(300, function () {
      favcontainer.empty(); // Clear the container

      // Function to update the favorites badge count
      function updateFavoritesBadge() {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const badge = $("#heartBadge"); // Make sure the ID matches your HTML
        badge.text(favorites.length); // Update the badge count
      }

      updateFavoritesBadge(); // Initialize the badge count on page load

      if (favorites.length === 0) {
        // If favorites are empty, display the empty message
        favcontainer.html(
          "<h3 class='text-center text-muted'>Oops! Seems that your favorites list is empty.<br> Why not head back to the store and discover some amazing products to add?</h3>"
        );
        favcontainer.fadeIn(300);
        return; // Stop further execution
      }

      // Otherwise, display the book cards
      favorites.forEach((favproduct) => {
        const BookCard = $(`
            <div class="col-lg-3 col-md-6 col-sm-12 p-4">
              <div class="card h-100 w-100" data-id="${favproduct.title}">
              <div class="img-container">
                <img src="${favproduct.img_src}" alt="${favproduct.title}" class="card-img-top imgmain"/>
                <div class="overlay"></div>
              </div>
              <div class="card-body">
                <h5 class="card-title">${favproduct.title}</h5>
                <p class="card-text">${favproduct.description}</p>
                <p class="card-text price" style="color: green; font-weight: bold;">Price: ${favproduct.price}</p>
                <button class="btn btn-success placeholder-wave btn-sm mb-2 add-to-cart">
                    <i class="fas fa-cart-plus me-2"></i> Add To Cart
                </button>
                <button class="btn btn-danger btn-sm remove-fav">
                    <i class="fas fa-trash-alt me-2"></i> Remove From Favorites
                </button>
              </div>
            </div>
          </div>
          `);

        // Handle the "Remove from Favorites" button click
        BookCard.find(".remove-fav").on("click", function () {
          // Remove product from favorites
          const updatedFavorites = favorites.filter(
            (item) => item.title !== favproduct.title
          );

          // Save updated favorites to localStorage
          localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

          // Refresh the display
          displayfav(updatedFavorites); // Update the display
        });

        favcontainer.append(BookCard); // Add the book card to the container
      });

      favcontainer.fadeIn(300); // Add fadeIn animation
    });
  }

  displayfav(allfavorite);
});
