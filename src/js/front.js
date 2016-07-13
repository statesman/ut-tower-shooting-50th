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


    var myPlayer;

    function changeVideo(video_id){
        myPlayer.catalog.getVideo(video_id, function(error, video) {
            myPlayer.catalog.load(video);
            myPlayer.play();
        });
    }

    videojs("video-player-front").ready(function(){
        myPlayer = this;
    });

    $('.video-tease-wrapper').on('click', function() {
        var vid_id = $(this).data("video-id");
        changeVideo(vid_id);
        // remove "active" state from teases, add to this one
        $('.video-tease-wrapper').removeClass('video-tease-active');
        $(this).addClass('video-tease-active');
    });


});
