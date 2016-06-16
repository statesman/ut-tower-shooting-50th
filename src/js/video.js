var VideoPlayer = (function($, _) {

    // list of videos
    var videos = [
        {
            person_id: 2,
            videos: [
                {
                    video_id: 0,
                    paths: [
                        "http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v",
                        "http://www.jplayer.org/video/ogv/Big_Buck_Bunny_Trailer.ogv",
                        "http://www.jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm"
                    ],
                    poster: "http://www.jplayer.org/video/poster/Big_Buck_Bunny_Trailer_480x270.png",
                    title: "Did it hurt when you got shot?"
                },
                {
                    video_id: 1,
                    paths: [
                        "http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v",
                        "http://www.jplayer.org/video/ogv/Big_Buck_Bunny_Trailer.ogv",
                        "http://www.jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm"
                    ],
                    poster: "http://www.jplayer.org/video/poster/Big_Buck_Bunny_Trailer_480x270.png",
                    title: "Blarp blarp blarp blarp?"
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
    obj.video_id = rec.video_id;
    _.each(rec.paths, function(d) {
        var ext = d.split(".").pop();
        obj[ext] = d;
    });
    return obj;
};

  // the video player object
  var VideoPlayer = function(el) {

    // save "this" ref
    var self = this;

    // set aspect ratio
    var aspect_ratio = 16 / 9;

    // cache the $ version of the video element
    self.$el = $(el);

    // get videos for this person
    var vids = _.findWhere(videos, {"person_id": self.$el.data("id")});

    // cache $ versions of the video div, progress bar, fullscreen icon, links
    self.$player = self.$el.find('.player');
    self.$progress = self.$el.find('.player-progress');
    self.$fullscreen = self.$el.find('.player-go-fullscreen');
    self.$list = self.$el.find('.player-list-of-videos');

    // build an HTML string for the modal playlist
    var active, table_data = "";
    _.each(vids.videos, function(d) {
        table_data += [
            "<div class='video-link pointer' data-video-id='" + d.video_id + "'>",
            "<ul class='fa-ul'><li class='video-icon-li'><i class='video-icon fa-li fa fa-video-camera' data-video-icon='" + d.video_id + "'></i>",
            d.title,
            "</li></ul>",
            "</div>"
        ].join("");
    });

    // populate the playlist div
    self.$list.html(table_data);

    // cache $ reference to video links
    var $video_links = $(".video-link");

    /*
     * function to play/pause video
     * @param {$} el
     */
    var playPauseVideo = function(el) {
        var $player = self.$player;
        var jPd = $player.data('jPlayer');
        if ( jPd.status.currentTime > 0 && jPd.status.paused === false ) {
            // if the video has started playing, pause it
            $player.jPlayer('pause');

            // and swap in the play icon
            el.removeClass("fa-pause")
              .removeClass("fa-video-camera")
              .addClass("fa-play");
         }
        else {
            // if the player is paused, play it
            $player.jPlayer('play');

            // and swap in the pause icon
            el.removeClass("fa-play")
              .removeClass("fa-video-camera")
              .addClass("fa-pause");
        }
    };

    // hook up click events for play/pause when the video player is clicked
    self.$player.on('click', function() {
        // get the ID of the video currently playing
        var video_id = self.$player.data('jPlayer').status.media.video_id;

        // use the ID to find the "active" div in the playlist
        var $active_div = $(".video-link[data-video-id='" + video_id + "']");

        // ... and the associated icon
        var $vid_icon = $(".video-icon[data-video-icon='" + video_id + "']");

        // play/pause the video
        playPauseVideo($vid_icon);
    });

    /*
     * function to set player media
     * @param {Number} video_id
     */
    var set_media = function(video_id) {
        // get the video from the ID passed to the function
        var selected_video = _.findWhere(vids.videos, {"video_id": video_id});

        // create an object to pass to jPlayer "setMedia"
        var video_obj = get_player_obj(selected_video);

        // ... and a list of supplied formats
        var video_formats = get_supplied_formats(selected_video.paths);

        // update jPlayer
        self.$player.jPlayer('setMedia', video_obj)
                     .jPlayer('supplied', video_formats);
    };

    // hook up click event for playlist items
    $video_links.on("click", function() {

        // cache ref to player
        var $player = self.$player;

        // get selected video from el's data element
        var vid_id = $(this).data("video-id");
        var selected_video = _.findWhere(vids.videos, { "video_id": vid_id });

        // get refs to video title, currently playing video title and icon
        var vid_title = selected_video.title;
        var currently_playing_title = $player.data('jPlayer').status.media.title;
        var vid_icon = $(this).find(".video-icon");

        // reset icons to video cameras
        $(".video-icon").removeClass("fa-play")
                        .removeClass("fa-pause")
                        .addClass("fa-video-camera");

        // if this video is already playing, play/pause
        if (vid_title === currently_playing_title) {
            playPauseVideo(vid_icon);

        // if it's not already playing, switch to the new video
        } else {
            // clear progress bar
            self.$progress.css('width', 0);

            // set icon to "play"
            vid_icon.removeClass("fa-pause")
                    .removeClass("fa-video-camera")
                    .addClass("fa-play");

            // set the media
            set_media(+vid_id);

            // give div "active" state
            $video_links.removeClass("active-link");
            $(this).addClass("active-link");
        }
    });

    // init player
    self.$player.jPlayer({
        // load up the first video
    	ready: function () {
    		$(this).jPlayer("setMedia", get_player_obj(vids.videos[0]));

            // set active state on first playlist element
            $video_links.eq(0).addClass("active-link")
                              .find(".video-icon")
                              .removeClass("fa-video-camera")
                              .addClass("fa-play");
    	},

        // set path to fallback flash player
    	swfPath: "dist",

        // function to catch time update and fill progress bar
        timeupdate: function(e) {
            var timeNow = e.jPlayer.status.currentTime;
            var timeLeft = e.jPlayer.status.duration;
            var pctDone = (timeNow / timeLeft) * 100;
            self.$progress.css('width', pctDone + "%");
        },

        // define what happens when the video ends
        ended: function(e) {
            self.$progress.css('width', 0);
            $('.video-icon').removeClass("fa-play")
                        .removeClass("fa-pause")
                        .addClass("fa-video-camera");
        },

        // give the supplied formats
        supplied: get_supplied_formats(vids.videos[0].paths),

        // set player size
        size: {
            height: "250px",
            width: "100%"
        }
    });

    // set up fullscreen function
    VideoPlayer.prototype.fullscreen = function() {
        if (self.requestFullscreen) {
            self.requestFullscreen();
        }
        else if (self.mozRequestFullScreen) {
            self.mozRequestFullScreen();
        }
        else if (self.webkitRequestFullScreen) {
            self.webkitRequestFullScreen();
        }
        else if (self.msRequestFullscreen) {
            self.msRequestFullscreen();
        }
    };

    self.$fullscreen.on("click", self.fullscreen());

}; // end VideoPlayer function

  return VideoPlayer;
}(jQuery, _));
