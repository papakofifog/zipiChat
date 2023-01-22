import {} from './handleRequest'

gapi.load('auth2', function() {
    gapi.auth2.init({
        client_id: 'YOUR_CLIENT_ID',
        scope: 'https://www.googleapis.com/auth/userinfo.email'
    });
});

document.querySelector('signin-button').addEventListener('click', function(){
    gapi.auth2.getAuthInstance().signIn();
})

gapi.auth2.getAuthInstance().isSignedIn.listen(function(isSignedIn) {
    if (isSignedIn) {
        let authResponse = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse();
        let code = authResponse.code;
        // send the code to your server to exchange it for an access token


    }

});

function

    
