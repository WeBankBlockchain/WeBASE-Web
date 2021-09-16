
function r(num) {
    return parseInt(Math.random() * num)
  }
 function creatBall(text){//将这个类向外暴露，才能引用
   
    this.x = r(380) + 60;
    this.y = r(380) + 60;
    this.r = r(30) + 10;
    this.color = 'rgba(51, 113, 208, 0.2)'
    this.text=text;
   
}
  //画圆
  function drawCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color || "#000";
    ctx.fill()
  }

creatBall.prototype.show=function(){
        
    drawCircle.call(this.x,this.y,this.r,this.color)
  }
  module.exports = creatBall;