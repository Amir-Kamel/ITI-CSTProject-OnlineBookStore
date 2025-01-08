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
  const currentSession = JSON.parse(sessionStorage.getItem("currentSession"));

  if (currentSession && currentSession.session && currentSession.session.email) {
    const loggedInUserEmail = currentSession.session.email;

    // Get the signUpData object from localStorage
    const signUpData = JSON.parse(localStorage.getItem("signUpData")) || {};

    if (signUpData.customers && signUpData.customers[loggedInUserEmail]) {
      const customer = signUpData.customers[loggedInUserEmail];

      // Get the wishlist count
      const wishlistCount = customer.wishlist ? customer.wishlist.length : 0;

      // Update the badge count on all pages
      $("#heartBadge").text(wishlistCount);
    } else {
      // If the user is not found in signUpData, set badge count to 0
      $("#heartBadge").text(0);
    }
  } else {
    // If no user is logged in, set badge count to 0
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
