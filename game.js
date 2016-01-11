document.addEventListener("DOMContentLoaded", function(event) {

  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.rect(40, 40, 50, 50);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();

});
