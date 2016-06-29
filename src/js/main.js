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

// set up videos
$('.video-player').each(function(i, el) {
    new VideoPlayer(el);
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

videojs("video-player-front").on("loadedmetadata", function() {
    var self = this;
    $(".video-tease-front").show()
        .on('click', function() {
            var new_video_id = $(this).data('video-id');
            $('.video-tease-front').removeClass('video-tease-active');
            $(this).addClass('video-tease-active');
            self.catalog.getVideo(String(new_video_id), function (error, video) {
                if (error) {
                    console.log("error: ", error);
                }
                self.catalog.load(video);
            });
        });
});
