(function($, _) {
    'use strict';

    // set up brightcove instance container
    var videosets = {
        "alfred-mcalister": null,
        "artly-snuff": null,
        "ramiro-martinez": null,
        "neal-spelce": null
    };

    _.each(_.keys(videosets), function(key) {
        // initialize and store brightcove instances
        videojs("video-player-" + key).ready(function() {
            videosets[key] = this;
        });
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

        // remove active class from other links in this set
        var $fellow_video_links = $t.parent().parent().find('.video-link');
        $fellow_video_links.removeClass('video-link-active');
        $t.addClass('video-link-active');

        // scroll to video player
        $('html, body').animate({
            scrollTop: $videoset.offset().top
        }, 'fast');

        // get the ID of the video element
        var video_player_id = $t.closest('.row').find('.vjs-tech')
                                .attr("id")
                                .split("player-")[1]
                                .split("_")[0];

        // get the ID of the video to play
        var new_video_id = $t.data('video-id');

        // get the brightcove instance
        var brightcove_instance = videosets[video_player_id];

        // load and play the video
        brightcove_instance.catalog.getVideo(String(new_video_id), function (error, video) {
            if (error) {
                console.log("error: ", error);
            } else {
                brightcove_instance.catalog.load(video);

                brightcove_instance.on("play", function() {
                    // pause other video players, if necessary
                    var videoset_id = $videoset.attr('id');
                    pause_other_video_players(videoset_id);

                    // kill the spinner
                    $spinner.html("");
                });

                brightcove_instance.on("progress", function() {
                    if (brightcove_instance.bufferedPercent() > 0.1) {
                        brightcove_instance.play();
                        return;
                    }
                });
            }
        });
    });
})(jQuery, _);
