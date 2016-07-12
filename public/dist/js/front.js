/*jshint -W030 */

$(document).ready(function() {

    // fade in subhead
    $('#mainsub').fadeTo(1000, 1);

    function loadPlayer() {
        try {
            videojs("video-player-front").on('loadedmetadata', function() {

                // cache "this" reference
                var self = this;

                // kill the spinner
                $('.video-icon').removeClass('fa-circle-o-notch fa-spin')
                                .addClass('fa-video-camera');

                // click event for video tease - load that video
                $('.video-tease-wrapper').on('click', function() {

                        // get the ID of the new video
                        var new_video_id = $(this).data('video-id');

                        // add spinner class while it loads
                        var $video_icon = $(this).find('.video-icon');
                        $video_icon.removeClass('fa-video-camera')
                                   .addClass('fa-circle-o-notch fa-spin');

                        // remove "active" state from teases, add to this one
                        $('.video-tease-wrapper').removeClass('video-tease-active');
                        $(this).addClass('video-tease-active');

                        // fetch the video from brightcove
                        self.catalog.getVideo(String(new_video_id), function (error, video) {
                            if (error) {
                                console.log("error: ", error);
                            }
                            self.catalog.load(video);

                            // play the video
                            self.play();

                            // kill the spinner
                            $video_icon.removeClass('fa-circle-o-notch fa-spin')
                                       .addClass('fa-video-camera');
                        });
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
