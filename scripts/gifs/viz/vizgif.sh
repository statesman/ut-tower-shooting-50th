#!/bin/sh

counter=1
for file in viz*.png
do
    convert $file -crop 670x465+200+258 +repage miff:- |\
    composite -gravity northeast logo.png miff:- viz-cropped-with-logo-$counter.png
    # rm -rf $file
    (( counter++ ))
done

convert -delay 8 -loop 0 viz-cropped-with-logo-*.png share-twitter.gif
rm -rf viz-cropped-with-logo-*.png
