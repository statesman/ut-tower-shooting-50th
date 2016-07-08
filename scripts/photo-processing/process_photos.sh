DIRS_TO_PROCESS=(apd hav ra st)

for dir in ${DIRS_TO_PROCESS[@]}; do
    for file in $dir/*.JPG
    do
        echo ${file%%.*}

        # nab the caption, append to csv
        caption=$(identify -verbose $file | grep -i "Caption")
        echo "${file%%.*}: $caption" >> captions.csv

        # nab height/width
        width=$(identify -format '%w' $file)
        height=$(identify -format '%h' $file)

        # if horizontal, resize to 800px width and resample to 72dpi
        if [ $width -gt $height ]; then
            convert -resize 800x -density 72 $file resized/${file%%.*}-resized.png
        # if vertical, resize to 600px height, resample to 72dpi, center on 800x600 matte
        else
            convert -resize x600 -density 72 -background "#f9f9f9" -gravity north -extent 800x600 $file resized/${file%%.*}-resized.png
        fi
    done
done
