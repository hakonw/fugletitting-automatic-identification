# Information

This extension detects mp3 requests from NatureId, analyzes the sound via Birdnet (https://birdnet.cornell.edu/).
Then shows a summary of the results in the options.

# Notice

Using this program to cheat on any academic exam or competition is not allowed.

# Extension
The simplest way to run this software is to install the extension.

Clone the project, go to `edge://extensions` or `chrome://extensions`, enable Developer mode, select `Load unpacked`, and choose the extension folder.

The extension should (after a refresh) work, and add the percentage to the label if the species is among the top 10 matches.


# Using python version
The pyton version can be run on a different computer making the detection undetectable.

This uses the mic input and analyzes every 3-second interval for bird sounds.

Pip packages needed: `birdnetlib` and `sounddevice`.

## To run
To make good detections, the pc running the software needs the best possible sound. To send the sound, there are multiple possible ways.

1. Aux splitting - Use a physical aux splitter so you can send one output to a pc and listen at the same time.
2. Loopback device - You can use a loopback software like [Blackhole](https://github.com/ExistentialAudio/BlackHole) to capture the pc and send it as a microhpone.
