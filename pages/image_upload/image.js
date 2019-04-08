/* eslint-disable */
var accessKeyId;
var secretAccessKey;
var sessionToken;
function readURL(input) {
  if (input.files && input.files[0]) {
    ProcessImage(input);
    const reader = new FileReader()

    reader.onload = function (e) {
      $('#blah').attr('src', e.target.result)
    }

    reader.readAsDataURL(input.files[0])
  }
}

document.getElementById('submitImage').addEventListener('click',  () => {
  window.location.href = 'pages/music_play/music_list.html'
})

//Calls DetectFaces API and shows estimated ages of detected faces
function DetectFaces(imageData) {
  AWS.config.region = 'us-east-2'; // Region

  var rekognition = new AWS.Rekognition({region: AWS.config.region});
  var params = {
    Image: {
      Bytes: imageData
    },
    Attributes: [
      'ALL',
    ]
  };
  rekognition.detectFaces(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      console.log(data.FaceDetails);
      var emotions = data.FaceDetails[0].Emotions;
    }
  });
}

//Loads selected image and unencodes image bytes for Rekognition DetectFaces API
function ProcessImage(control) {
  AnonLog();
  var file = control.files[0];

  // Load base64 encoded image
  var reader = new FileReader();
  reader.onload = (function (theFile) {
    return function (e) {
      var img = document.createElement('img');
      var image = null;
      img.src = e.target.result;
      var jpg = true;
      try {
        image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);

      } catch (e) {
        jpg = false;
      }
      if (jpg == false) {
        try {
          image = atob(e.target.result.split("data:image/png;base64,")[1]);
        } catch (e) {
          alert("Not an image file Rekognition can process");
          return;
        }
      }
      //unencode image bytes for Rekognition DetectFaces API
      var length = image.length;
      imageBytes = new ArrayBuffer(length);
      var ua = new Uint8Array(imageBytes);
      for (var i = 0; i < length; i++) {
        ua[i] = image.charCodeAt(i);
      }
      //Call Rekognition
      DetectFaces(imageBytes);
    };
  })(file);
  reader.readAsDataURL(file);
}

//Provides anonymous log on to AWS services
function AnonLog() {
  AWS.config.region = 'us-east-2'; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    region: 'us-east-2',
    IdentityPoolId: 'us-east-2:73b9dc02-8619-4504-87b4-a36a820226b4'
  });
  // Configure the credentials provider to use your identity pool
  // Make the call to obtain credentials
  AWS.config.credentials.get(function () {
    // Credentials will be available when this function is called.
    accessKeyId = AWS.config.credentials.accessKeyId;
    secretAccessKey = AWS.config.credentials.secretAccessKey;
    sessionToken = AWS.config.credentials.sessionToken;
  });


}
