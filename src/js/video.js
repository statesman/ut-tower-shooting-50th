var VideoPlayer = (function($, _) {

    // list of videos
    var videos = [
        {
            person_id: 2,
            videos: [
                {
                    paths: [
                        "http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v",
                        "http://www.jplayer.org/video/ogv/Big_Buck_Bunny_Trailer.ogv",
                        "http://www.jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm"
                    ],
                    poster: "http://www.jplayer.org/video/poster/Big_Buck_Bunny_Trailer_480x270.png",
                    title: "Did it hurt when you got shot?"
                }
            ],

        }
    ];

/*
 * helper function to return a comma-separated list of supplied media types
 * @param {Array} ls
 */
var get_supplied_formats = function(ls) {
    var extensions = [];
    _.each(ls, function(d) {
        extensions.push(d.split(".").pop());
    });
    return extensions.join(", ");
};

/*
 * helper function to build the jPlayer object
 * @param {Object} rec
 */
var get_player_obj = function(rec) {
    var obj = {};
    obj.title = rec.title;
    obj.poster = rec.poster;
    _.each(rec.paths, function(d) {
        var ext = d.split(".").pop();
        obj[ext] = d;
    });
    return obj;
};

  // the video player object
  var VideoPlayer = function(el) {

    // cache the $ version of the video element
    this.$el = $(el);

    // get videos for this person
    var vids = _.findWhere(videos, {"person_id": this.$el.data("id")});

    // cache $ versions of the video div, controls, links
    this.$player = this.$el.find('.player');
    this.$list = this.$el.find('.player-list-of-videos');

    // save "this" ref
    var that = this;

    // populate the modal table with videos
    var active, table_data = "";
    _.each(vids.videos, function(d, i) {
        if (i === 0) {
            active = " active-link";
        } else {
            active = "";
        }
        table_data += [
            "<div class='video-link pointer" + active + "' data-video-id='" + i + "' data-video-title='" + d.title + "'>",
            "<ul class='fa-ul'><li class='video-icon-li'><i class='video-icon fa-li fa fa-video-camera'></i>",
            d.title,
            "</li></ul>",
            "<div class='player-progress-wrapper'><div class='player-progress' id='player-progress-" + i + "'></div></div>",
            "</div>"
        ].join("");
    });

    this.$list.html(table_data);

    // cache $ reference to video links
    var $video_links = $(".video-link");

    // init the first video
    var first_video = get_player_obj(vids.videos[0]);
    var first_video_formats = get_supplied_formats(vids.videos[0].paths);

    this.$player.jPlayer({
    	ready: function () {
    		$(this).jPlayer("setMedia", first_video);
    	},
    	swfPath: "dist",
        timeupdate: function(e) {
            var timeNow = e.jPlayer.status.currentTime;
            var timeLeft = e.jPlayer.status.duration;
            var pctDone = (timeNow / timeLeft) * 100;
            $("#player-progress-0").css('width', pctDone + "%");
        },
        ended: function() {
            $(".player-progress").css('width', 0);
        },
    	supplied: first_video_formats,
        size: {
            height: "250px",
            width: "100%"
        }
    });

    /*
     * function to play/pause video
     * @param {$} el
     */
    var playPauseVideo = function(el) {
        var player = that.$player;
        var jPd = player.data('jPlayer');
        if ( jPd.status.currentTime > 0 && jPd.status.paused === false ) {
            player.jPlayer('pause');
            el.removeClass("fa fa-pause")
              .removeClass("fa fa-video-camera")
              .addClass("fa fa-play");
         }
        else {
            player.jPlayer('play');
            el.removeClass("fa fa-play")
              .removeClass("fa fa-video-camera")
              .addClass("fa fa-pause");
        }
    };

    // hook up click events for play/pause
    this.$player.on('click', function() {
        // get td of currently playing video
        playPauseVideo();
    });

    /*
     * function to set video player media
     * @param {Number} video_idx
     */
    var set_media = function(video_idx) {
        var video_obj = get_player_obj(vids.videos[video_idx]);
        var video_formats = get_supplied_formats(vids.videos[video_idx].paths);
        that.$player.jPlayer({
            'setMedia': video_obj,
            'supplied': video_formats
        });
    };

    // hook up click event for table cell
    $video_links.on("click", function() {
        var player = that.$player;
        var vid_title = $(this).data("video-title");
        var vid_idx = $(this).data("video-id");
        var vid_icon = $(this).find(".video-icon");

        var currently_playing_title = player.data('jPlayer').status.media.title;

        if (vid_title === currently_playing_title) {
            // if this video is already playing, play/pause
            playPauseVideo(vid_icon);
        } else {
            // if not, load up the new video

            // set the media
            set_media(+vid_idx);

            // bold/bg the table item
            $video_links.removeClass("active-link");
            $(this).addClass("active-link");

            player.jPlayer('play');
        }
    });

}; // end VideoPlayer function

  return VideoPlayer;
}(jQuery, _));
