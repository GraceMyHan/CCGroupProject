/* eslint-disable */
//used for change username on sidebar and login logout button
var login_status = sessionStorage.getItem('login_statues');
var login_user = "";

$(document).ready(function() {
  if(login_status === 'true'){
    login_user = sessionStorage.getItem('login_user');
    $("#username").html(login_user);
    $("#login").hide();
    $("#logout").show();
    console.log("changed");
  }
});

$("#logout").click(function(){
  sessionStorage.setItem('login_statues', 'false');
  sessionStorage.setItem('login_user', "");
  window.location.href = "../../index.html";
  $("#login").show();
  $("#logout").hide();
});
