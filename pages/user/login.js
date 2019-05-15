/* eslint-disable */

document.getElementById('signin').addEventListener('click',  () => {
  var email =document.getElementById('email').value;
  var password =document.getElementById('password').value;

  var mythis = this;
  var currentAccessKey="";
  var currentSecretKey="";
  var currentSessionToken="";

  var poolData = {
    UserPoolId: "us-east-2_UIHrP6yV8", // your user pool id here
    ClientId: "55quruuf2d92mvq1ghqkfd0vrg" // your app client id here
  };

  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  var userData = {
    Username: email, // your username here "wsun314@gmail.com"
    Pool: userPool
  };
  var authenticationData = {
    Username: email,
    Password: password
  };

  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );

  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function(result) {
      console.log('You are now logged in.');
      var accessToken = result.getAccessToken().getJwtToken();
      var temp = result.getIdToken().getJwtToken();//this is the correct one that should be passed to api gateway
      console.log("this is id token");
      console.log(temp);
      console.log(accessToken);
      console.log(result);
      // Add the User's Id Token to the Cognito credentials login map.
      AWS.config.update({
        region: 'us-east-2'
      });
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:dec9b5cd-cdc1-4909-82a5-49d814bb3c7f',
        Logins: {
          'cognito-idp.us-east-2.amazonaws.com/us-east-2_UIHrP6yV8': result.getIdToken().getJwtToken()
        }
      });
      AWS.config.credentials.refresh((error) => {
        if (error) {
          console.log("got error");
          console.error(error);
        } else {
          currentAccessKey = AWS.config.credentials.accessKeyId;
          currentSecretKey = AWS.config.credentials.secretAccessKey;
          currentSessionToken = AWS.config.credentials.sessionToken;
          mythis.currentAccessKey=currentAccessKey;
          mythis.currentSecretKey=currentSecretKey;
          mythis.currentSessionToken=currentSessionToken;
          alert('Login Successfully!');
          sessionStorage.setItem('login_statues', 'true');
          sessionStorage.setItem('login_user', email);
          window.location.href = "../../index.html";

        }
      });
    },
    onFailure: function(err) {
      alert(err);
    }
  });
});
