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
          updateFavoritesBadge();
          setActiveLink();
          updateUserDropdown();
        }
      })
      .catch((error) => console.error("Error loading content:", error));
  }

  // Load navigation and footer
  loadContent("nav.html", "mainNavigation");
  loadContent("footer.html", "footer");
});

$(document).ready(function () {
  // Retrieve the selected product ID from localStorage
  const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));


  // Retrieve all products from localStorage
  const products = JSON.parse(localStorage.getItem("products"));


  // Find the selected product using its ID
  const productId = selectedProduct;
  const product = products?.[productId]; // Access the product using its ID


  // Display the product details on the page
  if (product) {
    $("#main-image").attr("src", product.img_src);
    $("#product-title").text(product.title);
    $("#product-category").text(product.category);
    $("#product-availability").text(product.stock > 0 ? "In stock" : "Out of stock");
    $("#product-price").text("Price: " + product.price);
    $("#product-description").text(product.description);
  } else {
    alert("No product data found. Please go back and select a product.");
  }

  // Update the cart badge when the page loads
  updateCartBadge();

  $(document).on("click", ".addtocart", function () {
    const quantity = parseInt($(".quantity-input").val(), 10);
    for (let i = 0; i < quantity; i++) {
      addToCart(productId);
    }
  });

  $(document).on("click", ".addtofav", function () {
    const loggedInUser = getLoggedInUserEmail();
    if (loggedInUser) {
      // const loggedInUserEmail = currentSession.session.email;
      const usersData = getUsersData();
      // console.log(usersData);
      // console.log(usersData.customers[loggedInUser.email]);
      const customer = usersData.customers[loggedInUser.email];
      // console.log(customer);
      const wishlist = customer.wishlist; // Fetch the wishlist from the customer data
  
      const productIndex = wishlist.findIndex((id) => id === productId);
  
      if (productIndex === -1) {
        // Add the product to the wishlist
        customer.wishlist.push(productId);
        Toast.fire({
          icon: "success",
          title: "Item added to wishlist successfully.",
        });
      } else {
        // Remove the product from the wishlist
        customer.wishlist.splice(productIndex, 1);
        Toast.fire({
          icon: "warning",
          title: "Item removed from wishlist successfully.",
        });
      }
  
      // Save updated data to localStorage
      localStorage.setItem("signUpData", JSON.stringify(usersData));
      updateFavoritesBadge();
    }
  });

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
