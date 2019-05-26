var ui = undefined
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

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log('user is signed in');
        } else {
          // No user is signed in.
          console.log('user is NOT signed in');
        }
      });

    // Initialize the FirebaseUI Widget using Firebase.
    //firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)l
    ui = new firebaseui.auth.AuthUI(firebase.auth());
}


function login(successCallback) {
    var user = firebase.auth().currentUser;

    if(user)
    {
        successCallback();
    }
    else 
    {
        document.getElementById('404').style.display = 'none';
        document.getElementById('login').style.display = '';
        
        var uiConfig = getSignInConfig(successCallback);
        ui.start('#firebaseui-auth-container', uiConfig);
    }
}

function saveShortlink(shortlink, url, onCompleted) {
    //var database = firebase.database();

    firebase.database().ref(shortlink+'/').set({
        hash: shortlink,
        redirectTo: url
      }).then(function() {
        onCompleted(true);
      })
      .catch(function(error) {
          console.log('Synchronization failed');
          onCompleted(false, error)
      });
}

function getHash(shortlink, callback) {
    firebase.database().ref(shortlink+'/').once('value').then(function(snapshot) {
        var value = snapshot.val();
        console.log(value);
        if(callback)
            callback(value);
    });
}

function getSignInConfig(successCallback) {
    var uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.                
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
        //signInSuccessUrl: loginRedirectionUrl,
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

