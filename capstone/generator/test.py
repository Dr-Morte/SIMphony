import sys, time, random

while (True):
    pathToFile = input()
    time.sleep(random.randint(0,0))
    midi = open('generator/SA2_-_Escape_From_The_City.mid', 'r')
    midiData = midi.buffer.read()

    sys.stdout.buffer.write(midiData)