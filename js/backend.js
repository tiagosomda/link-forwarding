var ui = undefined
var currentUser = undefined;
init()
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

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            currentUser = user;
            console.log('user is signed in');
        } else {
            // No user is signed in.
            console.log('user is NOT signed in');
        }
    });
}

function currentUserId() {
    if (currentUser) {
        return currentUser.uid;
    }

    return null;
}

function login(successCallback, loginCallbackUri) {
    var user = currentUserId();

    if (user) {
        successCallback();
    }
    else {
        document.getElementById('404').style.display = 'none';
        document.getElementById('login').style.display = '';

        var uiConfig = getSignInConfig(successCallback, loginCallbackUri);
        ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start('#firebaseui-auth-container', uiConfig);
    }
}

function saveShortlink(shortlink, url, onCompleted) {
    var uid = currentUserId();
    if (uid) {
        firebase.database().ref(`${shortlink}/`).set({
            uid: uid,
            url: url
        }).then(function () {
            onCompleted(true);
        })
            .catch(function (error) {
                console.error('Synchronization failed');
                onCompleted(false, error)
            });
    } else {
        console.error('user is not logged in');
        onCompleted(false, 'user is not logged in');
    }
}

function getRedirect(shortlink, callback) {
    firebase.database().ref(shortlink + '/').once('value').then(function (snapshot) {
        var value = snapshot.val();
        console.log(value);
        if (callback)
            callback(value);
    });
}

function getSignInConfig(successCallback, callbackUri) {

    var uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.                
                //successCallback();
                return true;
            },
            uiShown: function () {
                // The widget is rendered.
                // Hide the loader.
                document.getElementById('loader').style.display = 'none';
            }
        },
        queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'redirect',
        signInSuccessUrl: callbackUri,
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        //signInSuccessWithAuthResult: callbackUri,
        // // Terms of service url.
        // tosUrl: '<your-tos-url>',
        // // Privacy policy url.
        // privacyPolicyUrl: '<your-privacy-policy-url>'
    };

    return uiConfig;
}

