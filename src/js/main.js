// set global template variable
_.templateSettings.variable = "template_data";

// jank pluralizer function
var pluralize = function(num) {
    if (num === 1) {
        return ["", "the"];
    } else {
        return ["s", "each"];
    }
};

(function($, Slick) {

  "use strict";

  $(function() {

    // Open Twitter links in a new window
    $('.sider-twitter').on('click', 'a', function(e) {
      e.preventDefault();
      var url = $(this).attr('href');
      window.open(url, "_blank", "width=555, height=520");
    });

    // Show the chapters when they're expanded on mobile
    $('.navbar-expand').on('click', function(e) {
      e.preventDefault();
      var elId = $(this).data('target');
      $(elId).toggleClass('hidden-navbar-collapsed');
    });

    // Set up sliders
    $('.slider').each(function(i, el) {
      $(el).imagesLoaded()
        .always(function() {
          new Slick(el);
        });
    });

  });

}(jQuery, Slick));
