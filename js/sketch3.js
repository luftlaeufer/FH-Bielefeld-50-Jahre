const s3 = p => {

  p.destroySketch = false;

      p.windowResized = function () {
        p.resizeCanvas(window.innerWidth / 2 - 50, window.innerHeight * 0.75);
      };
    
      p.setup = function () {
        p.createCanvas(window.innerWidth / 2 - 50, window.innerHeight * 0.75);
        p.colorMode('HSB');
        p.rectMode('CENTER');
        p.background(240);
      }
    
      p.draw = function() {
    
        if (p.destroySketch == true) {
          p.remove();
          console.log('destroyed')
        }

        p.translate(p.width/2,p.height/2);
        p.rotate(p.radians(p.frameCount));
        p.push();
        let sizing = p.map(p.noise(p.frameCount * 0.01),0,1,20,window.innerWidth/4);
        let noiseColor = p.map(p.noise(p.frameCount * 0.01), 0,1,0,255);

        p.fill(255, noiseColor,noiseColor);
        
        p.rect(0,0 ,sizing,sizing);
        p.pop();

      }
    };
      
export default s3;
    