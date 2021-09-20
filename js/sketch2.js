const sketch2 = p => {

  p.destroySketch = false;

  //SETTINGS
  let title = "GENDER FLUIDS";
  let description = "Eine Frage und Spekulation über die Zukunft \nund Grenzen von Geschlechterkategorien.";

  let mousSensetivity = 0.1;    // Wie sensibel reagiert das System auf die Scroll-Geste? Kleinere Werte = weniger sensibel

  let ani = 0.0;    // Variable für den Fortschritt
  let shaderImages = [];

  //Fonts
  let headerFont;
  let subheaderFont;
  let copyFont;

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

    //Import der Fonts
    headerFont = p.loadFont("../../assets/fonts/MaximaNowTBProMedium.otf"); // 30
    subheaderFont = p.loadFont("../../assets/fonts/MaximaNowTBProMedium.otf"); // 26
    copyFont = p.loadFont("../../assets/fonts/MaximaNowTBProRegular.otf"); //16

    for (let i = 0; i < 99; i++) {
      shaderImages[i] = p.loadImage(`../assets/images/animation/02/02_animation_${i}.jpg`);
    }
  }


  //import java.util.*;

  p.setup = function () {
    p.createCanvas(setCanvas().x, setCanvas().y);
    p.noStroke();
  }

  p.draw = function () {

    p.background(25);

    if (p.destroySketch == true) {
      p.canvas.width = 1;
      p.canvas.height = 1;
      p.resizeCanvas(1,1, p.WEBGL);
      p.remove();
      console.log('destroyed');
    }

    let imageIndex = p.int(p.map(ani,0,100,0,shaderImages.length - 1));
    p.image(shaderImages[imageIndex],0,0,p.width,p.height);

    drawProgress();
    drawBottomTimeline();
    drawTitle();

  }


  // OVERLAY: Titel und Beschreibung
  function drawTitle() {
    p.textAlign(p.LEFT);
    p.textFont(headerFont);
    let boarder = p.width * 0.07;
    p.noStroke();
    p.fill(255);
    p.textSize(p.int(p.height / 32));
    p.text(title, boarder, p.height * 0.85);
    p.textSize(p.int(p.height / 60));
    p.textFont(copyFont);
    p.textLeading(p.int(p.height / 30));
    p.text(description, boarder, p.height * 0.85 + 13, p.width, p.height);
  }

  // OVERLAY: Bot Timeline
  function drawBottomTimeline() {
    let ticks = 101;
    let tickSeparation = (p.width - p.width * 0.14) / ticks;
    p.strokeWeight(1);
    p.noFill();
    p.stroke(128);
    for (let i = 0; i < ticks; i++) {
      let tickHeight = p.height * 0.995;
      if (i % 10 == 0) {
        tickHeight = p.height * 0.985;
      }
      p.line(p.width * 0.07 + i * tickSeparation, p.height, p.width * 0.07 + i * tickSeparation, tickHeight);
    }
  }


  // Draw the vertical progress bar
  function drawProgress() {
    p.push();
    p.strokeCap(p.ROUND);
    let lineWidth;
    p.textFont(subheaderFont);
    p.textSize(p.int(p.height / 40));
    p.fill(255);
    p.strokeWeight(6);
    p.stroke(255);  

    let year = p.str(p.floor(p.map(ani, 0, 100, 1971, 2072)));
    
    if (ani <= 100) {
      lineWidth = p.map(ani, 0, 50, p.width/2, p.width*0.065);
      let positionLeft = p.map(ani, 0, 50, p.width*0.065, p.width/2);
      p.noStroke();
      p.text(year, p.map(ani, 0, 50, p.width*0.065, p.width/2-25), p.height - p.int(p.height / 30));
      p.stroke(255);
      p.line(positionLeft, p.height*0.98, positionLeft+lineWidth-p.width*0.065, p.height*0.98);
    } else {
      lineWidth = p.map(ani, 50, 100, p.width/2, p.width-p.width*0.075);
      p.noStroke();
      p.text(year, p.map(ani, 50, 100, p.width/2-25, p.width-p.width*0.195), p.height-40);
      p.stroke(255);
      p.line(p.width/2, p.height*0.98, lineWidth, p.height*0.98);
    }
    p.pop();
  }

  ////// MOUSEWHEEL ACTION //////
  p.mouseWheel = function (event) {
    let mouseChange = event.delta * mousSensetivity;

    // Anders als im vorherigen Beispiel führen wir jetzt eine Variable <fortschritt> ein
    // Der Fortschritt findet gibt den Punkt innerhalb der Interaktion zwischen 0% und 100% an
    // So können wir jederzeit feststellen wie weit fortgeschritten die Scroll-Interaktion ist
    if (ani + mouseChange >= 0 && ani + mouseChange <= 100) {
      ani += mouseChange;
    }
    return false;
  }

  let touchSensitivty = 1.5;
  let sketchContainer = document.querySelector('.sketchContainer');
  const hammertime = new Hammer(sketchContainer);
    hammertime.on('pan', function(ev) {
	  //console.log(ev);
    if (ani + ev.overallVelocityY >= 0 && ani + ev.overallVelocityY <= 100) {
      ani += ev.overallVelocityY * touchSensitivty;
    }
  });

  p.touchMoved = function() {
    return false;
  }


};

export default sketch2;
