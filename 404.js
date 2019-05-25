console.log("not-found");
var hash = '';
if(location.hash) {
    var hash = location.hash.substring(1);
}

function resizable (el, factor) {
    var int = Number(factor) || 7.7;
    function resize() {
        if(el.value) {
            el.style.width = ((el.value.length+1) * int) + 'px'
        } else {
            el.style.width = ((el.placeholder.length+1) * int) + 'px'
        }
    }

    attachInputChange(el, resize);
    resize();
}

function attachInputChange(el, action) {
    var e = 'keyup,keypress,focus,blur,change'.split(',');
    for (var i in e) el.addEventListener(e[i],action,false);
}

function displayCreateLink() {
    document.getElementById("create-short-link").style.display = ""
    document.getElementById("create-link-question").style.display = "none"
}

function cleanShortUrlHash(el) {
    var dirty = el.target.value;
    if(dirty)
    {
        el.target.value = dirty.replace(' ', '-').replace('#', '');
    }
}

window.onload = function () {
    document.getElementById('short-link-not-found').text = "#"+hash;
    var originUrl = document.getElementById('origin-url')
    originUrl.textContent = location.origin;
    var newLink = document.getElementById('new-link');
    var newHash = document.getElementById('new-hash');

    newHash.value = hash;

    resizable(newHash, 12);
    resizable(newLink, 12);

    document.getElementById('yes').addEventListener('click', displayCreateLink);

    attachInputChange(newHash, cleanShortUrlHash);
}
