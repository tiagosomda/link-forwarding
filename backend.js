var ui = {}

function init() {
    var firebaseConfig = {
        apiKey: "AIzaSyAQf2DNsZr4bgR_3WNuLFe8aJ5tAZyWQTM",
        authDomain: "tiago-redirect-url.firebaseapp.com",
        databaseURL: "https://tiago-redirect-url.firebaseio.com",
        projectId: "tiago-redirect-url",
        storageBucket: "tiago-redirect-url.appspot.com",
        messagingSenderId: "705850471887",
        appId: "1:705850471887:web:30f553da1c8a68ff"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Initialize the FirebaseUI Widget using Firebase.
    ui = new firebaseui.auth.AuthUI(firebase.auth());
}

function saveOnBackend(shortlink, url, successCallback) {
    init();
    var loginRedirectionUrl = location.origin+ `/?shortlink=${shortlink}&url=${url}`
    var uiConfig = getSignInConfig(loginRedirectionUrl, shortlink, url, successCallback);
    ui.start('#firebaseui-auth-container', uiConfig);
}

console.log('save-to-database')

function getSignInConfig(loginRedirectionUrl, shortlink, url, successCallback) {
    var uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                console.log('save-to-database: ' + `/?shortlink=${shortlink}&url=${url}`);
                successCallback();
                
                return false;
            },
            uiShown: function () {
                // The widget is rendered.
                // Hide the loader.
                document.getElementById('loader').style.display = 'none';
            }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: loginRedirectionUrl,
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,

        ],
        // // Terms of service url.
        // tosUrl: '<your-tos-url>',
        // // Privacy policy url.
        // privacyPolicyUrl: '<your-privacy-policy-url>'
    };

    return uiConfig;
}

