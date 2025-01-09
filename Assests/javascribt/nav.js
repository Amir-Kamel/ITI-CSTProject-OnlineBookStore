// Function to retrieve current session email from sessionStorage
function getLoggedInUserEmail() {
  const currentSession = JSON.parse(sessionStorage.getItem("currentSession"));
  return currentSession?.session?.email;
}

// Function to update the cart badge based on the items in local storage
function updateCartBadge() {
  const loggedInUserEmail = getLoggedInUserEmail();
  if (loggedInUserEmail) {
    const cartKey = `${loggedInUserEmail}_cart`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    $("#cartBadge").text(cart.length);
  } else {
    $("#cartBadge").text(0);
  }
}

function updateFavoritesBadge() {
  const loggedInUserEmail = getLoggedInUserEmail();
  if (loggedInUserEmail) {
    const favKey = `${loggedInUserEmail}_fav`;
    let wishlist = JSON.parse(localStorage.getItem(favKey)) || [];
    $("#heartBadge").text(wishlist.length);
  } else {
    $("#heartBadge").text(0);
  }
}

// Sign-in function
function signInUser(email) {
  const sessionData = {
    session: {
      email: email,
    },
  };
  sessionStorage.setItem("currentSession", JSON.stringify(sessionData));
  updateCartBadge(); // Update the cart badge after sign-in
}

// Sign-out function
function signOutUser() {
  sessionStorage.removeItem("currentSession");
  updateCartBadge(); // Update the cart badge after sign-out
}

// Ensure the updateCartBadge function is called when the navigation loads
document.addEventListener("DOMContentLoaded", function () {
  updateCartBadge();
});
function updateUserDropdown() {
  const checkUserDropdown = setInterval(function () {
    const userDropdownMenu = document.getElementById("userDropdownMenu");

    if (userDropdownMenu) {
      clearInterval(checkUserDropdown); // Stop checking once it's found

      const userSession = sessionStorage.getItem("currentSession"); // Check session dynamically
      userDropdownMenu.innerHTML = ""; // Clear the current menu

      if (userSession) {
        // User is logged in
        userDropdownMenu.innerHTML = `
          <li><a class="dropdown-item" href="./profile.html">Your Account</a></li>
          <li><a class="dropdown-item" id="logoutBtn" href="#">Logout</a></li>
        `;

        // Add logout functionality
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
          logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("currentSession");
            Toast.fire({
              icon: "success",
              title: "Logged out successfully.",
            });
            window.location.href = "./Login&Register.html"; // Redirect to the login page
          });
        }
      } else {
        // User is not logged in
        userDropdownMenu.innerHTML = `
          <li><a class="dropdown-item" href="./Login&Register.html">Sign in | SignUp</a></li>
        `;
      }
    }
  }, 100); // Check every 100ms
}

// Function to highlight the active link in the navbarfunction setActiveLink() {
document.addEventListener("DOMContentLoaded", function () {
  const currentUrl = window.location.pathname; // Get the current page URL
  const navLinks = document.querySelectorAll(".nav-link"); // Select all links

  navLinks.forEach((link) => {
    // Check if the link's href matches the current URL
    if (link.getAttribute("href") === currentUrl) {
      link.classList.add("active"); // Add the 'active' class to the matching link
    } else {
      link.classList.remove("active"); // Remove 'active' from others
    }
  });
});

// Call the updateUserDropdown function once the page loads
window.onload = function () {
  updateUserDropdown();
  setActiveLink();
};

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
