var videosets = ["alfred-mcalister", "artly-snuff", "ramiro-martinez", "neal-spelce"];

function get_video_instances_on_this_page() {
    var video_instances = [];
    for (var i=0;i < videosets.length; i++) {
        var bc_player = "video-player-" + videosets[i];
        video_instances.push(videojs(bc_player));
    }
    return video_instances;
}

function pause_all_other_video_players(id) {
    var other_videos = _.reject(video_player_instances, function(obj) {
        return obj.id_ === id;
    });
    for (i=0; i < other_videos.length; i++) {
        if (!other_videos[i].paused()) {
            other_videos[i].pause();
        }
    }
}

$('video').on('click', function(e) {

    // pause all currently playing videos
    pause_all_other_videos(this.id);

    var this_player = videojs(this.id);

    //figure out whether this dude is playing
    var isPlaying = !this_player.paused();
    console.log(isPlaying);

    if (isPlaying) {
        this_player.pause();
    } else {
        this_player.play();
    }
});

$('.video-link').on('click', function() {
    var $t = $(this);
    var $spinner = $t.find('.spinner');
    $spinner.html("<i class='fa fa-circle-o-notch fa-spin'></i>");
    var $fellow_video_links = $t.parent().parent().find('.video-link');
    $fellow_video_links.removeClass('video-link-active');
    $t.addClass('video-link-active');

    // scroll to video player
    var $parent_row = $t.closest('.row');

    $('html, body').animate({
        scrollTop: $parent_row.closest('.videoset').offset().top - 60
    }, 'fast');

    var video_player_id = $parent_row.find('video').attr("id");
    var new_video_id = $t.data('video-id');
    var brightcove_instance = videojs(video_player_id);

    brightcove_instance.catalog.getVideo(String(new_video_id), function (error, video) {
        if (error) {
            console.log("error: ", error);
        }
        brightcove_instance.catalog.load(video);
        brightcove_instance.play();
        $spinner.html("");
    });


});

$(document).ready(function() {
    var video_player_instances = get_video_instances_on_this_page();
    console.log(video_player_instances);
});
