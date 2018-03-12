var Manage = function () {
  var self = this;

  self.initialize = function () {
    bindHandlers();
  };

  // private

  var bindHandlers = function () {
    $(document).on("click", ".cancel-address", cancelAddress);
    $(document).on("click", ".save-address", saveAddress);
    $(document).on("click", ".undo-address", undoAddress);

    $(document).on("click", ".undo-unsubscribe", undoUnsubscribe);
  };

  var changeAddress = function (element) {
    $('#change-email').removeClass("js-hidden");
  };

  var saveAddress = function (element) {
    $(".error").text("");

    if ($(".address").val().indexOf("@") === -1) {
      $(".error").text("Please enter a valid email address.");
      $(".address").select();
      return;
    }

    $(".address").prop("disabled", true);
    $(".save-address").replaceWith(addressSavedElement);
    $(".cancel-address").hide();

    saveInSession($(".address").val());
  };

  var addressChanged = function (element) {
    if ($(".change-address").length !== 0) {
      self.changeAddress = $(".change-address").replaceWith(saveAddressElement);
    }
  };

  var cancelAddress = function (event) {
    $(".address").val("");
    $(".address").val(self.originalEmail);
    $(".address").prop("disabled", true);

    $(".save-address").replaceWith(self.changeAddress);
    $(".error").text("");
    $(".cancel-address").hide();
  };

  var undoAddress = function (element) {
    $(".address").val(self.originalEmail);
    $(".address-saved").replaceWith(self.changeAddress);
    saveInSession(self.originalEmail);
  };

  var unsubscribe = function (event) {
    var button = event.target;
    var subscription = $(button).closest(".subscription").data("subscription");

    $(button).replaceWith(unsubscribedElement);
    unsubscribeInSession(subscription);
  };

  var undoUnsubscribe = function (element) {
    var span = $(element.target).closest(".unsubscribed");
    var subscription = $(span).closest(".subscription").data("subscription");
    var frequency = $(span).closest(".subscription").data("frequency");

    span.replaceWith(unsubscribeButton());
    subscribeInSession(subscription, frequency);
  };

  var unsubscribeButton = function () {
    return "<button class='button unsubscribe'>Unsubscribe</button>";
  };

  var unsubscribedElement = function () {
    var undo = "<span class='undo-unsubscribe'> (<a href='javascript:void(0);'>undo</a>)</span>";
    var html = "<span class='unsubscribed'>Unsubscribed successfully." + undo + "</span>";

    return html;
  };

  var saveAddressElement = function () {
    return "<button class='button save-address'>Save changes</button>";
  };

  var addressSavedElement = function () {
    var undo = "<span class='undo-address'> (<a href='javascript:void(0);'>undo</a>)</span>";
    var text = "We've sent a <strong>verification email</strong> to your new address.";
    var html = "<p class='address-saved'>" + text + undo + "</p>";

    return html;
  };

  var saveInSession = function (address) {
    $.post("/manage", { address: address });
  };

  var unsubscribeInSession = function (subscription) {
    $.get("/unsubscribe", { id: subscription.id });
  };

  var subscribeInSession = function (subscription, frequency) {
    var title = subscription.title;
    var url = subscription.url;

    $.get("/create", { title: title, url: url, frequency: frequency });
  };
};

if ($(".manage").length !== 0) {
  new Manage().initialize();
}
