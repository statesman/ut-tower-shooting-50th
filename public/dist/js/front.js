/*jshint -W030 */

$(document).ready(function() {

    function loadPlayer(player_id) {
        try {
            videojs(player_id).on('loadedmetadata', function() {
                // kill the spinner
                var $video_icons = $('.video-icon');
                $.each($video_icons, function() {
                    if (String($(this).data("video-id")) === String(player_id.replace("video-player-front-", ""))) {
                        $(this).removeClass('fa-circle-o-notch fa-spin')
                               .addClass('fa-video-camera');
                    }
                });

                        /*
                        // fetch the video from brightcove
                        self.catalog.getVideo(String(new_video_id), function (error, video) {
                            if (error) {
                                console.log("error: ", error);
                            }
                            self.catalog.load(video);

                            // play the video
                            self.play();

                        });*/
            });
        }
        catch(e) {
            setTimeout(loadPlayer(player_id), 100);
            return;
        }
    }

    $(".video-js").each(function() {
         loadPlayer(this.id);
    });

    // click event for video tease - load that video
    $('.video-tease-wrapper').on('click', function() {
        // get the ID of the new video
        var new_video_id = $(this).data('video-id');
        $(".video-player-front").addClass("offscreen");
        $("#video-player-wrapper-" + new_video_id).removeClass("offscreen");

        // remove "active" state from teases, add to this one
        $('.video-tease-wrapper').removeClass('video-tease-active');
        $(this).addClass('video-tease-active');

    });

    // do up masonry
    var $grid = $('.grid').masonry({
        itemSelector: '.grid-item'
    });

    $grid.imagesLoaded().progress(function() {
      $grid.masonry('reloadItems')
           .masonry('layout');
    });





});
