const s2 = p => {

  p.destroySketch = false;

  p.windowResized = function () {
    p.resizeCanvas(window.innerWidth / 2 - 50, window.innerHeight * 0.75);
  };

  p.setup = function () {
    p.createCanvas(window.innerWidth / 2 - 50, window.innerHeight * 0.75);
    p.colorMode('HSB');
    p.background(50);
  }

  p.draw = function() {

    if (p.destroySketch == true) {
      p.remove();
      console.log('destroyed')
    }

    let x = p.mouseX;
    let y = p.mouseY;
    let sizing = p.map(p.noise(p.frameCount * 0.01),0,1,20,window.innerWidth/4);
    let noiseColor = p.map(p.noise(p.frameCount * 0.01), 0,1,0,255);

    p.fill(noiseColor/2, noiseColor,255);
    p.ellipse(x,y,sizing,sizing);

    

  }
};
  
export default s2;
