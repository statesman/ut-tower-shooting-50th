/*jshint -W030 */

$(document).ready(function() {

    // fade in subhead
    $('#mainsub').fadeTo(1000, 1);

    /* load brightcove script in a way that doesn't block page rendering as obviously */
    var script = document.createElement("script");
    script.src = "//players.brightcove.net/1418563061/BygcJDlI_default/index.min.js";
    $("body").append(script);

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

                        // fire omniture event
                        if (s) {
                            var omniture_param = 'video-tease-' + new_video_id;
                            s.linkTrackVars = 'prop1';
                            s.prop1=s.pageName;
                            console.log(s.prop1, omniture_param);
                            s.tl(true, 'o', omniture_param);
                        }

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
