document.addEventListener("DOMContentLoaded", function () {
  function loadContent(url, elementId) {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        document.getElementById(elementId).innerHTML = data;
        if (elementId === "mainNavigation") {
          updateCartBadge();
        }
      })
      .catch((error) => console.error("Error loading content:", error));
  }

  // Load navigation and footer
  loadContent("nav.html", "mainNavigation");
  loadContent("footer.html", "footer");
});

$(document).ready(function () {
  // Function to validate email
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Function to validate username (no numbers allowed)
  function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z\s]+$/;
    return usernameRegex.test(username);
  }

  // Function to validate title (not null or empty)
  function validateTitle(title) {
    return title && title.trim() !== "";
  }

  // Function to get products from local storage
  function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || {};
  }

  // Function to save products to local storage
  function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  // Function to get users from local storage
  function getUsers() {
    return JSON.parse(localStorage.getItem("signUpData")) || usersData;
  }

  // Function to save users to local storage
  function saveUsers(users) {
    localStorage.setItem("signUpData", JSON.stringify(users));
  }

  // Function to update counts (products, users, orders)
  function updateCounts() {
    const products = getProducts();
    const users = getUsers();

    // Update product count
    const productCount = Object.keys(products).length;
    $(".productCount").text(productCount);

    // Update user count
    const userCount =
      (users.admin ? Object.keys(users.admin).length : 0) +
      (users.customers ? Object.keys(users.customers).length : 0) +
      (users.sellers ? Object.keys(users.sellers).length : 0);
    $(".usersCount").text(userCount);

    // Update order count
    const orders = JSON.parse(localStorage.getItem("orders")) || {};
    const orderCount = Object.keys(orders).length;
    $(".ordersCount").text(orderCount);
  }

  // Function to render the products table
  function renderProductsTable() {
    const products = getProducts();
    $(".productsTable").html(""); // Clear the table
    $.each(products, function (id, product) {
      $(".productsTable").append(`
          <tr data-id="${id}">
            <td>${product.title}</td>
            <td><img src="${product.img_src}" alt="${product.title}" style="width: 100px; height: auto;"></td>
            <td><button class="btn btn-primary editProductBtn">Edit</button></td>
            <td><button class="btn btn-danger deleteProductBtn">Delete</button></td>
          </tr>
        `);
    });

    // Update counts after rendering the products table
    updateCounts();
  }

  // Function to render the users table
  function renderUsersTable() {
    const users = getUsers();
    const admins = users.admin ? Object.keys(users.admin).length : 0;
    const customers = users.customers ? Object.keys(users.customers).length : 0;
    const sellers = users.sellers ? Object.keys(users.sellers).length : 0;

    // Update admin, customer, and seller counts
    $(".admins").text(admins);
    $(".members").text(customers);
    $(".sellers").text(sellers);

    // Clear the table
    $(".usersTable").html("");

    // Render admins
    if (users.admin) {
      $.each(users.admin, function (email, user) {
        $(".usersTable").append(`
            <tr data-email="${email}" data-role="admin">
              <td><input type="text" class="form-control username-input" value="${
                user.username
              }"></td>
              <td><input type="email" class="form-control email-input" value="${email}" disabled></td>
              <td>
                <select class="form-control" disabled>
                  <option value="admin" selected>Admin</option>
                </select>
              </td>
              <td>
                <select class="form-control account-status">
                  <option value="Active" ${
                    user.accountstate === "Active" ? "selected" : ""
                  }>Active</option>
                  <option value="Suspended" ${
                    user.accountstate === "Suspended" ? "selected" : ""
                  }>Suspended</option>
                </select>
              </td>
              <td><button class="btn btn-primary updateUserBtn">Update</button></td>
              <td><button class="btn btn-danger deleteUserBtn" disabled>Delete</button></td>
            </tr>
          `);
      });
    }

    // Render customers
    if (users.customers) {
      $.each(users.customers, function (email, user) {
        $(".usersTable").append(`
            <tr data-email="${email}" data-role="customer">
              <td><input type="text" class="form-control username-input" value="${
                user.username
              }"></td>
              <td><input type="email" class="form-control email-input" value="${email}"></td>
              <td>
                <select class="form-control">
                  <option value="customer" ${
                    user.role === "customer" ? "selected" : ""
                  }>Customer</option>
                  <option value="seller" ${
                    user.role === "seller" ? "selected" : ""
                  }>Seller</option>
                </select>
              </td>
              <td>
                <select class="form-control account-status">
                  <option value="Active" ${
                    user.accountstate === "Active" ? "selected" : ""
                  }>Active</option>
                  <option value="Suspended" ${
                    user.accountstate === "Suspended" ? "selected" : ""
                  }>Suspended</option>
                </select>
              </td>
              <td><button class="btn btn-primary updateUserBtn">Update</button></td>
              <td><button class="btn btn-danger deleteUserBtn">Delete</button></td>
            </tr>
          `);
      });
    }

    // Render sellers
    if (users.sellers) {
      $.each(users.sellers, function (email, user) {
        $(".usersTable").append(`
            <tr data-email="${email}" data-role="seller">
              <td><input type="text" class="form-control username-input" value="${
                user.username
              }"></td>
              <td><input type="email" class="form-control email-input" value="${email}"></td>
              <td>
                <select class="form-control">
                  <option value="customer" ${
                    user.role === "customer" ? "selected" : ""
                  }>Customer</option>
                  <option value="seller" ${
                    user.role === "seller" ? "selected" : ""
                  }>Seller</option>
                </select>
              </td>
              <td>
                <select class="form-control account-status">
                  <option value="Active" ${
                    user.accountstate === "Active" ? "selected" : ""
                  }>Active</option>
                  <option value="Suspended" ${
                    user.accountstate === "Suspended" ? "selected" : ""
                  }>Suspended</option>
                </select>
              </td>
              <td><button class="btn btn-primary updateUserBtn">Update</button></td>
              <td><button class="btn btn-danger deleteUserBtn">Delete</button></td>
            </tr>
          `);
      });
    }

    // Update counts after rendering the users table
    updateCounts();
  }

  // Render the products and users tables on page load
  renderProductsTable();
  renderUsersTable();

  // Add Product Button Click Event
  $("#addBtn").on("click", function () {
    // Get form values
    const title = $("#producttitleInput").val();
    const sellerEmail = $("#sellerEmailInput").val();

    // Validate title
    if (!validateTitle(title)) {
      Toast.fire({
        icon: "error",
        title: "Title cannot be empty!",
      });
      return;
    }

    // Validate seller email
    if (!validateEmail(sellerEmail)) {
      Toast.fire({
        icon: "error",
        title: "Invalid seller email!",
      });
      return;
    }

    // Get the image file
    const imageFile = $("#imageUploadInput").prop("files")[0];

    // Validate required fields
    if (
      !$("#producttitleInput").val() ||
      !$("#productPriceInput").val() ||
      !$("#productStockInput").val() ||
      !$("#productCategoryInput").val() ||
      !$("#productDescInput").val() ||
      !$("#sellerEmailInput").val() ||
      !imageFile
    ) {
      Toast.fire({
        icon: "error",
        title: "Please fill in all required fields and upload an image.",
      });
      return;
    }

    // Convert the image file to a Base64-encoded string
    const reader = new FileReader();
    reader.onload = function (event) {
      const product = {
        id: Date.now(), // Unique ID for the product
        title: $("#producttitleInput").val(),
        price: parseFloat($("#productPriceInput").val()), // Convert to number
        stock: parseInt($("#productStockInput").val()), // Convert to number
        category: $("#productCategoryInput").val(),
        description: $("#productDescInput").val(),
        seller_email: $("#sellerEmailInput").val(),
        img_src: event.target.result, // Base64-encoded image
        sold: 0,
        Availability: true,
      };

      // Get existing products from local storage
      const products = getProducts();

      // Add the new product to the products object
      products[product.id] = product;

      // Save the updated products object to local storage
      saveProducts(products);

      // Render the updated products table
      renderProductsTable();

      // Clear the form fields and reset the modal
      resetModal();

      // Close the modal (optional)
      $("#addProductModal").modal("hide");

      // Show success message
      Toast.fire({
        icon: "success",
        title: "Product added successfully!",
        showCloseButton: true,
      }).then(() => {
        // Redirect to the dashboard after the success message
        window.location.href = "dash.html"; // Replace with your dashboard URL
      });
    };

    // Read the image file as a Base64-encoded string
    reader.readAsDataURL(imageFile);
  });

  // Edit Product Button Click Event
  $(document).on("click", ".editProductBtn", function () {
    const productId = $(this).closest("tr").data("id"); // Get the product ID from the table row
    const products = getProducts();
    const product = products[productId];

    // Populate the modal fields with the product data
    $("#producttitleInput").val(product.title);
    $("#productPriceInput").val(product.price);
    $("#productStockInput").val(product.stock);
    $("#productCategoryInput").val(product.category);
    $("#productDescInput").val(product.description);
    $("#sellerEmailInput").val(product.seller_email);

    // Set the product ID in a hidden field or data attribute for reference
    $("#addProductModal").data("edit-id", productId);

    // Change the modal title and button text
    $("#addProductModalLabel").text("Edit Product");
    $("#addBtn").hide();
    $("#updateProductBtn").show();

    // Open the modal
    $("#addProductModal").modal("show");
  });

  // Update Product Button Click Event
  $("#updateProductBtn").on("click", function () {
    const productId = $("#addProductModal").data("edit-id"); // Get the product ID from the modal
    const products = getProducts();
    const product = products[productId];

    // Update the product details
    product.title = $("#producttitleInput").val();
    product.price = parseFloat($("#productPriceInput").val());
    product.stock = parseInt($("#productStockInput").val());
    product.category = $("#productCategoryInput").val();
    product.description = $("#productDescInput").val();
    product.seller_email = $("#sellerEmailInput").val();

    // Handle image update if a new image is uploaded
    const imageFile = $("#imageUploadInput").prop("files")[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (event) {
        product.img_src = event.target.result; // Update the image source
        saveProducts(products); // Save the updated products
        renderProductsTable(); // Re-render the table
        $("#addProductModal").modal("hide"); // Close the modal
        resetModal(); // Clear the form and reset the modal
      };
      reader.readAsDataURL(imageFile);
    } else {
      saveProducts(products); // Save the updated products
      renderProductsTable(); // Re-render the table
      $("#addProductModal").modal("hide"); // Close the modal
      resetModal(); // Clear the form and reset the modal
    }

    // Show success message
    Toast.fire({
      icon: "success",
      title: "Product updated successfully!",
    });
  });

  // Delete Product Button Click Event
  $(document).on("click", ".deleteProductBtn", function () {
    const productId = $(this).closest("tr").data("id"); // Get the product ID from the table row
    const products = getProducts();

    // Confirm deletion
    if (confirm("Are you sure you want to delete this product?")) {
      delete products[productId]; // Delete the product
      saveProducts(products); // Save the updated products
      renderProductsTable(); // Re-render the table

      // Show success message
      Toast.fire({
        icon: "success",
        title: "Product deleted successfully!",
      });
    }
  });

  // Update User Button Click Event
  $(document).on("click", ".updateUserBtn", function () {
    const $row = $(this).closest("tr");
    const username = $row.find(".username-input").val();
    const email = $row.find(".email-input").val();

    // Validate username
    if (!validateUsername(username)) {
      Toast.fire({
        icon: "error",
        title: "Username cannot contain numbers!",
      });
      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      Toast.fire({
        icon: "error",
        title: "Invalid email!",
      });
      return;
    }

    const oldEmail = $row.data("email"); // Get the old email
    const role = $row.data("role");
    const users = getUsers();

    // Get updated values
    const userRole =
      role === "admin" ? "admin" : $row.find("td:eq(2) select").val(); // Admin role cannot be changed
    const accountState = $row.find("td:eq(3) select").val(); // Get the selected account status

    // If the user is being updated to admin, demote the existing admin (if any)
    if (userRole === "admin" && role !== "admin") {
      const existingAdminEmail = Object.keys(users.admin)[0];
      if (existingAdminEmail) {
        const existingAdmin = users.admin[existingAdminEmail];
        delete users.admin[existingAdminEmail];
        existingAdmin.role = "customer"; // Demote to customer
        users.customers[existingAdminEmail] = existingAdmin;
      }
    }

    // Update user data
    if (role === "admin") {
      const user = users.admin[oldEmail];
      user.username = username; // Only update the username for admin
      user.accountstate = accountState; // Update account status
      users.admin[oldEmail] = user;
    } else if (role === "customer") {
      const user = users.customers[oldEmail];
      delete users.customers[oldEmail]; // Remove the old email entry
      user.username = username;
      user.email = email;
      user.role = userRole;
      user.accountstate = accountState; // Update account status
      users[
        userRole === "admin"
          ? "admin"
          : userRole === "customer"
          ? "customers"
          : "sellers"
      ][email] = user; // Add the new email entry to the correct role
    } else if (role === "seller") {
      const user = users.sellers[oldEmail];
      delete users.sellers[oldEmail]; // Remove the old email entry
      user.username = username;
      user.email = email;
      user.role = userRole;
      user.accountstate = accountState; // Update account status
      users[
        userRole === "admin"
          ? "admin"
          : userRole === "customer"
          ? "customers"
          : "sellers"
      ][email] = user; // Add the new email entry to the correct role
    }

    // Save the updated users object to local storage
    saveUsers(users);

    // Update the data-email and data-role attributes of the row
    $row.attr("data-email", email);
    $row.attr("data-role", userRole);

    // Re-render the users table
    renderUsersTable();

    // Show success message
    Toast.fire({
      icon: "success",
      title: "User updated successfully!",
    });
  });

  // Delete User Button Click Event
  $(document).on("click", ".deleteUserBtn", function () {
    const email = $(this).closest("tr").data("email");
    const role = $(this).closest("tr").data("role");
    const users = getUsers();

    // Prevent deletion of admin
    if (role === "admin") {
      Toast.fire({
        icon: "error",
        title: "Admin cannot be deleted!",
      });
      return;
    }

    // Confirm deletion for non-admin users
    if (confirm("Are you sure you want to delete this user?")) {
      if (role === "customer") {
        delete users.customers[email];
      } else if (role === "seller") {
        delete users.sellers[email];
      }

      // Save the updated users object to local storage
      saveUsers(users);

      // Re-render the users table
      renderUsersTable();

      // Show success message
      Toast.fire({
        icon: "success",
        title: "User deleted successfully!",
      });
    }
  });
});
