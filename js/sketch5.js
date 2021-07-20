const sketch5 = p => {

    p.destroySketch = false;
    let mousSensetivity = 0.1;    // Wie sensibel reagiert das System auf die Scroll-Geste? Kleinere Werte = weniger sensibel
    let progress = 0;

    let images = []

    function setCanvas() {
        /* set canvas dimensions according to 19,5 : 9 ==> iPhone11 ration */
        let wh = 0.9 * (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
        let ww = p.round(wh / 2.166666);
        return {
          x: ww,
          y: wh
        }
      }
    
      p.windowResized = function () {
        p.resizeCanvas(setCanvas().x, setCanvas().y);
      };

      p.preload = function () {
        for (let i = 0; i < 256; i++) {
            images[i] = p.loadImage(`../../assets/images/animation/05/05_animation_${i}.jpg`);
        }
      }

      p.setup = function () {
        p.createCanvas(setCanvas().x, setCanvas().y);
      }

      p.draw = function () {

        if (p.destroySketch == true) {
          p.remove();
          console.log('destroyed')
        }

        p.background(25);
        let imageIndex = p.int(p.map(progress, 0, 100, 0, images.length));
        p.image(images[imageIndex], 0, 0, p.width, p.height);
        
      }


  // Map mouse wheel event to <progress> variable
    let mouseSensitivity = 0.05;
    p.mouseWheel = function (event) {
    let change = event.delta * mouseSensitivity;
    if (progress + change >= 0 && progress + change <= 100) {
      progress += change;
    }
    return false;
  }

//   let touchSensitivty = 0.5;
//   p.touchMoved = function(e) {
//    //console.log(e.touches[0].clientY);
//    let touched = e.touches[0].clientY;
//    let touchChange = p.map(touched,0,window.innerHeight,2,-2);

//    let change = touchChange;
//    if (progress + change >= 0 && progress + change <= 100) {
//      progress += change * touchSensitivty;
//    }
//    return false;
//  }

    let touchSensitivty = 0.9;
    let sketchContainer = document.querySelector('.sketchContainer');
    const hammertime = new Hammer(sketchContainer);
      hammertime.on('pan', function(ev) {
      //console.log(ev);
      if (progress + ev.overallVelocityY >= 0 && progress + ev.overallVelocityY <= 100) {
        progress += ev.overallVelocityY * touchSensitivty;
      }
    });

    p.touchMoved = function() {
      return false;
    }


}

export default sketch5;