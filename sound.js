window.addEventListener('click', keyDownFunction)

window.addEventListener("keydown", keyDownFunction)
function playNote(frequency, duration)
    {
        const ctx = new AudioContext()
        const osc = ctx.createOscillator()
        osc.connect(ctx.destination)
        osc.type = 'square';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime)
        osc.start()
        console.log(1)
        setTimeout(
            function() {
            osc.stop();
            }, duration);
    }
function keyDownFunction(keyboardEvent){

	var keyDown = keyboardEvent.key
    switch (keyDown) {
        case keyDown = "a":
            playNote(440, 400)
            break;
        case keyDown = "b":
            playNote(493,400)
                break;
        case keyDown = "c":
            playNote(261.63	,400)

            break;
        case keyDown = "d":
            playNote(293.66	,400)

            break;
        case keyDown = "e":
            playNote(329.63	,400)

            break;
        case keyDown = "f":
            playNote(349,400)

            break;
        case keyDown = "g":
            playNote(392,400)

            break;
        case keyDown = "m": 
            gain = 0.0000000001
    }

}