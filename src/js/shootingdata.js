(function($, _) {

    // set up underscore template
    var sidebar_template = _.template($("#details_template").html());

    /* helper function to sum an array of numbers
     * @param {Array} ls - array of numbers to sum
     */
    var sum = function(ls) {
        return _.reduce(ls, function(memo, num){ return memo + num; }, 0);
    };

    /* helper function to add intcommas
     * via http://stackoverflow.com/a/2901298
     * @param {Number} x - a number
     */
    var intComma = function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // cache DOM elements
    var $victim_total = $('#victim_total');
    var $timeline = $('#timeline');
    var $details = $('.details');
    var $previous = $("#player-previous-button");
    var $next = $("#player-next-button");
    var el = d3.select('#map');

    // set the aspect ratio for the map
    var aspect = 960 / 500;

    // set the width
    var width = el.node().getBoundingClientRect().width;

    // calculate the height
    var height = width / aspect;

    // set the projection
    var projection = d3.geo.albersUsa()
        .scale(width)
        .translate([width / 2, height / 2]);

    // set the path
    var path = d3.geo.path()
        .projection(projection);

    // append the SVG
    var svg = el.append("svg")
        .attr("width", width)
        .attr("height", height);

    // load the data (async)
    d3.queue()
        .defer(d3.json, 'data/us.json')
        .defer(d3.tsv, 'data/shooting-data.tsv')
    .await(ready);

    // main function to draw the map
    function ready(error, us, csv) {

        /* helper function to nab victim totals
         * @param {Array} data - array of objects
         */
        var get_victim_total = function(data) {
            var v_count = sum(
                _.map(
                    _.pluck(data, "fatalities"), function(d) {
                        return +d;
                    }
                ).concat(
                    _.map(
                        _.pluck(data, "wounded"), function(d) {
                            return +d;
                        }
                    )
                )
            );
            return v_count;
        };

        // populate the placeholder elements
        $("#incident_count").html(csv.length);
        $("#fatality_count").html(
            intComma(get_victim_total(csv))
        );

        $("#interactive-subhead").fadeTo(1500, 1);

        // draw the U.S. shape
        svg.insert('path', '.graticule')
            .datum(topojson.feature(us, us.objects.land))
            .attr('class', 'land')
            .attr('d', path);

        // draw the state boundaries
        svg.insert('path', '.graticule')
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr('class', 'state-boundary')
            .attr('d', path);

        // get a unique list of years for the timeline
        var uniq_years = _.uniq(
            _.pluck(csv, "year")
        );

        // get min/max years
        var min_year = _.min(uniq_years);
        var max_year = _.max(uniq_years);

        // draw the baseline
        var bottom_line = [
            "<div class='bottomline'>",
            "<span class='pull-left'>",
            min_year,
            "</span>",
            "<span class='pull-right'>",
            max_year,
            "</span>",
             "</div>"].join("");

        // get the range of years to display
        var year_range = _.range(+min_year, +max_year+1);

        // set the bar width as a percentage
        var bar_width = 100 / year_range.length;

        // draw the timeline
        var timeline_string = '';
        _.each(year_range, function(d, i) {
            var incidents_this_year = _.filter(csv, function(x) {
                return +x.year === d;
            });

            // heighten up those bars eh
            var multiplier = 1;

            // get victim count
            if (incidents_this_year.length > 0) {
                victim_count = get_victim_total(incidents_this_year);
            } else {
                victim_count = 0;
            }

            // make the bar chart
            timeline_string += "<div class='timeline-bar' data-victims='" + victim_count + "' id='" + d + "' style='height:" + (victim_count*multiplier) + "px; width:" + bar_width + "%;'></div>";
        });

        $timeline.html(timeline_string + "<div class='clearfix'></div>")
                 .append(bottom_line);

        // cache reference to new DOM elements (bars)
        var $bars = $(".timeline-bar");

        /* function to draw bubbles on map
         * @param {Number} year - year ("2014") or comma-separated max/min years ("2000,2014")
         */
        function populate_map(year) {

            // gray out the bars
            $bars.removeClass("timeline-bar-active");

            // get el width
            width = el.node().getBoundingClientRect().width;

            // set the bubble size scale
            // scale (radius in px) = width / variable
            var scale = width / 1200;

            var incidents, year_hed;

            // if this is a "show multiple years" situation
            if (year.split(",").length > 1) {

                // sort the years low to high
                var sorted_years = _.map(
                    year.split(","), function(d) {
                        return +d;
                    }
                ).sort();

                // get the range of years between them, inclusive
                var year_range = _.range(sorted_years[0], sorted_years[1]+1);

                // set those bar colors to active
                $bars.each(function() {
                    var $t = $(this);
                    if (_.contains(year_range, +$t.attr("id")) && +$t.data("victims") > 0) {
                        $t.addClass("timeline-bar-active");
                    }
                });

                // filter incidents in data file
                incidents = _.filter(csv, function(d) {
                    return _.contains(year_range, +d.year);
                });

                year_hed = sorted_years[0] + "-" + sorted_years[1];

            // else it's a single yera
            } else {
                // reset bar colors to gray
                $bars.removeClass("timeline-bar-active");

                // ... except for the selected year
                $("#" + year).addClass("timeline-bar-active");

                // filter data to get shootings for the selected year
                incidents = _.filter(csv, function(d) {
                    return +d.year === +year;
                });

                year_hed = year;
            }

            // get victim total for the selected year
            var victim_total = get_victim_total(incidents);

            // set default text for map when nothing is clicked on
            var default_text = "<h3 class='detail-hed'>Click on the bubble" + pluralize(incidents.length)[0] + " to show details about " + pluralize(incidents.length)[1] + " shooting.</h3>";

            // set (or reset) default text
            if (victim_total > 0) {
                $details.html(default_text);
            } else {
                $details.html('');
            }

            // populate the main hed
            $victim_total.html([
                year_hed,
                ": ",
                intComma(victim_total),
                " victims"
            ].join(""));

            // wipe the map
            svg.selectAll("circle").remove();

            // draw the map bubbles
            svg.selectAll("circle")
                .data(incidents)
                .enter()
                .append("circle")
        		.attr("cx", function (d) { return projection([d.lng, d.lat])[0]; })
        		.attr("cy", function (d) { return projection([d.lng, d.lat])[1]; })
        		.attr("class", "dot")
                .attr("r",  function(d) {
                    var fatalities = +d.fatalities;
                    var wounded = +d.wounded;
                    // store the total
                    d.total = fatalities + wounded;
                    return d.total * scale;
                })
                .sort(function(a, b) {
                    // sort based on total so smaller bubbles are placed on top
                    if (a.total > b.total) {
                        return -1;
                    } else if (a.total < b.total) {
                        return 1;
                    } else {
                        return 0;
                    }
                })

                // set up click event for bubbles
                .on("click", function(d) {
                    $details.html(sidebar_template(d));
                    svg.selectAll("circle")
                       .classed("dot", true)
                       .classed("highlighted", false);
                    d3.select(this).classed("highlighted", true);
                });
        }

        // handle resize
        d3.select(window)
            .on("resize", _.debounce(resize, 500));

        function resize() {
            var width = el.node().getBoundingClientRect().width;
            var height = width / aspect;

            // set the bubble size scale
            // scale (radius in px) = width / variable
            var scale = width / 1200;

            svg
                .attr('width', width)
                .attr('height', height);

            projection
                .scale(width)
                .translate([width / 2, height / 2]);

            d3.select('.state-boundary')
                .attr('d', path);

            d3.selectAll('.land')
                .attr('d', path);

            d3.selectAll('.dot')
        		.attr("cx", function (d) { return projection([d.lng, d.lat])[0]; })
        		.attr("cy", function (d) { return projection([d.lng, d.lat])[1]; })
                .attr("r",  function(d) {
                    var fatalities = +d.fatalities;
                    var wounded = +d.wounded;
                    return (fatalities + wounded) * scale; });
        }

        // helper functions to get current/next/previous years
        var get_current_year = function() {
            var active = $(".timeline-bar-active")[0];
            return +active.id;
        };

        var get_next_year = function() {
            var current = get_current_year();
            var next = current + 1;
            if (next > max_year) {
                next = min_year;
            }
            return String(next);
        };

        var get_previous_year = function() {
            var current = get_current_year();
            var prev = current - 1;
            if (prev < min_year) {
                prev = max_year;
            }
            return String(prev);
        };

        // set up click event for bars
        $bars.on("click", function(e) {
            var current = get_current_year();
            var this_year = this.id;
            var year_to_map = this_year;

            if (e.shiftKey) {
                year_to_map = [current, this_year].join(",");
            }

            populate_map(year_to_map);

        });

        // set up click events for forward/backward buttons
        $previous.on("click", function() {
            var previous = get_previous_year();
            populate_map(previous);
        });

        $next.on("click", function() {
            var next = get_next_year();
            console.log(next);
            populate_map(next);
        });

        $('.show-all').on('click', function() {
            populate_map([min_year, max_year].join(","));
        });

        $(document).ready(function() {
            // set initial view
            populate_map([min_year, max_year].join(","));
            // set up left/right arrow events
            this.onkeydown = function(e) {
                e = e || window.event;
                if (+e.which === 37) {
                    var previous = get_previous_year();
                    populate_map(previous);
                } else if (+e.which === 39) {
                    var next = get_next_year();
                    populate_map(next);
                }
            };
        });

    } // end ready function
})(jQuery, _);
