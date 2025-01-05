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
        }
      })
      .catch((error) => console.error("Error loading content:", error));
  }
  // Load navigation and footer
  loadContent("nav.html", "mainNavigation");
  loadContent("footer.html", "footer");
  //to get products from localstorage
  const products = JSON.parse(localStorage.getItem("products")) || {};
  // products table
  $(".productsTable").html("");
  for (let product of Object.values(products)) {
    $(".productsTable").append(`
               <tr>
                   <td>${product.title}</td>
                   <td><button class="btn btn-primary editProductBtn">Edit</button></td>
                   <td><button class="btn btn-danger deleteProductBtn">Delete</button></td>
               </tr>`);
  }
  // Load navigation and footer
  loadContent("nav.html", "mainNavigation");
  loadContent("footer.html", "footer");
});
