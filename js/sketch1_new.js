// https://jsfiddle.net/jvLk0vhp/1/

const sketch1_new = (p) => {

    function setCanvas() {
        /* set canvas dimensions according to 19,5 : 9 ==> iPhone11 ration */
        let wh = 0.9 * (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
        let ww = Math.floor(wh / 2.166666);
        return {
          x: ww,
          y: wh
        }
    }

    const c = document.createElement('canvas');
    let sketchContainer = document.getElementById("sketch1");
    sketchContainer.appendChild(c);
    let ctx = c.getContext("2d");
    c.width = setCanvas().x;
    c.height = setCanvas().y;

    window.onresize = () => {
        c.width = setCanvas().x;
        c.height = setCanvas().y;
        setImage(currentLocation);
    }

    let images = new Array();
    let currentLocation = 0;
    let totalImages = 100;
    
    for (let i = 0; i < totalImages; i++) {
        let img = new Image;
        img.width = setCanvas().x;
        img.height = setCanvas().y;
        img.src = `./assets/images/animation/01/01_animation_${i}.jpg`
        images.push(img);
    }
    
    let mouseWheel = function () {
        window.addEventListener('wheel', function (e) {
            //e.preventDefault(); // No scroll
    
            // The following equation will return either a 1 for scroll down
            // or -1 for a scroll up
            let delta = Math.max(-1, Math.min(1, e.wheelDelta));
    
            // This code mostly keeps us from going too far in either direction
            if (delta == -1) currentLocation += 3;
            if (delta == 1) currentLocation -= 3;
            if (currentLocation < 0) currentLocation = 0;
            if (currentLocation >= (totalImages - 1)) currentLocation = (totalImages - 1);
            //console.log("Current location " + currentLocation);
    
            // See below for the details of this function
            setImage(currentLocation);
        });
    }

    let touchSensitivty = 1.1;
    const hammertime = new Hammer(sketchContainer);
      hammertime.on('pan', function(ev) {
        //console.log(ev);
      if (currentLocation + ev.overallVelocityY >= 0 && currentLocation + ev.overallVelocityY <= totalImages - 1) {
        currentLocation += ev.overallVelocityY * touchSensitivty;
        setImage(Math.floor(currentLocation));
      }
    });

    sketchContainer.ontouchmove = function() {
        return false;
    }
    
    let setImage = function (newLocation) {
        // drawImage takes 5 arguments: image, x, y, width, height
        //ctx.fillRect(0, 0, setCanvas().x, setCanvas().y);
        ctx.drawImage(images[newLocation], 0, 0, setCanvas().x, setCanvas().y);
    }
    
    images[0].onload = function () {
        //ctx.fillRect(0, 0, setCanvas().x, setCanvas().y);
        ctx.drawImage(images[currentLocation], 0, 0, setCanvas().x, setCanvas().y);
        mouseWheel();
    };
}

export default sketch1_new;