var hash = '';
var search = ''
if (location.search) {
    search = location.search;
} else if (location.hash) {
    var hash = location.hash.substring(1);
}

function start() {
    var msgs = ['404 Error : Not Found', 'shortlink: ', `[#${hash}]`, 'Create it?'];
    var prompt = createEvent('not-found-msg', msgs, showCreatePrompt);
    type(prompt);
}

function saveOnBackend() {
    console.log('it has been saved to the backend!');
}

function resizable(el, factor) {
    var int = Number(factor) || 7.7;
    function resize() {
        if (el.value) {
            el.style.width = ((el.value.length + 1) * int) + 'px'
        } else {
            el.style.width = ((el.placeholder.length + 1) * int) + 'px'
        }
    }

    attachInputChange(el, resize);
    resize();
}

function attachInputChange(el, action) {
    var e = 'keyup,keypress,focus,blur,change'.split(',');
    for (var i in e) el.addEventListener(e[i], action, false);
}

function displayCreateLink() {
    document.getElementById("create-short-link").style.display = ""
    document.getElementById("create-link-question").style.display = "none"
}

function cleanShortUrlHash(el) {
    var dirty = el.target.value;
    if (dirty) {
        el.target.value = dirty.replace(' ', '-').replace('#', '');
    }
}

function showCreatePrompt() {
    document.getElementById('create-yes').addEventListener('click', createShortlinkPrompt);
    document.getElementById('create-no').addEventListener('click', createGoodByePrompt);
    document.getElementById("create-shortlink-question").style.display = ''
}

function createShortlinkPrompt() {

    // writing 'yes' answer
    document.getElementById("create-shortlink-question").remove();
    var answer = document.createElement('p');
    answer.innerHTML = 'yes'
    answer.classList.add('answer');
    answer.classList.add('input-choice');
    document.getElementById("not-found-msg").append(answer);
    console.log("creating shortlink prompt");

    // creating prompt
    //shortlink-input-url-msg
    var msgs = ['please set the values:']
    var prompt = createEvent('shortlink-input-url-msg', msgs, showCreateShortlinkPrompt);

    document.getElementById('create-button').addEventListener('click', createShortlink);
    document.getElementById("shortlink-input").style.display = ''
    type(prompt);
}

function showCreateShortlinkPrompt() {

    //shortlink-input-fields
    document.getElementById("shortlink-input-fields").style.display = ''
    //create-button
    document.getElementById("create-button").style.display = ''

    var shortlink = document.getElementById('shortlink');
    shortlink.value = hash;
    resizable(shortlink, 7.7);
    attachInputChange(shortlink, cleanShortUrlHash);

    var destinationUrl = document.getElementById('destination-url');
    resizable(destinationUrl, 7.7);
}

function createShortlink() {
    var answer = document.createElement('p');
    answer.innerHTML = 'create'
    answer.classList.add('answer');
    answer.classList.add('input-choice');
    document.getElementById("shortlink-input-fields").append(answer);

    document.getElementById('create-button').style.display = 'none';
    var shortlink = document.getElementById('shortlink');
    var destinationUrl = document.getElementById('destination-url');
    var msgs = [`creating shortlink [${shortlink.value}] --> [${destinationUrl.value}] `];
    var prompt = createEvent('creating-link-msg', msgs, undefined);
    type(prompt);

    login(savingPrompt);
    document.getElementById('404').style.display = 'none';
    document.getElementById('login').style.display = '';
}

function createGoodByePrompt() {
    var msgs = ['Okay! Good luck!'];
    document.getElementById("shortlink-input-fields").style.display = ''
    var goodByePrompt = createEvent('goodbye-msg', msgs, undefined);
    type(goodByePrompt);
}

function savingPrompt() {
    
    var msgs = ['processing...'];
    var prompt = createEvent('creating-link-msg', msgs, undefined);
    type(prompt);

    document.getElementById('404').style.display = '';
    document.getElementById('login').style.display = 'none';

    var shortlink = document.getElementById('shortlink');
    var destinationUrl = document.getElementById('destination-url');

    saveShortlink(shortlink.value, destinationUrl.value);
}
function createEvent(appendToContainer, msgs, endAction) {
    return {
        container: appendToContainer,
        messages: msgs,
        action: endAction
    }
}

/* 
 * Set direction
 *  - 'h'= horizontal, 'v' = vertical
 */
var direction = 'h';
/*
 * Set delay for outputing characters
 *   - 0 is ignored and will use default
 */
var delay = 0;
/*
 * END SETTINGS *
 */

var currentEvent = {}
var k = 0;
var messages = [0];

var vDelay = 1000;
var hDelay = 30;

function type(typeEvent) {
    if (typeEvent) {
        currentEvent = typeEvent;
    }

    if (k >= currentEvent.messages.length) {
        k = 0;
        if (currentEvent.action) {
            currentEvent.action();
        }
        return;
    }

    var str = currentEvent.messages[k];
    /* 
   *      VARS
   */
    /* 
     * Type of element to create 
     *   - String representation
     */
    var el = 'p';
    /* 
     * Set Timeout Interval
     *   - If delay is number and > 0 use it
     *   - Defaults: 1s for vert; 150ms for horz
     */
    var dly = (typeof delay === 'number' && delay > 0) ? delay : ((direction === 'v') ? vDelay : hDelay);
    /* If obj is a string then convert to character array */
    var newObj = [];
    /* Create element */
    var elmt = document.createElement(el);
    /***   END VARS   ***/
    /*
     *     FUNCTIONS
     */
    /* Split string into character array */
    function splitStr(s) {
        s.split('');
        return s;
    }
    /* Write text inside element */
    function writeIt(ele, object, index, dir) {
        /* If vertical then add a <br /> */
        ele.innerHTML += object[index];
        if (dir === 'v') {
            ele.innerHTML += '<br />';
        } else {
            if (index == object.length - 1) {
                k++;
                type();
            }

            return;
        }


    }
    /***   END FUNCTIONS   ***/
    /* Convert obj to character array if string */
    newObj = str;//(Array.isArray(obj)) ? obj : splitStr(obj);
    /* Attach class to element */
    //elmt.className += 'chardelay';
    /* Attach element to document */
    var body = document.getElementById(currentEvent.container)
    body.appendChild(elmt);
    /* Loop through Array */
    for (var i = 0; i < newObj.length; i++) {
        /* Anonymous IIFE passing vars elmt, newObj, i, direction */
        (function (e, o, x, d) {
            /* Invoke delay */
            setTimeout(function () {
                /* Call write function */
                writeIt(e, o, x, d);
            }, x * dly); /* multiply to keep consistant interval on each loop*/
        })(elmt, newObj, i, direction);
    }
}

window.onload = function () {
    console.log("what...")
    if (hash) {
        console.log("hash-start")
        start();
    } else {
        console.log('saving to console: ' + search);
    }
}