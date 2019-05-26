function getForwardKey() {
    return location.hash ? location.hash.substring(1) : false;
}

function forwardUrl(key) {
    if(links[key] !== undefined) {
        console.log("forwarding to : " + links[key])
        location.href = links[key]
        return true;
    }

    return false;
}

var key = getForwardKey();
if(key === false || forwardUrl(key) === false)
{
    console.log("no forward found for ["+key+"]")
    location.href = "/404.html#"+key
}