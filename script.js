const mainContainer = document.querySelector(".main-container"),
      ctrlsContainer = mainContainer.querySelector(".controls-container"),
      videoMaterial = mainContainer.querySelector("video"),
      playPauseBtn = mainContainer.querySelector(".play-pause i"),
      skipBackward = mainContainer.querySelector(".skip-backward"),
      skipForward = mainContainer.querySelector(".skip-forward"),
      progressTrack = mainContainer.querySelector(".progress-area"),
      progressBar = progressTrack.querySelector(".progress-bar"),
      progressThumb = progressBar.querySelector(".bar-head"),
      volumeBtn = mainContainer.querySelector(".video-volume i"),
      volumeBar = mainContainer.querySelector(".volume-bar-container"),
      volTrack = volumeBar.querySelector(".volume-bar-track"),
      volumeThumb = volumeBar.querySelector(".vol-thumb"),
      volumeSlider = volumeBar.querySelector(".vol-slider"),
      playbackCont = mainContainer.querySelector(".playback-content"),
      playSpeedBtn = playbackCont.querySelector(".playback-speed"),
      speedOptions = playbackCont.querySelector(".speed-options"),
      picInPicBtn = mainContainer.querySelector(".pic-in-pic span"),
      fullScrnBtn = mainContainer.querySelector(".fullscreen");
      

let timer;
const hideControls = () => {
    if (videoMaterial.paused) return;
    timer = setTimeout( () => {
        ctrlsContainer.dataset.hide = "true";
    }, 1000);
};
hideControls();

addEventListener("mousemove", () => {
    ctrlsContainer.dataset.hide = "false";
    clearTimeout(timer);
    hideControls();
});

playPauseBtn.addEventListener("click", () => {
    videoMaterial.paused ? videoMaterial.play() : videoMaterial.pause();
    
});

skipBackward.addEventListener("click", () => {
    videoMaterial.currentTime -= 5;
});

skipForward.addEventListener("click", () => {
    videoMaterial.currentTime += 5;
});

/* VOLUME */
volumeBtn.parentElement.addEventListener("click", () => {
    if (volumeBtn.parentElement.dataset.active === "false") {
        volumeBar.style.opacity = "1";
        volumeBar.style.pointerEvents = "auto";
        volumeBtn.parentElement.style.backgroundColor = "hsla(0, 100%, 50%, 0.45)";
        volumeBtn.parentElement.dataset.active = "true";
    } else {
        volumeBar.style.opacity = "0";
        volumeBar.style.pointerEvents = "none";
        volumeBtn.parentElement.style.backgroundColor = "hsla(210, 100%, 95%, 0.35)";
        volumeBtn.parentElement.dataset.active = "false"
    }
});

volumeBtn.parentElement.addEventListener("mouseenter", (event) => {
    if (event.target.dataset.active === "false") {
        event.target.style.backgroundColor = "hsla(0, 100%, 50%, 0.45)";
        volumeBar.style.opacity = "1";
        volumeBar.style.pointerEvents = "auto";
    }
});

volumeBtn.parentElement.addEventListener("mouseleave", (event) => {
    if (event.target.dataset.active === "false") {
        event.target.style.backgroundColor = "hsla(210, 100%, 95%, 0.35)";
        volumeBar.style.opacity = "0";
        volumeBar.style.pointerEvents = "none";
    }
});

let volDrag = false;
volTrack.addEventListener("mousedown", (event) => {
    if (!volDrag) {
        volDrag = true;
        videoMaterial.volume = event.offsetX / volTrack.clientWidth;
    }
});
volumeThumb.addEventListener("mousedown", () => { volDrag = true; });
addEventListener("mouseup", () => { volDrag = false; });

function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

addEventListener("mousemove", (event) => {
    if (volDrag) {
        let volTrackOffset = offset(volTrack).top - event.clientY;
        volTrackOffset += volTrack.clientWidth;
        if (volTrackOffset <= 0) {volTrackOffset = 0;}
        else if (volTrackOffset > volTrack.clientWidth) { volTrackOffset = volTrack.clientWidth; }
        videoMaterial.volume = volTrackOffset / volTrack.clientWidth;
    }
});

videoMaterial.addEventListener("volumechange", (event) => {
    let currVolume = event.target.volume;
    volumeSlider.style.width = `${currVolume * 100}%`;
    let volBtnLst = volumeBtn.classList;
    if (currVolume===0) {
        volBtnLst.replace(volBtnLst.item(1), "fa-volume-xmark");
    } else if (currVolume <= 0.5) {
        volBtnLst.replace(volBtnLst.item(1), "fa-volume-low");
    } else {
        volBtnLst.replace(volBtnLst.item(1), "fa-volume-high");
    }
});

