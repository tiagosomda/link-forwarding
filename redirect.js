function getForwardKey() {
    var search = location.search;
    if(search && search.startsWith("?")) {
        return search.substring(1)
    }

    return false;
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
}