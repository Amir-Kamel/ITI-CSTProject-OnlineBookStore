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
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/.test(emailinput)
    ) {
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
      localStorage.setItem(
        "Contact Subject Data",
        JSON.stringify(subjectinput)
      );
      localStorage.setItem(
        "Contact Message Data",
        JSON.stringify(messageinput)
      );
      // show message toast
      $(".toast").toast("show");

      //clear the form
      $("#formcontact")[0].reset();
    }
  });
});
