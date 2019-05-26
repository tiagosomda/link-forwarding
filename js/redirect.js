
window.onload = function () {
    
    // handles get forward url return value
    function redirectCallback(value) {
        if(value && value.url) {
            // value exists - perform url redirection
            location.href = value.url
        } else {
            // value does not exists - go to 404 page
            location.href = "/404.html#"+hash
        }
    }

    // retrieves hash value from url
    var hash = location.hash ? location.hash.substring(1) : false
    
    // retrieves redirect object from backend
    getRedirect(hash, redirectCallback)
}