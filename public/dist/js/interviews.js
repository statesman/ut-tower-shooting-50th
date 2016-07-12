(function($, _) {
    'use strict';

    // slugs with IDs of videoset divs
    var videosets = ["alfred-mcalister", "artly-snuff", "ramiro-martinez", "neal-spelce"];

    /*
     * pause all brightcove player instances except for the one whose
     * `videoset` div matches the slug passed to it
     *
     * @param {String} slug - the `videosets` item matching the player in focus
     */
    function pause_other_video_players(slug) {
        var other_video_players = _.reject(videosets, function(d) {
            return d === slug;
        });
        for (i=0; i < other_video_players.length; i++) {
            var player = videojs([
                "video-player-",
                other_video_players[i]
            ].join(""));
            if (!player.paused()) {
                player.pause();
                console.log("paused", other_video_players[i]);
            }
        }
    }

    // if you click on the video player div, pause other videos
    $('.brightcove-full-player').on('click', function() {
        var $videoset = $(this).closest('.content-list');
        var videoset_id = $videoset.attr('id');
        pause_other_video_players(videoset_id);

        $('html, body').animate({
            scrollTop: $videoset.offset().top
        }, 'fast');
    });

    // click event for links to specific videos
    $('.video-link').on('click', function() {
        // cache ref to elements
        var $t = $(this);
        var $videoset = $(this).closest('.content-list');
        var $spinner = $t.find('.spinner');

        // set the spinner going
        $('.video-status').html("");
        $spinner.html("<i class='fa fa-circle-o-notch fa-spin'></i>");

        // pause other video players, if necessary
        var videoset_id = $videoset.attr('id');
        pause_other_video_players(videoset_id);

        // remove active class from other links in this set
        var $fellow_video_links = $t.parent().parent().find('.video-link');
        $fellow_video_links.removeClass('video-link-active');
        $t.addClass('video-link-active');

        // scroll to video player
        $('html, body').animate({
            scrollTop: $videoset.offset().top
        }, 'fast');

        // get the ID of the video element
        var video_player_id = $t.closest('.row').find('video').attr("id");

        // get the ID of the video to play
        var new_video_id = $t.data('video-id');

        // get the brightcove instance
        var brightcove_instance = videojs(video_player_id);
        console.log(brightcove_instance);

        // load and play the video
        brightcove_instance.catalog.getVideo(String(new_video_id), function (error, video) {
            if (error) {
                console.log("error: ", error);
            }
            brightcove_instance.catalog.load(video);
            brightcove_instance.play();

            // kill the spinner
            $spinner.html("");
        });
    });
})(jQuery, _);
