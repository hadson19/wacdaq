$(document).ready(function() {
  setTimeout(function() {
    $("input[name='phone']").mask("+7(999) 999-99-99"),
      $(".modal-js").fancybox({
        animationEffect: "zoom-in-out",
        slideClass: "modal-close"
      }),
      $("#language").select2({
        templateSelection: function(e) {
          return e.id ? $('<span><img src="static/img/flags/' + e.element.value.toLowerCase() + '.png" class="img-flag" /> ' + e.text + "</span>") : e.text
        },
        minimumResultsForSearch: 1 / 0
      })
  }, 500);
});
