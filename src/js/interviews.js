(function($, _) {
    'use strict';

    // set up brightcove instance container
    var videosets = {
        "alfredmcalister": null,
        "artlysnuff": null,
        "ramiromartinez": null,
        "nealspelce": null
    };

    _.each(_.keys(videosets), function(key) {
        // initialize and store brightcove instances
        try {
            window.anvp[key + 'Anv'].onReady = function(playerInstance) {
                videosets[key] = this;
            };

        }
        catch (TypeError) {
            console.info(key);
        }
    });

    /*
     * pause all brightcove player instances except for the one whose
     * `videoset` div matches the slug passed to it
     *
     * @param {String} slug - the `videosets` item matching the player in focus
     */
    function pause_other_video_players(slug) {
        var other_video_players = _.reject(_.keys(videosets), function(d) {
            return d === slug;
        });

        // pause all other videos
        _.map(other_video_players, function(d) {
            return videosets[d].pause();
        });
    }

    // if you click on the video player div, pause other videos
    $('.video-container').on('click', function() {
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

        // remove active class from other links in this set
        var $fellow_video_links = $t.parent().parent().find('.video-link');
        $fellow_video_links.removeClass('video-link-active');
        $t.addClass('video-link-active');

        // scroll to video player
        $('html, body').animate({
            scrollTop: $videoset.offset().top
        }, 'fast');

        // get the ID of the video element
        var video_player_id = $t.closest('.content-list')
                                .attr('id');

        // get the ID of the video to play
        var new_video_id = $t.attr('data-video-id');

        // get the brightcove instance
        var anvatoPlayer = videosets[video_player_id];

        anvatoPlayer.play(new_video_id);
    });
})(jQuery, _);
