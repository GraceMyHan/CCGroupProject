/* eslint-disable */
var accessKeyId;
var secretAccessKey;
var sessionToken;
// var emotions_param=[{"Type": "", "Confidentce":0},{"Type": "", "Confidentce":0},{"Type": "", "Confidentce":0}];
var filename = '';
var file=null;
var encoded = null;
var fileExt = null;

$("#submitImage").show();

AWS.config.update({
  accessKeyId : 'AKIA367KUMJNI4YKD7HW',
  secretAccessKey : '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',
  region: 'us-east-2'
});

function upload(){
  //One way to upload directly to s3 bucket.
  var bucket = new AWS.S3({params: {Bucket: 'color-and-sound'}});

  if (file) {
    var params = {
      Key: 'images/'+filename, ContentType: file.type, Body: file,  ACL: 'public-read'
    };

    bucket.upload(params, function(err, data) {
      if (err) {
        return alert('There was an error uploading your photo: ', err.message);
      }

      sessionStorage.setItem("song-img", "https://s3.us-east-2.amazonaws.com/color-and-sound/"+data.key);
      alert('Successfully uploaded photo.');

      var xhr = new XMLHttpRequest();
      xhr.open("GET", "https://46sekle1gj.execute-api.us-east-2.amazonaws.com/firstStage/upload?name="+data.Bucket+"&key="+data.key);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function (event) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.response);
            sessionStorage.setItem("emotion1",data[0].Type);
          } else {
            console.error(xhr.statusText);
          }
          window.location.href = 'pages/music_play/music_list.html';
        }
      };
      xhr.send();


    });
  }
  return false;
}

function readURL(input) {
  var fileForRek = input;
  if (input.files && input.files[0]) {
     //ProcessImage(fileForRek);
    const reader = new FileReader();

    filename = input.files[0].name;
    console.log(filename);
    fileExt = filename.split('.').pop();

    var onlyname = filename.replace(/\.[^/.]+$/, "");
    var finalName = onlyname + "_" + Date.now() + "." + fileExt;
    filename = finalName;

    reader.onload = function (e) {
      $('#blah').attr('src', e.target.result);
      encoded = $('#blah')[0].outerHTML;
    };
    file = input.files[0];
    console.log(file);
    reader.readAsDataURL(input.files[0]);
  }
}

document.getElementById('submitImage').addEventListener('click',  () => {
  upload();
  // window.location.href = 'pages/music_play/music_list.html';
});
