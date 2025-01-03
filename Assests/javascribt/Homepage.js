// Importing Products Data
import { products } from "./productsdata.js";

// Using jQuery to set data and interact with DOM
$(document).ready(function () {
  function setData() {
    // console.log("Setting products data to localStorage:", products);
    localStorage.setItem("products", JSON.stringify(products));
  }

  function getData() {
    const storedData = localStorage.getItem("products");
    // console.log("Retrieved data from localStorage:", storedData);
    return JSON.parse(storedData);
  }
  //if the product null
  if (!localStorage.getItem("products")) {
    setData();
  }

  let allProducts = getData();
  //   console.log("All products after retrieval:", allProducts);

  //   if (!allProducts || typeof allProducts !== "object") {
  //     allProducts = {}; // Handle the case when there is no valid data
  //   }

  function displayProducts(products, category = "All") {
    // if (!products || typeof products !== "object") {
    //   return;
    // }

    // console.log("Displaying products for category:", category);

    const container = $("#books-Container");

    // Add fadeOut animation
    container.fadeOut(300, function () {
      container.empty();

      const filteredProducts =
        category === "All"
          ? products // if the tab is all show the all products
          : Object.fromEntries(
              //else convert object to array then filter
              Object.entries(products).filter(
                ([key, product]) => product.category === category
              )
            );

      //   console.log("Filtered products:", filteredProducts);
      let obj = Object.keys(filteredProducts);
      //   console.log(obj);
      obj.forEach((key) => {
        const product = filteredProducts[key];
        console.log(product);
        const BookCard = $(`
            <div class="col-lg-3 col-md-6 col-sm-12 p-4">
              <div class="card h-100 w-100" data-id="${product.title}">
                <div class="img-container">
                  <img src="${product.img_src}" alt="${product.title}" class="card-img-top imgmain"/>
                  <div class="overlay">
                    <button class="btn btn-outline-secondary btn-sm add-to-cart">
                      <i class="fas fa-cart-plus mr-2"></i>
                    </button>
                    <button class="btn btn-outline-secondary btn-sm">
                      <i class="far fa-heart"></i>
                    </button>
                  </div>
                </div>
                <div class="card-body">
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text">${product.description}</p>
                  <p class="card-text price" style="color: green; font-weight: bold;">Price: ${product.price}</p>
                </div>
              </div>
            </div>
          `);
        BookCard.on("click", function () {
          localStorage.setItem("selectedProduct", JSON.stringify(product));
          window.location.href = "product-page.html";
        });
        container.append(BookCard);
      });

      // Add fadeIn animation
      container.fadeIn(300);
    });
  }

  displayProducts(allProducts);

  $("#tabs .nav-link").click(function (e) {
    e.preventDefault();
    $("#tabs .nav-link").removeClass("active text-primary");
    $(this).addClass("active text-primary");
    const category = $(this).data("category");

    // console.log("Tab clicked, category:", category);
    displayProducts(allProducts, category);
  });
});
