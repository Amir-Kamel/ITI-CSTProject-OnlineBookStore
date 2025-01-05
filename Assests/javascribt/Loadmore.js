$(function () {
  $("#slider-range").slider({
    range: true,
    min: 0,
    max: 500,
    values: [75, 300],
    slide: function (event, ui) {
      $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);

      // Dynamically set the range background color
      const min = ui.values[0];
      const max = ui.values[1];
      const totalRange = $("#slider-range").slider("option", "max");
      const leftPercentage = (min / totalRange) * 100;
      const rightPercentage = (max / totalRange) * 100;

      // Update range background color
      $("#slider-range .ui-slider-range").css({
        left: leftPercentage + "%",
        width: rightPercentage - leftPercentage + "%",
        "background-color": "#810b0b", // Highlight color
      });

      // Update outer sides to white
      $("#slider-range").css({
        background: `linear-gradient(to right, white ${leftPercentage}%, #810b0b ${leftPercentage}%, #810b0b ${rightPercentage}%, white ${rightPercentage}%)`,
      });
    },
  });

  // Set initial range background color
  const min = $("#slider-range").slider("values", 0);
  const max = $("#slider-range").slider("values", 1);
  const totalRange = $("#slider-range").slider("option", "max");
  const leftPercentage = (min / totalRange) * 100;
  const rightPercentage = (max / totalRange) * 100;

  // Initial background update
  $("#slider-range").css({
    background: `linear-gradient(to right, white ${leftPercentage}%, #810b0b ${leftPercentage}%, #810b0b ${rightPercentage}%, white ${rightPercentage}%)`,
  });

  $("#amount").val(
    "$" +
      $("#slider-range").slider("values", 0) +
      " - $" +
      $("#slider-range").slider("values", 1)
  );
});
