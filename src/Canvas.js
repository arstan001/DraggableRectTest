import React, { useRef, useEffect } from "react";

const boxes = [
  { x: 200, y: 220, w: 250, h: 300 },
  { x: 500, y: 220, w: 250, h: 300 },
];

const CIRCLE_X = 15;
const CIRCLE_Y = 15;
const CIRCLE_R = 10;

function Canvas() {
  const canvas = useRef();
  let ctx = null;
  let dragcircle = null;
  let isDown = false;
  let isDownCircle = false;

  let checkmybox=null;
  let checkcircle=["left", "left"];
  let line = null;
  let currentBox = null;

  let startX = null;
  let startY = null;
  // draw rectangle
  const draw = () => {
    ctx.clearRect(
      0,
      0,
      canvas.current.clientWidth,
      canvas.current.clientHeight
    );

    if (line?.x1 && line?.y1 && line?.x2 && line?.y2) {
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.lineWidth = "2";

      var gradient = ctx.createLinearGradient(line.x1, line.y1, line.x2, line.y2);
      gradient.addColorStop("0", "magenta");
      gradient.addColorStop("0.5" ,"blue");
      gradient.addColorStop("1.0", "red");

      ctx.strokeStyle = gradient;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(line.x2, line.y2, CIRCLE_R, 0, 2 * Math.PI);
      ctx.fillStyle = gradient
      ctx.fill()
    }
    boxes.map((info) => drawFillRect(info));
  };

  const drawFillRect = (info, style = {}) => {
    const { x, y, w, h } = info;
    const { backgroundColor = "#333" } = style;
    
    ctx.beginPath();
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, w, h);
    ctx.beginPath();
    ctx.arc(x + CIRCLE_X, y + CIRCLE_Y, CIRCLE_R, 0, 2 * Math.PI);
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + CIRCLE_X+220, y + CIRCLE_Y, CIRCLE_R, 0, 2 * Math.PI);
    ctx.strokeStyle = "white";
    ctx.stroke();   
  };

  const hitBox = (x, y) => {
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      if (
        x >= box.x &&
        x <= box.x + box.w &&
        y >= box.y &&
        y <= box.y + box.w
      ) {
        currentBox = box;
        if (
          x >= box.x + CIRCLE_X - CIRCLE_R &&
          x <= box.x + CIRCLE_X + CIRCLE_R &&
          y >= box.y + CIRCLE_Y - CIRCLE_R &&
          y <= box.y + CIRCLE_Y + CIRCLE_R
        ) {
          isDown = false;
          isDownCircle = true;
          checkmybox=box;
          checkcircle[0]="left";
          line = {
            x1: box.x + CIRCLE_X,
            y1: box.y + CIRCLE_Y,
          };
        }
        else if(
          x >= box.x + CIRCLE_X + 220 - CIRCLE_R &&
          x <= box.x + CIRCLE_X + 220 + CIRCLE_R &&
          y >= box.y + CIRCLE_Y - CIRCLE_R &&
          y <= box.y + CIRCLE_Y + CIRCLE_R
        ){
          isDown = false;
          isDownCircle = true;
          checkmybox=box;
          checkcircle[0]="right"
          line = {
            x1: box.x + CIRCLE_X + 220,
            y1: box.y + CIRCLE_Y,
          };
        } else {
          isDown = true;
          isDownCircle = false;
        }
        break;
      }
    }
  };

  const handleMouseDown = (e) => {
    startX = parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft);
    startY = parseInt(e.nativeEvent.offsetY - canvas.current.clientTop);
    hitBox(startX, startY);
  };

  const handleMouseMove = (e) => {
    if (isDownCircle) {
      const mouseX = parseInt(
        e.nativeEvent.offsetX - canvas.current.clientLeft
      );
      const mouseY = parseInt(e.nativeEvent.offsetY - canvas.current.clientTop);
      line.x2 = mouseX;
      line.y2 = mouseY;
      dragcircle=true;
      draw();
    }

    if (isDown) {
      const mouseX = parseInt(
        e.nativeEvent.offsetX - canvas.current.clientLeft
      );
      const mouseY = parseInt(e.nativeEvent.offsetY - canvas.current.clientTop);
      const dx = mouseX - startX;
      const dy = mouseY - startY;
      startX = mouseX;
      startY = mouseY;
      currentBox.x += dx;
      currentBox.y += dy;
      if (line!==null && checkmybox === currentBox){
      line.x1 = checkcircle[0]==="left" ? currentBox.x + CIRCLE_X : currentBox.x + CIRCLE_X + 220;
      line.y1 = currentBox.y + CIRCLE_Y;
    }
    else if(line!==null && checkmybox!==currentBox){
      line.x2 = checkcircle[1]==="left" ? currentBox.x + CIRCLE_X : currentBox.x + CIRCLE_X + 220;
      line.y2 = currentBox.y + CIRCLE_Y;
    }
      dragcircle=false;
      draw();
    }
  };

  const handleMouseUp = (e) => {
    const xx = parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft);
    const yy = parseInt(e.nativeEvent.offsetY - canvas.current.clientTop);

    if (line?.x1 && line?.y1 && dragcircle) {
      const box2 = boxes.find((item) => item !== currentBox);

      if (
        xx >= box2.x + CIRCLE_X - CIRCLE_R &&
        xx <= box2.x + CIRCLE_X + CIRCLE_R &&
        yy >= box2.y + CIRCLE_Y - CIRCLE_R &&
        yy <= box2.y + CIRCLE_Y + CIRCLE_R
      ) {
        line.x2 = box2.x + CIRCLE_X;
        line.y2 = box2.y + CIRCLE_Y;
        checkcircle[1]="left"
      } 
      else if (
        xx >= box2.x + CIRCLE_X + 220 - CIRCLE_R &&
        xx <= box2.x + CIRCLE_X + 220+ CIRCLE_R &&
        yy >= box2.y + CIRCLE_Y - CIRCLE_R &&
        yy <= box2.y + CIRCLE_Y + CIRCLE_R
      ){
        line.x2 = box2.x + CIRCLE_X + 220;
        line.y2 = box2.y + CIRCLE_Y;
        checkcircle[1]="right"
      }
      else {
        line=null;
      }
    }

    draw();

    isDownCircle = false;
    isDown = false;
    currentBox = null;
  };

  useEffect(() => {
    ctx = canvas.current.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    draw();
  }, []);

  return (
    <canvas
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      ref={canvas}
    ></canvas>
    );
}

export default Canvas;