let totalSeconds = 300;
let remaining = 300;
let timer = null;

const display = document.getElementById("timer");
const status = document.getElementById("status");

function updateDisplay(){

    let m = Math.floor(remaining / 60);
    let s = remaining % 60;

    display.textContent =
        String(m).padStart(2,"0") + ":" +
        String(s).padStart(2,"0");

    display.classList.remove("warning","danger");

    if(remaining <= 60 && remaining > 10){
        display.classList.add("warning");
    }

    if(remaining <= 10){
        display.classList.add("danger");
    }
}

function startTimer(){

    if(timer) return;

    status.textContent = "計測中";

    timer = setInterval(()=>{

        remaining--;

        updateDisplay();

        if(remaining <= 0){

            clearInterval(timer);
            timer = null;

            status.textContent = "終了！";

            const audio = new Audio("sounds/bell.mp3");

            audio.play().catch(error => {
                console.error(error);
            });
        }

    },1000);

}

function pauseTimer(){

    clearInterval(timer);
    timer = null;

    status.textContent = "一時停止";

}

function resetTimer(){

    pauseTimer();

    remaining = totalSeconds;

    updateDisplay();

    status.textContent = "";

}

function preset(min){

    totalSeconds = min * 60;
    remaining = totalSeconds;

    updateDisplay();

}

function setCustom(){

    let min = parseFloat(document.getElementById("minutes").value);

    if(isNaN(min) || min <= 0) return;

    preset(min);

}

function fullscreen(){

    document.documentElement.requestFullscreen();

}

function beep(){

    const audio = new (window.AudioContext || window.webkitAudioContext)();

    const osc = audio.createOscillator();

    const gain = audio.createGain();

    osc.connect(gain);
    gain.connect(audio.destination);

    osc.frequency.value = 800;

    osc.start();

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audio.currentTime + 1
    );

    osc.stop(audio.currentTime + 1);

}

updateDisplay();