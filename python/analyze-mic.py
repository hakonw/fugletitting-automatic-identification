from birdnetlib import RecordingBuffer
from birdnetlib.analyzer import Analyzer
import sounddevice

import numpy as np

import sys, os

analyzer = Analyzer()


def blockPrint():
    sys.stdout = open(os.devnull, 'w')

def enablePrint():
    sys.stdout = sys.__stdout__

def record_microphone(duration=3, sample_rate=44100):
    # Record audio from the microphone
    audio_data = sounddevice.rec(int(duration * sample_rate), samplerate=sample_rate, channels=1, dtype=np.int16)
    sounddevice.wait()

    return audio_data

def runBirdnet(data, sample_rate=44100):
    # birdnetlib is mean. Disable printing 
    blockPrint()
    recording = RecordingBuffer(
                analyzer,
                data,
                sample_rate,
                #lat=63.4266,
                #lon=10.3823,
                min_conf=0.1,
            )
    recording.analyze()
    enablePrint()
    detections = recording.detections
    for i in range(min(len(detections), 3)):
        print(f"{detections[i]['scientific_name']}\tConf: {detections[i]['confidence']:.2f}")
    
    if len(detections) == 0:
        print("No detections")


while (True):
    print("----------")
    r1 = record_microphone()
    runBirdnet(r1)