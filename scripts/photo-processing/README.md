# Archival photo processing script

### Problem
Given four directories of archival photos &mdash; each earmarked for a separate slick.js slider &mdash; resize and resample for the web.

Horizontal photos should be 800px wide @72dpi; vertical photos should be 600px tall, centered on an 800x600 canvas.

We also need to extract the "caption" metadata from each image and write to a CSV.

### Solution
A [`bash script`](process_photos) that loops over each JPG in each directory, using imagemagick to resize the images and extract the metadata.
