const s4 = p => {

    p.destroySketch = false;
    let dim = 50;
  
        p.windowResized = function () {
          p.resizeCanvas(window.innerWidth / 2 - 50, window.innerHeight * 0.75);
        };
  
        p.mouseWheel = function(e) {
          //console.log(e);
          dim += p.map(e.delta,-50,50,-5,5);
          return false;
        }
  
        // p.touchMoved = function(e) {
        //   console.log(e.touches[0].clientY);
        //   let touched = e.touches[0].clientY;
        //   rotation += p.map(touched,0,window.innerHeight,-5,5);
        //   return false;
        // }
      
        p.setup = function () {
          p.createCanvas(window.innerWidth / 2 - 50, window.innerHeight * 0.75);
        }
      
        p.draw = function() {

        p.background(50);
      
          if (p.destroySketch == true) {
            p.remove();
            console.log('destroyed')
          }

          dim = p.constrain(dim,50,p.width);

          p.fill(255);
          p.ellipse(p.width/2,p.height/2,dim,dim)

  
        }
      };
        
  export default s4;
      