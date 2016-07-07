/*jshint -W030 */

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
        }
    }
    typewriterHed();

    /* load brightcove script in a way that doesn't block page rendering as obviously */

    var script = document.createElement("script");
    script.src = "//players.brightcove.net/1418563061/BygcJDlI_default/index.min.js";
    $("body").append(script);

    function loadPlayer() {
        try {
            videojs("video-player-front").on('loadedmetadata', function() {
                var self = this;
                $('.video-icon').removeClass('fa-circle-o-notch fa-spin')
                                .addClass('fa-video-camera');
                $('.video-tease-front').on('click', function() {
                        var new_video_id = $(this).data('video-id');
                        var $video_icon = $(this).find('.video-icon');
                        $video_icon.removeClass('fa-video-camera')
                                   .addClass('fa-circle-o-notch fa-spin');

                        $('.video-tease-front').removeClass('video-tease-active');
                        $(this).addClass('video-tease-active');
                        self.catalog.getVideo(String(new_video_id), function (error, video) {
                            if (error) {
                                console.log("error: ", error);
                            }
                            self.catalog.load(video);
                            self.play();
                        });
                        $video_icon.removeClass('fa-circle-o-notch fa-spin')
                                   .addClass('fa-video-camera');
                    });
            });
        }
        catch(e) {
            setTimeout(loadPlayer, 100);
            return;
        }
    }

    loadPlayer();

    // do up masonry
    var $grid = $('.grid').masonry({
        itemSelector: '.grid-item'
    });

    $grid.imagesLoaded().progress(function() {
      $grid.masonry('reloadItems')
           .masonry('layout');
    });


});
