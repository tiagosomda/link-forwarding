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
 * the current event playingon the screen
 */
var currentEvent = {}

var eventQueue = []

/*
 * the current message index typing on the screen
 */
var currentMessageIndex = 0;

/*
 * typing delay
 */
var vDelay = 1000;
var hDelay = 30;


/*
 * creates paragraph dom element
 */

 function creteParagraph(appendToElementId, elemetType) {
    var element = document.createElement(elemetType);
    var container = document.getElementById(appendToElementId)
    container.appendChild(element);
    return element;
 }

 function writeIt(ele, object, index, dir) {
    ele.innerHTML += object[index];
    if (dir === 'v') {
        ele.innerHTML += '<br />';
    } else if (index == object.length - 1) {
        endOfMessage();
        return;
    }
 }

 function endOfMessage() {
    currentMessageIndex++;
    if(currentMessageIndex < eventQueue[0].messages.length) {
        type();
    } else {
        currentMessageIndex = 0;
        var action = eventQueue[0].action;
        eventQueue.shift();
        if (action) {
            action();
        }
    }
 }

/*
 * method that performs the typing on the screen
 */
function type(typeEvent) {
    if (typeEvent) {
        eventQueue.push(typeEvent);
    }

    /* 
     * Set Timeout Interval
     *   - If delay is number and > 0 use it
     *   - Defaults: 1s for vert; 150ms for horz
     */
    var dly = (typeof delay === 'number' && delay > 0) ? delay : ((direction === 'v') ? vDelay : hDelay);
    /* If obj is a string then convert to character array */
    var newObj = [];

    newObj = eventQueue[0].messages[currentMessageIndex];

    var elmt = creteParagraph(eventQueue[0].container, 'p');
    /* Loop through Array */
    for (var i = 0; i < newObj.length; i++) {
        /* 
         * Anonymous (Immediately Invoked Function Expression)
         * passing vars elmt, newObj, i, direction 
         */

        (function (e, o, x, d) {
            /* Invoke delay */
            setTimeout(function () {
                writeIt(e, o, x, d); // function we are calling
            }, 
            x * dly); /* multiply to keep constant interval on each loop*/
        })(elmt, newObj, i, direction); // the variables
    }
}
