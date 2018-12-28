$(document).foundation()

// Consts for control button animations
const transTime = 0.5
const controlCount = 3
const buttonSpace = 1 // margin in % of parent container
const breakpoint = 640 // below this is considered "medium" screen

var controlsShown
var currentToneData
var midiData
var currentSong = []
var currentInstruments = []
var instruments = []

// These are according to the MIDI instrument spec:
// https://en.wikipedia.org/wiki/General_MIDI
const instrumentMap =
{
    0: {name: 'piano', volume: 0},
    33: {name: 'guitar-nylon', volume: -9},
    34: {name: 'bass-electric', volume: -9},
    44: {name: 'contrabass', volume: -9},
    129: {name: 'drumkit', volume: -9}
}

// Animates control buttons sliding and resizing to their post-play positions
function transitionInHorizontal(idSelector, position)
{
    var elem = $(idSelector)
    elem.css({ // Kick off anims
        'display': 'block',
        'transition': 'width ' + transTime.toString() + 's, left ' + transTime.toString() + 's',
        '-webkit-transition': 'width ' + transTime.toString() + 's, left ' + transTime.toString() + 's'
    })
    const width = 100 / controlCount - buttonSpace * ((controlCount - 1) / controlCount)
    elem.css({ // Set final anim values
        'width': width.toString() + '%',
        'left': ((width + buttonSpace) * position).toString() + '%'
    })
}

function transitionInVertical(idSelector, position)
{
    var elem = $(idSelector)
    elem.css({
        'display': 'block',
        'width': '100%',
        'transition': 'bottom ' + transTime.toString() + 's',
        '-webkit-transition': 'bottom ' + transTime.toString() + 's'
    })
    elem.css('bottom', ((controlCount - position - 1) * 50).toString() + 'px')
}

// Shows other control buttons when there has been a song played
function showButtons()
{
    if (controlsShown)
    {
        return
    }
    controlsShown = true
    $('#play-button').val('Next')
    if (screen.width > breakpoint)
    {
        transitionInHorizontal('#play-button', 2)
        setTimeout(function()
        {
            transitionInHorizontal('#play-again', 0)
            transitionInHorizontal('#download-button', 1)
        }, transTime * 1000)
        setTimeout(function()
        {
            transitionInHorizontal('#mute-piano', 0)
            transitionInHorizontal('#mute-bass', 1)
            transitionInHorizontal('#mute-drums', 2)
        }, transTime * 2000)
    }
    else
    {
        transitionInVertical('#play-button', 2)
        setTimeout(function()
        {
            transitionInVertical('#play-again', 0)
            transitionInVertical('#download-button', 1)
        }, transTime * 1000)
    }
}

// Plays midi if all instrument samples are loaded
function tryPlayCurrent()
{
    var allLoaded = true
    currentInstruments.forEach(function(element){
        if (element.loaded == false)
        {
            allLoaded = false
        }
    })
    if (allLoaded)
    {
        showButtons() // When we play, make other buttons
        currentSong.forEach(function(part)
        {
            part.start()
        })
    }
}

// Sets up sample-based instruments based on the instrumentMap
function createInstrument(number)
{
    var instrument = SampleLibrary.load({
        instruments: instrumentMap[number].name,
        ext: '.ogg',
        minify: false
    }, function ()
    { // Callback for instrument loaded
        tryPlayCurrent()
    })
    instrument.volume.value = instrumentMap[number].volume
    instrument.number = number
    return instrument
}

