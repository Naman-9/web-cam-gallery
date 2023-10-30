let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");
let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");
let recorderFlag = false;
let filterColor = "transparent";

let recorder;
let chunks = []; // media data in chunks

let constraints = {
    video: true,
    audio: true
}

// navigator ->(global Obj)  tells global browser Info
// mediaDevices -> webApi -- to access Camera, microphones
// getUserMedia -> Method -- prompt to access camera, audio as asked in constraints
// srcObject -> sets or return object - mediaStream, mediaSource, blob, file
// mediaRecorder -> api to record media
navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;

        recorder = new MediaRecorder(stream);   // will instanceniate when we start receiving stream as it is a promise
        recorder.addEventListener("start", (e) => {
            chunks = [];
        })
        recorder.addEventListener("dataavailable", (e) => {
            chunks.push(e.data);
        })
        recorder.addEventListener("stop", (e) => {
            // conversion of mediaChunks data to video
            // Blob : data type represent file type
            let blob = new Blob(chunks, { type: "video/mp4" });

            if (db) {
                let videoId = new ShortUniqueId().rnd();
                let dbTransaction = db.transaction("video", "readwrite");
                let videoStore = dbTransaction.objectStore("video");
                let videoEntry = {
                    id: `vid-${videoId}`,
                    blobData: blob
                }
                videoStore.add(videoEntry);
            }

            // let videoUrl = window.URL.createObjectURL(blob);

            // let a = document.createElement("a");
            // a.href = videoUrl;
            // a.download = "stream.mp4",
            // a.click();
        })
    })

recordBtnCont.addEventListener("click", (e) => {
    filterLayer.style.backgroundColor = "transparent";

    if (!recorder) {  // as recoder runs after stream
        alert("Allow Permissions to start.");
        return;
    }

    recorderFlag = !recorderFlag;

    if (recorderFlag) {       // start recording
        recorder.start();
        startTimer();
        recordBtn.classList.add("scale-record");
    } else {                // stop recording
        recorder.stop();
        stopTimer();
        recordBtn.classList.remove("scale-record");
    }
})


captureBtn.addEventListener("click", (e) => {
    captureBtn.classList.add("scale-capture");
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Filter Image
    tool.fillStyle = filterColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL();

    if (db) {
        let imageId = new ShortUniqueId().rnd();
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id: `img-${imageId}`,
            url: imageURL
        }
        imageStore.add(imageEntry);
    }

    // let a = document.createElement("a");
    // a.href = imageURL;
    // a.download = "image.jpg";
    // a.click();

    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 500);
})




let timerId;
let counter = 0;   // total seconds
let timerCont = document.querySelector(".timer-cont");
let timer = document.querySelector(".timer");

function startTimer() {
    timerCont.style.visibility = "visible";

    function displayTimer() {
        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        totalSeconds = (totalSeconds < 10) ? `0${totalSeconds}` : totalSeconds;

        timer.innerText = `${hours}:${minutes}:${totalSeconds}`
        counter++;
    }
    timerId = setInterval(displayTimer, 1000);
}

function stopTimer() {
    timerCont.style.visibility = "hidden";
    clearInterval(timerId);
    counter = 0;
    timer.innerText = "00:00:00";
}


// Filter logic


allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        filterColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = filterColor;
    })
})

