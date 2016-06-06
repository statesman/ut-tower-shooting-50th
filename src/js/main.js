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

// trigger tooltips
$('[data-toggle="tooltip"]').tooltip();

// set up sliders
$('.slider').each(function(i, el) {
  $(el).imagesLoaded()
    .always(function() {
      new Slider(el);
    });
});

try {
    // do up masonry
    var $grid = $('.grid').masonry({
        itemSelector: '.grid-item'
    });

    $grid.imagesLoaded().progress(function() {
      $grid.masonry('reloadItems')
           .masonry('layout');
    });
}
catch (e) {
    console.log(e);
}
