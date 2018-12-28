/**
* @fileoverview A sample library and quick-loader for tone.js
*
* @author N.P. Brosowsky (nbrosowsky@gmail.com)
* https://github.com/nbrosowsky/tonejs-instruments
*/

var SampleLibrary = {
    minify: false,
    ext: '.[mp3|ogg]', // use setExt to change the extensions on all files // do not change this variable //
    baseUrl: '../samples/',
    list: ['bass-electric','bassoon','cello','clarinet','contrabass','flute','french-horn','guitar-acoustic','guitar-electric','guitar-nylon', 'harmonium','harp','organ','piano','saxophone','trombone','trumpet','tuba','violin','xylophone','drumkit'],

    setExt: function (newExt) {
        var i
        for (i = 0; i <= this.list.length - 1; i++) {
            for (var property in this[this.list[i]]) {

                this[this.list[i]][property] = this[this.list[i]][property].replace(this.ext, newExt)
            }


        }
        this.ext = newExt;
        return console.log("sample extensions set to " + this.ext)
    },

    load: function (arg, callback) { // SIMphony edit
        var t, rt, i;
        (arg) ? t = arg: t = {};
        t.instruments = t.instruments || this.list;
        t.baseUrl = t.baseUrl || this.baseUrl;

        // update extensions if arg given
        if (t.ext) {
            if (t.ext != this.ext) {
                this.setExt(t.ext)
            }
            t.ext = this.ext
        }

        rt = {};

        // if an array of instruments is passed...
        if (Array.isArray(t.instruments)) {
            for (i = 0; i <= t.instruments.length - 1; i++) {
                var newT = this[t.instruments[i]];
                //Minimize the number of samples to load
                if (this.minify === true || t.minify === true) {
                    var minBy = 1;
                    if (Object.keys(newT).length >= 17) {
                        minBy = 2
                    }
                    if (Object.keys(newT).length >= 33) {
                        minBy = 4
                    }
                    if (Object.keys(newT).length >= 49) {
                        minBy = 6
                    }

                    var filtered = Object.keys(newT).filter(function (_, i) {
                        return i % minBy != 0;
                    })
                    filtered.forEach(function (f) {
                        delete newT[f]
                    })

                }




                rt[t.instruments[i]] = new Tone.Sampler(
                    newT, {
                        onload: callback, // SIMphony edit
                        baseUrl: t.baseUrl + t.instruments[i] + "/"
                    }

                )
            }

            return rt

            // if a single instrument name is passed...
        } else {
            newT = this[t.instruments];
            console.log(newT)

            //Minimize the number of samples to load
            if (this.minify === true || t.minify === true) {
                minBy = 1;
                if (Object.keys(newT).length >= 17) {
                    minBy = 2
                }
                if (Object.keys(newT).length >= 33) {
                    minBy = 4
                }
                if (Object.keys(newT).length >= 49) {
                    minBy = 6
                }

                filtered = Object.keys(newT).filter(function (_, i) {
                    return i % minBy != 0;
                })
                filtered.forEach(function (f) {
                    delete newT[f]
                })
            }

            var s = new Tone.Sampler(
                newT, {
                    onload: callback, // SIMphony edit
                    baseUrl: t.baseUrl + t.instruments + "/"
                }
            )

            return s
        }

    },

    // Begin SIMphony Edit
    'bass-electric': {
        'A#2': 'As2.[mp3|ogg]',
        'A#3': 'As3.[mp3|ogg]',
        'A#4': 'As4.[mp3|ogg]',
        'A#5': 'As5.[mp3|ogg]',
        'E2': 'E2.[mp3|ogg]',
        'E3': 'E3.[mp3|ogg]',
        'E4': 'E4.[mp3|ogg]',
        'E5': 'E5.[mp3|ogg]',
    },

    'bassoon': {
        'A3': 'A3.[mp3|ogg]',
        'C2': 'C2.[mp3|ogg]',
        'C3': 'C3.[mp3|ogg]',
        'C4': 'C4.[mp3|ogg]',
        'A1': 'A1.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]'
    },

    'cello': {
        'E3': 'E3.[mp3|ogg]',
        'E4': 'E4.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]',
        'A3': 'A3.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]',
        'E2': 'E2.[mp3|ogg]'
    },

    'clarinet': {
        'D3': 'D3.[mp3|ogg]',
        'D4': 'D4.[mp3|ogg]',
        'D5': 'D5.[mp3|ogg]',
        'A#2': 'As2.[mp3|ogg]',
        'A#3': 'As3.[mp3|ogg]',
        'A#4': 'As4.[mp3|ogg]',
    },

    'contrabass': {
        'E1': 'E1.[mp3|ogg]',
        'E2': 'E2.[mp3|ogg]',
        'A1': 'A1.[mp3|ogg]',
        'A#0': 'As0.[mp3|ogg]',
    },

    'flute': {
        'A5': 'A5.[mp3|ogg]',
        'E3': 'E3.[mp3|ogg]',
        'E4': 'E4.[mp3|ogg]',
        'E5': 'E5.[mp3|ogg]',
        'A3': 'A3.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]'
    },

    'french-horn': {
        'D2': 'D2.[mp3|ogg]',
        'D4': 'D4.[mp3|ogg]',
        'D#1': 'Ds1.[mp3|ogg]',
        'A0': 'A0.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]',
        'C1': 'C1.[mp3|ogg]',
        'C3': 'C3.[mp3|ogg]',
    },

    'guitar-acoustic': {
        'A1': 'A1.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]',
        'A3': 'A3.[mp3|ogg]',
        'E1': 'E1.[mp3|ogg]',
        'E2': 'E2.[mp3|ogg]',
        'E3': 'E3.[mp3|ogg]',
    },


    'guitar-electric': {
        'F#2': 'Fs2.[mp3|ogg]',
        'F#3': 'Fs3.[mp3|ogg]',
        'F#4': 'Fs4.[mp3|ogg]',
        'F#5': 'Fs5.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]',
        'A3': 'A3.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]',
        'A5': 'A5.[mp3|ogg]',
    },

    'guitar-nylon': {
        'A2': 'A2.[mp3|ogg]',
        'A3': 'A3.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]',
        'A5': 'A5.[mp3|ogg]',
        'E2': 'E2.[mp3|ogg]',
        'E3': 'E3.[mp3|ogg]',
        'E4': 'E4.[mp3|ogg]',
        'E5': 'E5.[mp3|ogg]'
    },


    'harmonium': {
        'E2': 'E2.[mp3|ogg]',
        'E3': 'E3.[mp3|ogg]',
        'E4': 'E4.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]',
        'A3': 'A3.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]',
    },

    'harp': {
        'E1': 'E1.[mp3|ogg]',
        'E3': 'E3.[mp3|ogg]',
        'E5': 'E5.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]',
        'A6': 'A6.[mp3|ogg]',
    },

    'organ': {
        'F#1': 'Fs1.[mp3|ogg]',
        'F#2': 'Fs2.[mp3|ogg]',
        'F#3': 'Fs3.[mp3|ogg]',
        'F#4': 'Fs4.[mp3|ogg]',
        'F#5': 'Fs5.[mp3|ogg]',
        'A1': 'A1.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]',
        'A3': 'A3.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]',
        'A5': 'A5.[mp3|ogg]',
    },

    'piano': {
        'A1': 'A1.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]',
        'A3': 'A3.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]',
        'A5': 'A5.[mp3|ogg]',
        'A6': 'A6.[mp3|ogg]',
        'E1': 'E1.[mp3|ogg]',
        'E2': 'E2.[mp3|ogg]',
        'E3': 'E3.[mp3|ogg]',
        'E4': 'E4.[mp3|ogg]',
        'E5': 'E5.[mp3|ogg]',
        'E6': 'E6.[mp3|ogg]',
    },

    'saxophone': {
        'E2': 'E2.[mp3|ogg]',
        'E3': 'E3.[mp3|ogg]',
        'E4': 'E4.[mp3|ogg]',
        'A3': 'A3.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]',
    },

    'trombone': {
        'A#2': 'As2.[mp3|ogg]',
        'F1': 'F1.[mp3|ogg]',
        'F2': 'F2.[mp3|ogg]',
        'F3': 'F3.[mp3|ogg]',
        'A#0': 'As0.[mp3|ogg]',
        'A#1': 'As1.[mp3|ogg]'
    },

    'trumpet': {
        'F2': 'F2.[mp3|ogg]',
        'F3': 'F3.[mp3|ogg]',
        'F4': 'F4.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]',
        'A#3': 'As3.[mp3|ogg]',
    },

    'tuba': {
        'A#1': 'As1.[mp3|ogg]',
        'A#2': 'As2.[mp3|ogg]',
        'F0': 'F0.[mp3|ogg]',
        'F1': 'F1.[mp3|ogg]',
        'F2': 'F2.[mp3|ogg]',
        'A#0': 'As0.[mp3|ogg]'
    },

    'violin': {
        'A3': 'A3.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]',
        'A5': 'A5.[mp3|ogg]',
        'A6': 'A6.[mp3|ogg]',
        'E4': 'E4.[mp3|ogg]',
        'E5': 'E5.[mp3|ogg]',
        'E6': 'E6.[mp3|ogg]',
    },

    'xylophone': {
        'C7': 'C7.[mp3|ogg]',
        'G3': 'G3.[mp3|ogg]',
        'G4': 'G4.[mp3|ogg]',
        'G5': 'G5.[mp3|ogg]',
        'G6': 'G6.[mp3|ogg]',
        'C4': 'C4.[mp3|ogg]',
        'C5': 'C5.[mp3|ogg]',
        'C6': 'C6.[mp3|ogg]'
    },

    // Midi numbers to file paths
    // These are according to the MIDI instrument spec:
    // https://en.wikipedia.org/wiki/General_MIDI
    'drumkit': {
        35: 'Kick1.[mp3|ogg]',      // Bass 2
        36: 'Kick1.[mp3|ogg]',      // Bass 1
        37: 'Rimshot1.[mp3|ogg]',   // Rimshot
        38: 'Snare1.[mp3|ogg]',     // Snare 1
        39: 'Clap1.[mp3|ogg]',      // Clap
        40: 'Snare1.[mp3|ogg]',     // Snare 2
        41: 'Tom2.[mp3|ogg]',       // Low Tom 2
        42: 'ClosedHat1.[mp3|ogg]',// Closed Hat
        43: 'Tom2.[mp3|ogg]',       // Low Tom 1
        44: 'OpenHat1.[mp3|ogg]',  // Pedal Hat
        45: 'Tom2.[mp3|ogg]',       // Mid Tom 2
        46: 'OpenHat2.[mp3|ogg]',  // Open Hat
        47: 'Tom2.[mp3|ogg]',       // Mid Tom 1
        48: 'Tom1.[mp3|ogg]',       // High Tom 2
        49: 'Cymbal2.[mp3|ogg]',    // Crash 1
        50: 'Tom1.[mp3|ogg]',       // High Tom 1
        51: 'Cymbal2.[mp3|ogg]',    // Ride 1
    }
    // End SIMphony Edit
}
