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
  $("#formcontact").on("submit", function (event) {
    event.preventDefault(); // prevent the default not to refresh the page to show the message toast after submit

    let isValid = true;

    const nameinput = $("#name").val().trim();
    const emailinput = $("#email").val().trim();
    const subjectinput = $("#subject").val().trim();
    const messageinput = $("#message").val().trim();

    // Validate name
    if (!/^[a-zA-Z\s]{3,}$/.test(nameinput)) {
      isValid = false;
      $("#errorname").removeClass("d-none");
    } else {
      $("#errorname").addClass("d-none");
    }

    // Validate email address
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/.test(emailinput)) {
      isValid = false;
      $("#erroremail").removeClass("d-none");
    } else {
      $("#erroremail").addClass("d-none");
    }

    // If all validations pass
    if (isValid) {
      // Save data to local storage
      localStorage.setItem("Contact Name Data", JSON.stringify(nameinput));
      localStorage.setItem("Contact Email Data", JSON.stringify(emailinput));
      localStorage.setItem("Contact Subject Data", JSON.stringify(subjectinput));
      localStorage.setItem("Contact Message Data", JSON.stringify(messageinput));
      // show message toast
      $(".toast").toast("show");

      //clear the form
      $("#formcontact")[0].reset();
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
    document.getElementById("home-link").classList?.add("active");
  }
};
