/* eslint-disable */
document.getElementById('register').addEventListener('click',  () => {
  var email =document.getElementById('email').value;
  var password =document.getElementById('password').value;

  var poolData = {
    UserPoolId: "", // your user pool id here
    ClientId: "" // your app client id here
  };
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  //sign up for the application
  var attribute = {
    Name : 'email',
    Value : email
  };

  var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(attribute);
  var attributeList = [];

  attributeList.push(attributeEmail);
  var cognitoUser;

  userPool.signUp(email, password, attributeList, null, function(err, result) {
    if (err) {
      alert(err);
      console.log(err);
      return;
    }
    cognitoUser = result.user;
    console.log(cognitoUser);
    var verificationCode = prompt('Please input verification code' ,'');
    console.log("got here mfa required");
    //cognitoUser.sendMFACode(verificationCode, this);
    cognitoUser.confirmRegistration(verificationCode, true, function(err, result) {
      if (err) {
        alert(err);
        return;
      }
      alert(result);
    });
  });
});
