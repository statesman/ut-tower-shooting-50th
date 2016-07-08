#!/bin/sh

# you need imagemagick for this, yo
# step 1: use licecap/QT to capture screencast, save as tower.gif

# explode the gif into a directory of pngs
convert -coalesce tower.gif pngs/matterport-%02d.png

# smallen 'em up a bit
mogrify -resize 70% pngs/matterport-*.png

# start a counter (for file-naming purposes)
counter=0

# loop over the pngs
for file in pngs/matterport-*.png
do
    # zero-pad numbers under 10
    printf -v num '%02d' $counter

    # layer the statesman logo over the pngs
    composite -gravity southeast pngs/logo.png $file pngs/matterport-with-logo-$num.png

    # increment the counter
    (( counter++ ))
done

# make dat gif
convert -delay 10 -loop 0 -dither none -deconstruct -layers optimize -matte -depth 8 -background none -quantize transparent pngs/matterport-with-logo-*.png matterport-with-logo-final.gif

# clean up after yourself
rm -rf pngs/matterport-*.png
