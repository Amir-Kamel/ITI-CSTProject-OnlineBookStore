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
  function getProductData() {
    const storedProduct = localStorage.getItem("selectedProduct");
    return storedProduct ? JSON.parse(storedProduct) : null;
  }

  const product = getProductData();

  if (product) {
    $("#main-image").attr("src", product.img_src);
    $("#product-title").text(product.title);
    $("#product-category").text(product.category);
    $("#product-availability").text("In stock");
    $("#product-price").text("Price: " + product.price);
    $("#product-description").text(product.description);
  } else {
    // Handle case where no product data is found
    alert("No product data found. Please go back and select a product.");
  }
  // Update the cart badge when the page loads
  updateCartBadge();
});
const counterValue = document.getElementById('counter-value');
        const decreaseButton = document.getElementById('decrease');
        const increaseButton = document.getElementById('increase');

        let count = 0;

        increaseButton.addEventListener('click', () => {
            count++;
            updateCounter();
        });

        decreaseButton.addEventListener('click', () => {
            if (count > 0) {
                count--;
                updateCounter();
            }
        });

        function updateCounter() {
            counterValue.value = count;
            decreaseButton.disabled = count === 0;
        }

        updateCounter(); // Initialize the counter
    

$(document).ready(function () {
  // get stored photo from Local Storage
  const selectedImage = localStorage.getItem("img_src");
  if (selectedImage) {
      $("#product-image").attr("src", selectedImage);
  } else {
      alert("No image selected!");
  }
});
