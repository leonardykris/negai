$(function() {
  $('#convert-form').on("change keyup keydown paste cut", "textarea", function() {
    $(this).height(0).height(this.scrollHeight);
  }).find('textarea').change();

  $('#edit-btn').click(function(event) {
    // Edit-btn should only be visible in view mode
    // Clicking means leaving view mode, going to edit mode

    // result should not be emptied yet if user decide to cancel
    $('#result').addClass("hide");

    $('#convert-form').removeClass("hide");

    // Manage buttons visibility
    $('#convert-btn').removeClass("hide");
    $('#edit-btn').addClass("hide");
  });
});