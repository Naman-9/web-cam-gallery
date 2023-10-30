setTimeout(() => {
    if (db) {

        // video retieval

        let videoDbTransaction = db.transaction("video", "readonly");

        let videoStore = videoDbTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");

            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", videoObj.id);
                let url = URL.createObjectURL(videoObj.blobData);

                mediaElem.innerHTML = `
                <div class="media">
                <video src="${url}" autoplay loop></video>
                </div>
                <div class="download action-btn">
                    Download
                </div>
                <div class="delete action-btn">
                    Delete
                </div>`;

                galleryCont.appendChild(mediaElem);

                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListner);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListner);

            })
        }

        //image retieal
        let imageDbTransaction = db.transaction("image", "readonly");

        let imageStore = imageDbTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");

            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", imageObj.id);
                let url = imageObj.url;

                mediaElem.innerHTML = `
                <div class="media">
                <image src="${url}" />
            </div>
                <div class="download action-btn">
                    Download
                </div>
                <div class="delete action-btn">
                    Delete
                </div>`;

                galleryCont.appendChild(mediaElem);

                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListner);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListner);

            })
        }

    }
}, 1000);

function deleteListner(e) {
    // DB removal
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {

        let videoDbTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDbTransaction.objectStore("video");
        videoStore.delete(id);
    }

    if (type === "img") {
        let imageDbTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDbTransaction.objectStore("image");
        imageStore.delete(id);
    }

    // Ui removal
    e.target.parentElement.remove();
}

function downloadListner(e) {
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);

    if (type === "vid") {
        let videoDbTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDbTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;

            let videoUrl = URL.createObjectURL(videoResult.blobData);

            let a = document.createElement("a");
            a.href = videoUrl;
            a.download = "video.mp4";
            a.click();
        }
        videoRequest.onerror = (e) => {
            console.error("Error fetching video data:", e.target.error);
        };

    } else if (type === "img") {
        let imageDbTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDbTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;

            let a = document.createElement("a");
            a.href = imageResult.url;
            a.download = "image.jpg";
            a.click();
        }
        imageRequest.onerror = (e) => {
            console.error("Error fetching image data:", e.target.error);
        };
    }
}