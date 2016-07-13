/*jshint -W030 */

$(document).ready(function() {

    // do up masonry
    var $grid = $('.grid').masonry({
        itemSelector: '.grid-item'
    });

    $grid.imagesLoaded().progress(function() {
      $grid.masonry('reloadItems')
           .masonry('layout');
    });

    // instantiate brightcove player
    var myPlayer;

    /* function to change video
     * @param {String} video_id - ID of video to change to
     *
     */
    function changeVideo(video_id){
        // set spinner icon
        var $icon = $('#icon-' + video_id);

        $('.video-icon').removeClass('fa-circle-o-notch fa-spin')
                        .addClass('fa-video-camera');

        $icon.removeClass('fa-video-camera')
             .addClass('fa-circle-o-notch fa-spin');

        myPlayer.catalog.getVideo(video_id, function(error, video) {
            myPlayer.catalog.load(video);
            myPlayer.play();
            // replace spinner
            $icon.removeClass('fa-circle-o-notch fa-spin')
                 .addClass('fa-video-camera');
        });
    }

    // this is the magic, I guess
    videojs("video-player-front").ready(function(){
        myPlayer = this;
    });

    // change video on click event
    $('.video-tease-wrapper').on('click', function() {

        // remove "active" state from teases, add to this one
        $('.video-tease-wrapper').removeClass('video-tease-active');
        $(this).addClass('video-tease-active');

        // get video ID
        var vid_id = $(this).data('video-id');

        // swap the video
        changeVideo(vid_id);

    });

});
