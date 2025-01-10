document.addEventListener("DOMContentLoaded", function () {
  async function loadContent(url, elementId) {
    try {
      const response = await fetch(url);
      const data = await response.text();
      document.getElementById(elementId).innerHTML = data;

      // Ensure the badge is updated after the navigation is loaded
      if (elementId === "mainNavigation") {
        // Call the functions defined in nav.js
        updateCartBadge();
        updateFavoritesBadge();
        setActiveLink();
        updateUserDropdown();
      }
    } catch (error) {
      console.error("Error loading content:", error);
    }
  }

  // Load navigation and footer, then initialize search functionality
  (async function () {
    await loadContent("nav.html", "mainNavigation");
    await loadContent("footer.html", "footer");
    // Initialize search functionality after navigation content is loaded
    $("#global-search").on("keydown", function (e) {
      // console.log("I am here");
      if (e.key === "Enter") {
        let allProducts = getProductsData();
        const searchTerm = $(this).val().toLowerCase();

        console.log(searchTerm);
        // console.log(allProducts);

        let filteredProducts = [];
        for (let productId in allProducts) {
          // console.log(productId);

          let product = allProducts[productId];

          // console.log(product);

          if (product.title.toLowerCase().includes(searchTerm)) {
            filteredProducts.push(productId);
          }
        }

        console.log(filteredProducts);

        // save filtered products in local storage
        localStorage.setItem("forSearch", JSON.stringify(filteredProducts));

        // Redirect to the search results page
        window.location.href = "./LoadMore.html";
      }
    });
  })();
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
setActiveLink = function () {
  const pathName = window?.location?.pathname?.toLowerCase();
  if (pathName.includes("home") && pathName) {
    document.getElementById("home-link")?.classList?.add("active");
  } else if (pathName.includes("about") && pathName) {
    document.getElementById("about-link")?.classList?.add("active");
  } else if (pathName.includes("contact") && pathName) {
    document.getElementById("contact-link")?.classList?.add("active");
  } else if (pathName.includes("service") && pathName) {
    document.getElementById("service-link").classList?.add("active");
  } else {
  }
};
