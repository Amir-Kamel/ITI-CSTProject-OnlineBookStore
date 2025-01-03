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
});