// Processes the current midi file to tone.js parts, also loads necessary instruments
function processMidi()
{
    Tone.Transport.bpm.value = currentToneData.header.bpm
    currentToneData.tracks.forEach(function(track)
    {
        if (track.channelNumber != -1) // Tempo / other metadata tracks
        {
            var instrument = instruments.find(function(element)
            {
                // These are percussion, percussion does not have a midi instrument number
                if (track.channelNumber == 9 || track.channelNumber == 10)
                {
                    // we will use > 128 for the instruments with a number
                    return element.number > 128
                }
                // Not percussion, use the instrument number (https://en.wikipedia.org/wiki/General_MIDI)
                return element.number == track.instrumentNumber
            })
            // No instrument found, create one
            if (instrument == null)
            {
                // Handle percussion
                if (track.channelNumber == 9 || track.channelNumber == 10)
                {
                    instrument = createInstrument(129).toMaster()
                    instruments.push(instrument)
                }
                else // Other instruments
                {
                    instrument = createInstrument(track.instrumentNumber).toMaster()
                    instruments.push(instrument)
                }
            }
            if (instrument != null)
            {
                currentInstruments.push(instrument)
                currentSong.push(new Tone.Part(function(time, note)
                {
                    instrument.triggerAttackRelease(note.name, note.duration, time, note.velocity)
                }, track.notes))
            }
        }
    })
}

// Callback handler for data recieved from the server describing midi data
function recieveData(data)
{
    dataArray = data.split(' ')
    midiData = []
    for (var i = 0; i < dataArray.length; ++i)
    {
        midiData += String.fromCharCode(parseInt(dataArray[i]))
    }
    currentToneData = MidiConvert.parse(midiData)
    processMidi()
    tryPlayCurrent()
}

// Get request to generate url
function makeRequest()
{
    var checkpoint = document.forms['requestForm']['checkpoint'].value
    console.log('checkpoint: ' + checkpoint)
    $.get('generate/' + checkpoint, recieveData)
    Tone.Transport.cancel() // Clear all notes (the previous song) from the transport
    currentInstruments = []
    currentSong = []
}

// When play button is pressed, make a get request
$('#requestForm').submit(function (event)
{
    makeRequest()
    event.preventDefault()
})

// Play again button Callback
function playAgain()
{
    Tone.Transport.cancel()
    processMidi()  // calling cancel clears all triggerAttackRelease currently synced to the transport
    tryPlayCurrent()
}

// Download button callback
function download()
{
    // https://blog.logrocket.com/binary-data-in-the-browser-untangling-an-encoding-mess-with-javascript-typed-arrays-119673c0f1fe
    var arrayData = new Uint8Array(midiData.length)
    for (var i = 0; i < midiData.length; ++i)
    {
      arrayData[i] = midiData[i].charCodeAt(0)
    }
    var blob = new Blob([arrayData], {type:'audio/midi'})
    var a = document.createElement('A') // https://stackoverflow.com/questions/1066452/easiest-way-to-open-a-download-window-without-navigating-away-from-the-page
    a.href = URL.createObjectURL(blob) // https://stackoverflow.com/questions/25547475/save-to-local-file-from-blob
    a.download = 'Simphony.mid'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

// Returns true if the instrument was muted, false if unmuted
function toggleMute(instrumentNumber)
{
    for (var i = 0; i < instruments.length; ++i)
    {
        if (instruments[i].number == instrumentNumber)
        {
            if (instruments[i].volume.value == Number.NEGATIVE_INFINITY)
            {
                instruments[i].volume.value = instrumentMap[instruments[i].number].volume
                return false
            }
            else
            {
                instruments[i].volume.value = Number.NEGATIVE_INFINITY
                return true
            }
        }
    }
}

function pianoToggle()
{
    if (toggleMute(0)) // Now muted
      $('#mute-piano').html('Unmute Piano')
    else
      $('#mute-piano').html('Mute Piano')
}

function bassToggle()
{
    if (toggleMute(33)) // Now muted
      $('#mute-bass').html('Unmute Bass')
    else
      $('#mute-bass').html('Mute Bass')
}

function drumsToggle()
{
    if (toggleMute(129)) // Now muted
      $('#mute-drums').html('Unmute Drums')
    else
      $('#mute-drums').html('Mute Drums')
}

Tone.Transport.start() // Keep the transport running always
