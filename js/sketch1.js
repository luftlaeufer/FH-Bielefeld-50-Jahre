const sketch1 = (p) => {

  let amount = 20;
  let positions = [];
  let dimensions = [];
  let colors = [];
  p.destroySketch = false;
  
  p.windowResized = function () {
    p.resizeCanvas(window.innerWidth / 2 - 50, window.innerHeight * 0.75);
  };

  p.setup = function () {
    p.createCanvas(window.innerWidth / 2 - 50, window.innerHeight * 0.75);
    p.colorMode("HSB");
     for (let i = 0; i < amount; i++) {
        positions[i] = p.createVector(p.random(p.width), p.random(p.height));
        dimensions[i] = p.random(10,100);
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
            for (let i = 0; i< dimensions.length; i++) {
                p.fill(colors[i],p.frameCount % 255,colors[i]);
                p.ellipse(positions[i].x, positions[i].y, dimensions[i], dimensions[i]);
      }
       
  };

//   p.mousePressed = function() {
//       p.remove();
//   }

  // window.onscroll = (e) => {

  //   //console.log(e)
  //   for (let i = 0; i< dimensions.length; i++) {
  //       dimensions[i] += scrollY * 0.01;
  //   }
  // }

/*   p.mousePressed = function() {
    p.remove();
  } */


  p.mouseWheel = function(event) {
    //move the square according to the vertical scroll amount
    console.log(event.delta)

    for (let i = 0; i< dimensions.length; i++) {
        if (dimensions[i] >= 0 && dimensions[i] <= 200) {
            dimensions[i] += event.delta * 0.5;
        }
        else {
            dimensions[i] -= event.delta * 0.5;
        }
    }

    //uncomment to block page scrolling
  //   if (event.delta >= 13) {
  //     return true;
  //   } else
     
     //return false;
   }
};

export default sketch1;
