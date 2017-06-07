(function($) {
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

            playerInstance.setListener(function(e) {
                if (e.name === 'METADATA_LOADED') {
                    // get tease DOM element by video id
                    var el = $('[data-video-id=' + e.args[0] + ']');

                    // remove "active" state from teases, add to active
                    $('.video-tease-wrapper').removeClass('video-tease-active');
                    $(el).addClass('video-tease-active');
                }
            });

            // change video on click event
            $('.video-tease-wrapper').on('click', function() {
                selectVideo(this);
            }).on('keypress', function(e) {
                if (e.which === 13) {
                    selectVideo(this);
                }
            });
        };

        /* function to select video by DOM element
         * @param {Object} el - button corresponding to active video
         *
         */
        function selectVideo(el) {
            // get video ID
            var vid_id = $(el).attr('data-video-id');

            // swap the video
            myPlayer.play(vid_id);
        }

        // mccoy click event
        $('#mccoy').on('click', function() {
            $('html, body').animate({
                scrollTop: $("#video-and-articles").offset().top
            }, 'fast');
            $("#video-tease-wrapper-5028358537001").trigger("click");
        });

    });
})(jQuery);
