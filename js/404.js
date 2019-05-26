function start() {
    var msgs = ['404 Error : Not Found', 'shortlink: ', `[#${hash}]`, 'Create it?'];
    var prompt = createEvent('not-found-msg', msgs, showCreatePrompt);
    type(prompt);
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

    // creating prompt
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

    var msgs = ['checking authentication...'];
    var prompt = createEvent('creating-link-msg', msgs, authenticatePrompt);
    type(prompt);
}

function authenticatePrompt() {
    var shortlink = document.getElementById('shortlink');
    var destinationUrl = document.getElementById('destination-url');
    var callbackUri = `${location.origin}/404.html?hash=${shortlink.value}&url=${destinationUrl.value}`;
    login(loginCallback, callbackUri);
}

function loginCallback() {
    var msgs = ['authenticated...', 'saving to database...'];
    var prompt = createEvent('creating-link-msg', msgs, save);
    type(prompt);
}

function save() {

    document.getElementById('404').style.display = '';
    document.getElementById('login').style.display = 'none';

    var shortlink = document.getElementById('shortlink');
    var destinationUrl = document.getElementById('destination-url');

    saveShortlink(shortlink.value, destinationUrl.value, onSaved);
}

function onSaved(sucess, error) {
    var msgs = []
    var prompt = {}
    var shortlink = document.getElementById('shortlink');
    var destinationUrl = document.getElementById('destination-url');

    if(sucess) {
        msgs = ['saved!','you may now navigate to:', `${location.origin}/#${shortlink.value}`];
    }
    else {

        msgs = ['err...','something went wrong....', 'see developer console...'];
        console.log(`Failed to save shortlink [${shortlink.value}] --> [${destinationUrl.value}] to database`);
        console.log(error);
    }

    prompt = createEvent('goodbye-msg', msgs, undefined);
    type(prompt);
}

function createGoodByePrompt() {
    var msgs = ['Okay! Good luck!'];
    document.getElementById("shortlink-input-fields").style.display = ''
    var goodByePrompt = createEvent('goodbye-msg', msgs, undefined);
    type(goodByePrompt);
}

function createEvent(appendToContainer, msgs, endAction) {
    return {
        container: appendToContainer,
        messages: msgs,
        action: endAction
    }
}


var hash = undefined;
window.onload = function () {
    hash = location.hash ? location.hash.substring(1) : false
    var search = location.search;
    console.log("search on url is: " + search);
    if(search) {
        var searchParams = new URL(location.href).searchParams;
        console.log('hash is: ' + searchParams.get('hash'));
        console.log('url is: ' + searchParams.get('url'));

        var shortlink = document.getElementById('shortlink');
        var destinationUrl = document.getElementById('destination-url');

        shortlink.value = searchParams.get('hash');
        destinationUrl.value = searchParams.get('url');
        loginCallback();
    }
    if (hash) 
    {
        start();
    }
}