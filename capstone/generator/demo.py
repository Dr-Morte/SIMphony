import sys, time, random
import os

counter = 0

while (True):
    try:
        pathToFile = input()
        file_array = os.listdir(pathToFile)
        max_counter = len(file_array)
        midi = open(pathToFile + '/' + file_array[counter], 'r')
        midiData = midi.buffer.read()
        sys.stdout.buffer.write(midiData)
        if counter < max_counter - 1:
            counter += 1
        else:
	        counter = 0
    except EOFError:
        pass
    except KeyboardInterrupt:
        break
