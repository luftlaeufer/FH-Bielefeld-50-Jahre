const sketch1 = (p) => {

  let amount = 50;
  let positions = [];
  let dimensions = [];
  let rotations = [];
  let colors = [];
  let p5font;
  p.destroySketch = false;

function setCanvas() {
    /* set canvas dimensions according to 19,5 : 9 ==> iPhone11 ration */
    let wh = window.innerHeight;
    let ww = wh / 2.166666;
    return {
      x: ww,
      y: wh
    }
  }
  
  p.windowResized = function () {
    p.resizeCanvas(setCanvas().x, setCanvas().y);
  };

  p.preload = function() {
    p5font = p.loadFont('assets/fonts/PPEiko-Thin.otf');
  }

  p.setup = function () {

    p.createCanvas(setCanvas().x, setCanvas().y);

    p.colorMode("HSB");
    p.textFont(p5font);
    p.rectMode(this.CENTER);
    p.textSize(32);
     for (let i = 0; i < amount; i++) {
        positions[i] = p.createVector(p.random(-p.width/2, p.width/2), p.random(-p.height/2, p.height/2));
        dimensions[i] = p.random(4,100);
        rotations[i] = p.random(-360,360);
        let noiseColor = p.map(p.noise(i), 0, 1, 0, 255);
        colors[i] = noiseColor;
    }
  };

  p.draw = function () {

      if (p.destroySketch == true) {
          p.remove();
          console.log('destroyed')
      }

      p.background(255);
      p.translate(p.width/2, p.height/2);
        for (let i = 0; i< dimensions.length; i++) {
        p.fill(20,100);
        p.stroke(colors[i],p.frameCount % 255,colors[i]);

        dimensions[i] = p.constrain(dimensions[i], 4, p.width * 2);
        p.push();
        p.translate(positions[i].x, positions[i].y);
        p.rotate(p.radians(rotations[i] + dimensions[i] / 10));
        p.rect(0,0, dimensions[i], dimensions[i]);
        p.pop();
      }

      p.fill(20);
      p.text('complexity', -p.width/2 + 34, -p.height/2 + 64);
       
  };

  p.mouseWheel = function(e) {
    for (let i = 0; i < dimensions.length; i++) {
      dimensions[i] += p.map(e.delta,-50,50,-5,5);
    }
    return false;
  }

  // p.touchMoved = function(e) {
  //   console.log(e);
  //   let touched = e.touches[0].clientY;
  //   for (let i = 0; i < dimensions.length; i++) {
  //     dimensions[i] += p.map(touched,0,window.innerHeight,-5,5);
  //   }
  //   return false;
  // }


  // p.mouseWheel = function(event) {
  //   //move the square according to the vertical scroll amount
  //   console.log(event)

  //   for (let i = 0; i< dimensions.length; i++) {
  //       if (dimensions[i] >= 0 && dimensions[i] <= 200) {
  //           dimensions[i] = p.min(dimensions[i] + event.delta * 0.5, 200);
  //       }
  //       else if (dimensions[i] == 0) {
  //         return;
  //       }
  //       else {
  //           dimensions[i] -= event.delta * 0.5;
  //       }
  //   }


   }

  // p.touchMoved = function(event) {
  //   //move the square according to the vertical scroll amount
  //   console.log(event.touches[0].pageY)


  //   for (let i = 0; i< dimensions.length; i++) {
  //       if (dimensions[i] >= 0 && dimensions[i] <= 200) {
  //           dimensions[i] = mappedTouch;
  //       }
  //       else {
  //           dimensions[i] = mappedTouch;
  //       }
  //   }
     
  //    //return false;
  //  }

export default sketch1;
