window.onload = function () {

    function getForwardKey() {
        return location.hash ? location.hash.substring(1) : false;
    }

    function handleValue(value) {
        if(value) {
            location.href = value.redirectTo;
        } else {
            location.href = "/404.html#"+key
        }
    }

    var key = getForwardKey();
    getHash(key, handleValue);
}