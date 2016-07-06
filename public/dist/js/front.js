// do up masonry
var $grid = $('.grid').masonry({
    itemSelector: '.grid-item'
});

$grid.imagesLoaded().progress(function() {
  $grid.masonry('reloadItems')
       .masonry('layout');
});

// hook up click events when the video loads
videojs("video-player-front").on('loadedmetadata', function() {
    var self = this;
    $('.video-tease-front').show()
        .on('click', function() {
            var new_video_id = $(this).data('video-id');
            $('.video-tease-front').removeClass('video-tease-active');
            $(this).addClass('video-tease-active');
            self.catalog.getVideo(String(new_video_id), function (error, video) {
                if (error) {
                    console.log("error: ", error);
                }
                self.catalog.load(video);
                self.play();
            });
        });
});

$(document).ready(function() {
    var hed = "A new kind of madness";
    var i=0;

    function typewriterHed() {
        $('#mainhed').append(hed[i]);
        i++;
        if( i < hed.length ){
            var timeout = _.random(0, 800);
            setTimeout(typewriterHed, timeout);
        } else {
            $("#mainsub").fadeTo(1500, 1);

            /*
            $("#mainhed").html(function(i, html) {
                return html.replace(/(madness)/i, '<span id="redfade">$1</span>');
            });
            $("#redfade").css({
                '-webkit-transition': 'colorfade 1s ease-in-out',
                'transition': 'colorfade 1s ease-in-out'
            });
            */
        }

    }

    typewriterHed();



/*
        <h1>A new kind of <span class="red">madness</span></h1>
        <h2>The University of Texas tower shooting, 50 years later</h2>
*/


});
