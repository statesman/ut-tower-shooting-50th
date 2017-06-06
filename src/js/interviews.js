(function($, _) {
    'use strict';

    // set up anvato instance container
    var videosets = {
        "alfredmcalister": null,
        "artlysnuff": null,
        "ramiromartinez": null,
        "nealspelce": null
    };

    var activeVideo = null;

    _.each(_.keys(videosets), function(key) {
        // initialize and store anvato instances
        // uses `+ 'Anv'` because markup breaks if
        // slug and anvato id are identical
        window.anvp[key + 'Anv'].onReady = function(playerInstance) {
            videosets[key] = this;

            playerInstance.setListener(function(e) {
                if (e.name === 'METADATA_LOADED') {
                    activeVideo = e.args[0].toString();

                    // update active button styling
                    var $t = $('[data-video-id=' + activeVideo + ']');
                    var $fellow_video_links = $t.parent().parent().find('.video-link');
                    $fellow_video_links.removeClass('video-link-active');
                    $t.addClass('video-link-active');
                }
                else if (e.name === 'VIDEO_STARTED') {
                    pause_other_video_players(key);
                }
            });
        };
    });

    /*
     * pause all anvato player instances except for the one whose
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

    /*
     * Function fired by clicks to the interview questions
     *
     * @param {String} slug - the `videosets` item matching the player in focus
     */
    function clickVideoLink(el) {
        // cache ref to elements
        var $t = $(el);
        var $videoset = $(el).closest('.content-list');

        // scroll to video player
        $('html, body').animate({
            scrollTop: $videoset.offset().top
        }, 'fast');

        // get the ID of the video element
        var video_player_id = $t.closest('.content-list')
                                .attr('id');

        // get the ID of the video to play
        var new_video_id = $t.attr('data-video-id');

        // get the anvato instance
        var anvatoPlayer = videosets[video_player_id];

        // only play video if it's not already playing
        if (activeVideo !== new_video_id) {
            anvatoPlayer.play(new_video_id);
        }
    }

    // click event for links to specific videos
    $('.video-link').on(
        'click', function() {
            clickVideoLink(this);
        }
    ).on('keypress', function(e) {
        if (e.which === 13) {
            clickVideoLink(this);
        }}
    );
})(jQuery, _);