/* ############################# */

videoMaterial.addEventListener("click", () => {
    videoMaterial.paused ? videoMaterial.play() : videoMaterial.pause();
});

videoMaterial.addEventListener("play", () => {
    playPauseBtn.classList.replace("fa-play", "fa-pause");
});

videoMaterial.addEventListener("pause", () => {
    playPauseBtn.classList.replace("fa-pause", "fa-play");
});

let vidDrag = false;
progressTrack.addEventListener("mousedown", (event) => {
    if (!vidDrag) {
        vidDrag = true;
        videoMaterial.currentTime = (event.offsetX / progressTrack.clientWidth) * videoMaterial.duration;
    }
});
progressThumb.addEventListener("mousedown", () => { vidDrag = true; });
addEventListener("mouseup", () => { vidDrag = false; });

addEventListener("mousemove", (event) => {
    if (vidDrag) {
        let progTrackOffset = event.clientX - offset(progressTrack).left;
        if (progTrackOffset <= 0) {progTrackOffset = 0;}
        else if (progTrackOffset > progressTrack.clientWidth) { progTrackOffset = progressTrack.clientWidth; }
        videoMaterial.currentTime = (progTrackOffset / progressTrack.clientWidth) * videoMaterial.duration;
    }
});

videoMaterial.addEventListener("timeupdate", (event) => {
    let { currentTime, duration } = event.target;
    let percentage = (currentTime / duration) * 100;
    progressBar.style.width = `${percentage}%`;
    let seconds = Math.floor(currentTime % 60),
        minutes = Math.floor(currentTime / 60),
        totalSecs = Math.floor(duration % 60),
        totalMins = Math.floor(duration / 60), 
        videoTimer = mainContainer.querySelector(".video-timer");
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    totalSecs = (totalSecs < 10) ? '0' + totalSecs : totalSecs;
    totalMins = (totalMins < 10) ? '0' + totalMins : totalMins;
    videoTimer.firstElementChild.innerHTML = `${minutes}:${seconds}`;
    videoTimer.lastElementChild.innerHTML = `${totalMins}:${totalSecs}`;
    progressBar.querySelector(".bar-time").innerHTML = `${minutes}:${seconds}`;
});

/* PLAYBACK SPEED */
playSpeedBtn.addEventListener("click", () => {
    if (playSpeedBtn.dataset.active === "false") {
        speedOptions.style.opacity = "1";
        speedOptions.style.pointerEvents = "auto";
        playSpeedBtn.style.backgroundColor = "hsla(0, 100%, 50%, 0.45)";
        playSpeedBtn.dataset.active = "true";
    } else {
        speedOptions.style.opacity = "0";
        speedOptions.style.pointerEvents = "none";
        playSpeedBtn.style.backgroundColor = "hsla(210, 100%, 95%, 0.35)";
        playSpeedBtn.dataset.active = "false"
    }
});

playSpeedBtn.addEventListener("mouseenter", (event) => {
    if (event.target.dataset.active === "false") {
        event.target.style.backgroundColor = "hsla(0, 100%, 50%, 0.45)";
        speedOptions.style.opacity = "1";
        speedOptions.style.pointerEvents = "auto";
    }
});

playSpeedBtn.addEventListener("mouseleave", (event) => {
    if (event.target.dataset.active === "false") {
        event.target.style.backgroundColor = "hsla(210, 100%, 95%, 0.35)";
        speedOptions.style.opacity = "0";
        speedOptions.style.pointerEvents = "none";
    }
});

speedOptions.querySelectorAll("span").forEach( option => {
    option.addEventListener("click", (event) => {
        speedOptions.querySelectorAll("span").forEach( option => option.dataset.active = "false" )
        event.target.dataset.active = "true";
        event.target.dataset
        if (event.target.innerHTML === "Normal") {
            videoMaterial.playbackRate = 1;
        } else {
            videoMaterial.playbackRate = event.target.innerHTML;
        }
        
    })
});

/* SCREEEN VIEW*/
picInPicBtn.addEventListener("click", () => {
    videoMaterial.requestPictureInPicture();
});

fullScrnBtn.addEventListener("click", (event) => {
    if (fullScrnBtn.dataset.active === "false") {
        fullScrnBtn.firstElementChild.classList.replace("fa-expand", "fa-compress");
        fullScrnBtn.dataset.active = "true"
        mainContainer.requestFullscreen();
    } else {
        fullScrnBtn.firstElementChild.classList.replace("fa-compress" ,"fa-expand");
        fullScrnBtn.dataset.active = "false"
        document.exitFullscreen();
    }
    
});

