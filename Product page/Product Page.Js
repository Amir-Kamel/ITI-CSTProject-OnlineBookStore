$(document).ready(function () {
    // Change main image on thumbnail click
    $(".product-images img").on("click", function () {
      $("#main-image").attr("src", $(this).attr("src"));
      $(".product-images img").removeClass("active");
      $(this).addClass("active");
    });
  });