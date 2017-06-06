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

    // add listener for video player on index page
    // with hard-coded variable reference
    window.anvp.p0.onReady = function(playerInstance) {
        myPlayer = playerInstance;

        // change video on click event
        $('.video-tease-wrapper').on('click', function() {
            selectVideo(this);
        }).on('keypress', function(e) {
            if (e.which === 13) {
                selectVideo(this);
            }
        });
    };

    /* function to change video
     * @param {String} video_id - ID of video to change to
     *
     */
    function changeVideo(video_id){
        // set spinner icon
        var $icon = $('#icon-' + video_id);

        $('.video-icon').removeClass('fa-circle-o-notch fa-spin')
                        .addClass('fa-video-camera');

        myPlayer.play(video_id.toString());
    }

    function selectVideo(el) {
        // remove "active" state from teases, add to this one
        $('.video-tease-wrapper').removeClass('video-tease-active');
        $(el).addClass('video-tease-active');

        // get video ID
        var vid_id = $(el).attr('data-video-id');

        // swap the video
        changeVideo(vid_id);
    }

    // mccoy click event
    $('#mccoy').on('click', function() {
        $('html, body').animate({
            scrollTop: $("#video-and-articles").offset().top
        }, 'fast');
        $("#video-tease-wrapper-5028358537001").trigger("click");
    });

});
