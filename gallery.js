var mImages = [];
var mCurrentIndex = 0;

// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame       || 
           window.webkitRequestAnimationFrame || 
           window.mozRequestAnimationFrame    || 
           window.oRequestAnimationFrame      || 
           function(callback) { window.setTimeout(callback, 1000 / 60); };
})();

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame(animate);
    var currentTime = new Date().getTime();
    if (mLastFrameTime === 0) {
        mLastFrameTime = currentTime;
    }
  
    if ((currentTime - mLastFrameTime) > mWaitTime) {
        swapPhoto();
        mLastFrameTime = currentTime;
    }
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

function swapPhoto() {
    if (mImages.length === 0) {
        console.error("No images loaded. Check JSON file.");
        return;
    }

    if (mCurrentIndex >= mImages.length) {
        mCurrentIndex = 0;
    }
    if (mCurrentIndex < 0) {
        mCurrentIndex = mImages.length - 1;
    }

    console.log("Swapping photo:", mImages[mCurrentIndex]); // Debugging
    document.getElementById('photo').src = mImages[mCurrentIndex].img;

    var unit = document.getElementsByClassName('unitName');
    if (unit.length > 0) unit[0].innerHTML = "Unit Name: " + mImages[mCurrentIndex].unitName;

    var color = document.getElementsByClassName('unitColor');
    if (color.length > 0) color[0].innerHTML = "Unit Color: " + mImages[mCurrentIndex].unitColor;

    var date = document.getElementsByClassName('dateReleased');
    if (date.length > 0) date[0].innerHTML = "Date Released: " + mImages[mCurrentIndex].dateReleased;

    mLastFrameTime = 0;
    mCurrentIndex += 1;

    console.log('swap photo');
}

function iterateJSON(mJson) {
    const imagesArray = mJson.images; // Access the images array
    for (let x = 0; x < imagesArray.length; x++) {
        let image = new GalleryImage();
        image.unitName = imagesArray[x].unitName;
        image.unitColor = imagesArray[x].unitColor;
        image.dateReleased = imagesArray[x].dateReleased;
        image.img = imagesArray[x].imgPath;
        mImages.push(image);
    }
}

function GalleryImage() {
    this.unitName = "";
    this.unitColor = "";
    this.dateReleased = "";
    this.img = "";
}

// Holds the retrieved JSON information
var mJson;

// URL for the JSON to load by default
var mUrl = 'images.json';

function fetchJSON() {
    var mRequest = new XMLHttpRequest();
    mRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            mJson = JSON.parse(mRequest.responseText);
            iterateJSON(mJson);
            if (mImages.length > 0) {
                swapPhoto(); // Show the first image immediately
            }
        }
    };
    mRequest.open("GET", mUrl, true);
    mRequest.send();
}

$(document).ready(function() {
    $("#nextPhoto").position({
        my: "right bottom",
        at: "right bottom",
        of: "#nav"
    });

    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams) {
        console.log(`${key}: ${value}`);
        mUrl = value;
    }

    if (mUrl === undefined) {
        mUrl = 'JSON-Gallery-main\gallery.js';
    }

    fetchJSON();
});

// Debugging log when the window loads
window.addEventListener('load', function() {
    console.log('window loaded');
}, false);

function toggleDetails() {
    if ($(".moreIndicator").hasClass("rot90")) {
        $(".moreIndicator").removeClass("rot90").addClass("rot270");
    } else {
        $(".moreIndicator").removeClass("rot270").addClass("rot90");
    }
    $(".details").slideToggle("slow", "linear");
}
