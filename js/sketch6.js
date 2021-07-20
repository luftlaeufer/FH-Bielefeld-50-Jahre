const sketch6 = (p) => {

    p.destroySketch = false;

    // Grid
let tileCountX = 3;
let tileCount = 5;

let randomSeedCount = [4, 6, 7, 11, 16, 26, 37, 51, 59]; // Ausgewählte Seeds
let randomCount = p.int(p.random(0, 8.9)); // Um alle Arraystellen anzusprechen
let actRandomSeed = randomSeedCount[randomCount]; //wählt einen Seed aus dem Array

let heightF; //höhe bis Legende

let fortschritt = 0;
let tabelle;
let datensaetze = 0.0;

let prozent = [];
let jahr = [];

// Legende
let Maxima; 
let MaximaMedium; 
let transP = 'C7'; // C7  // 200
let colors = ['#ffffff', '#000000', '#54398A', '#5195BC', '#63A944', '#CFC9B8'];
let words = ["Internetnutzer in Deutschland (%)", "Das nächste Zoom-Meeting"];
let words1 = ["Im Stau stehen", "In die verschwitze Bahn quetschen", "Den Bus verpassen"];
let words2 = ["Sich selbst aussperren", "Den Regenschirm vergessen", "Auf dem Gehweg angerempelt werden"];
let words3 = ["Zuhause ist es doch am schönsten!", "Welche Hose zieh ich zum Date an?", "Shit, der Besuch ist schon da!"];

let abschnitt = 0;
    
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
  
    p.setup = function () {
  
      p.createCanvas(setCanvas().x, setCanvas().y);
      p.strokeCap(p.SQUARE);
    
      heightF = p.height - p.height/3;
    
      // Wir speichern die Daten der Tabelle in vier einzelne Arrays
      // Hier werden die Arrays mit der Anzahl der Zeilen in der Tabelle initialisiert
      jahr = new Array(tabelle.getRowCount());
      prozent = new Array(tabelle.getRowCount());

    
      // Für diverse Berechnungen speichern wir auch noch einmal, wie viele Datensätze die Tabelle hat
      datensaetze = tabelle.getRowCount();
    
      // Nun gehen wir die Tabelle durch und speichern die Daten jeweils in den vorbereiteten Arrays
      // So können wir später auf die Daten einfacher zugreifen
      for (let i = 0; i < tabelle.getRowCount(); i++) {
        // Zeile laden
        let datensatz = tabelle.getRow(i);
    
        // Daten in die jeweiligen Arrays speichern
        jahr[i] = datensatz.getNum("jahr");
        prozent[i] = datensatz.getNum("prozent");
      }

  

    };
  
    p.preload = function () {

      tabelle = p.loadTable("../assets/data/06_use-of-internet.csv", "header");

      // Load fonts
      Maxima = p.loadFont("../assets/fonts/MaximaNowTBProRegular.otf");
      MaximaMedium = p.loadFont("../assets/fonts/MaximaNowTBProMedium.otf");
  
    }
  
    p.draw = function () {
  
      if (p.destroySketch == true) {
        p.remove();
        console.log('destroyed')
      }
      
      p.background('#FDFAEE');
      p.randomSeed(actRandomSeed);

      drawPoints();

      // Um die Veränderung der Daten kontinuierlich zeichnen zu können müssen wir immer zwischen zwei Datensätze interpolieren
      let prozentsatz = (1/datensaetze);
      // Dafür benötigen wir den Abschnitt in dem wir uns befinden (hier: Abschnitt 0 = Jahr 2010, Abschnitt 1 = Jahr 2011, etc.)
      abschnitt = p.int(fortschritt/prozentsatz/100);
    
      // Grid mit den Kästen
      for (let gridY = 0; gridY<tileCount; gridY++) {                           
        for (let gridX = 0; gridX<tileCountX; gridX++) {
    
          let posX = p.width / tileCountX * gridX;
          let posY = heightF / tileCount * gridY;
    
          let shiftX =  (p.random(-5, 5) * p.map(fortschritt, 100, 0, 0, 31));
          let shiftY =  (p.random(-2, 2) * p.map(fortschritt, 100, 0, 0, 31));
    
          let toggle = p.int(p.random(0, 2)); // toggle um schwarz oder bunt zu zeichnen
    
          // schwarze Kästen
          if (toggle == 0) {
            p.push();
            p.stroke(colors[1] + transP);
            p.strokeWeight(p.map(fortschritt, 0, 100, 0, 70));
            p.line(posX, posY, posX + p.width / tileCountX, posY + heightF / tileCount);
            p.pop();
          }
    
          //Bunte Kästen + andere strokeWeight und einem shift 
          if (toggle == 1) {
            p.push();
            if (gridX > 0) {
              p.stroke(colors[3] + transP);
            } else {
              p.stroke(colors[2] + transP);
            }
            if (gridY > 2) {
              p.stroke(colors[4] + transP);
            }
            p.strokeWeight(p.random(2, 50)* p.map(fortschritt, 100, 0, 0, 6));
            p.translate(shiftX, shiftY);
            p.line(posX, posY, posX + p.width / tileCountX, posY + heightF / tileCount);
            p.pop();
          }
        }
      }
    
      zeichneGraphen();
      zeichneLegende();
      drawBottomTimeline();
      drawProgress();
    
    };

    // der Graph
    function zeichneGraphen() {
        p.push();
        p.strokeCap(p.ROUND);
        p.strokeWeight(7);
        p.stroke(colors[5] + 'FF');
        p.textFont(Maxima);
        p.textSize(32);
    
        // bis zur häfte der Daten eine ganze linie
        for (let i = 0; i < p.int(jahr.length/2); i++) {
        if (abschnitt+1 > i) {
            p.line(p.map(jahr[i], 1990, 2050, 0, p.width), p.map(prozent[i], 0, 100, heightF, 0), p.map(jahr[i+1], 1990, 2050, 0, p.width), p.map(prozent[i+1], 0, 100, heightF, 0));
        }
        // damit der Text und die Prozentzahl nur an einer Stelle sind
        if (abschnitt == i) {
            p.fill(colors[5]);
            p.rect(p.map(jahr[i+1], 1990, 2050, 0, p.width)-25, p.map(prozent[i+1], 0, 100, heightF, 0)-30, 60, -30);
            p.fill(colors[1]);
            p.text(p.int(prozent[i]), p.map(jahr[i+1], 1990, 2050, 0, p.width)-20, p.map(prozent[i+1], 0, 100, heightF, 0)-35);
        }
        }
        // ab der hälfte gestrichelte Linien
        for (let i = p.int(jahr.length/2); i < p.int(jahr.length-1); i++) {
            if (abschnitt+1 > i) {
                p.push();
                p.strokeWeight(4);
                p.translate(p.map(jahr[i+1], 1990, 2050, 0, p.width), p.map(prozent[i+1], 0, 100, heightF, 0));
                p.rotate(p.radians(45));
                p.line(-4, -4, 4, 4);
                p.pop();
            }
            // damit der Text und die Prozentzahl nur an einer Stelle sind
            if (abschnitt == i) {
                p.fill(colors[5]);
                p.rect(p.map(jahr[i+1], 1990, 2050, 0, p.width)-25, p.map(prozent[i+1], 0, 100, heightF, 0)-30, 60, -30);
                p.fill(colors[1]);
                p.text(p.int(prozent[i]), p.map(jahr[i+1], 1990, 2050, 0, p.width)-20, p.map(prozent[i+1], 0, 100, heightF, 0)-35);
            }
        }
        p.pop();
    }

    // Die Legende 
    function zeichneLegende() {
        p.textFont(MaximaMedium);
        p.textSize(p.int(p.height / 70));
        let space = p.int(p.height / 55);; // space zwischen den Zeilen (Blöcke wie Text in der Legende)
    
        for (let i = 0; i<=4; i++) {
            p.push();
            p.translate(40, heightF + p.int(p.height * 0.13)); // um an die richtige Stelle zukommen für die Legende
            if (i == 0) {
                p.strokeCap(p.ROUND);
                p.noFill();
                p.strokeWeight(9);
                p.stroke(colors[5] + transP);
                p.line(-10, 12, 35, 12);
                p.fill(colors[1]);
                p.noStroke();
                p.text(words[0], 70, 20+(p.int(p.height/20))*i);
            }
            else if (i== 1) {
                p.strokeWeight(p.height / 100);
                p.fill(colors[i] + transP);
                p.stroke(colors[i] + transP);
                p.line(-5, 12+space*i, 30, 42+space*i);
                p.noStroke();
                p.text(words[1], 70, 25+(space+5)*i);
            }
            else if (i == 2) {
                p.strokeWeight(p.height / 100);
                p.fill(colors[i] + transP);
                p.stroke(colors[i] + transP);
                p.line(-5, 12+space*i, 30, 42+space*i);
                p.noStroke();
                p.text(words1[p.int(p.random(0, 2.9))], 70, 25+(space+5)*i);
            }
            else if (i == 3) {
                p.strokeWeight(p.height / 100);
                p.fill(colors[i] + transP);
                p.stroke(colors[i] + transP);
                p.line(-5, 12+space*i, 30, 42+space*i);
                p.noStroke();
                p.text(words2[p.int(p.random(0, 2.9))], 70, 25+(space+5)*i);
            }
            else if (i == 4) {
                p.strokeWeight(p.height / 100);
                p.fill(colors[i] + transP);
                p.stroke(colors[i] + transP);
                p.line(-5, 12+space*i, 30, 42+space*i);
                p.noStroke();
                p.text(words3[p.int(p.random(0, 2.9))], 70, 25+(space+5)*i);
            }
            p.pop();
        }
    
        // Die Headline
        p.push();                                                            
        p.noStroke();
        p.fill(colors[1]);
        p.translate(40, heightF + p.int(p.height * 0.14)); // um an die richtige Stelle zukommen für die Legende        p.textFont(MaximaMedium);
        p.textSize(p.int(p.height / 40));
        p.textFont(MaximaMedium);
        p.text("Was wir in der Zukunft", -10, p.int(p.height / -22));
        p.text("vermissen werden:", -10, p.int(p.height / -50));
        p.pop();
    }

    // Raster: Punkte und Uhrzeiten im Hintergrund
    function drawPoints() {                                                           
        for (let gridY = 0; gridY<tileCount+1; gridY++) {
            for (let gridX = 0; gridX<tileCountX+1; gridX++) {
                
                let posX = p.width / tileCountX * gridX; // Das selbe Raster könnte vieleicht auch vereinfacht werden, also mit in draw, aber es hat grade alles so gut funktioniert .-.
                let posY = heightF / tileCount * gridY;
                
                p.push();  
                p.noStroke();
                p.textFont(Maxima);
                p.textSize(17);
                p.translate(posX, posY);
                p.fill(colors[5]);
                p.ellipse(0, 0, 10, 10);
                p.rotate(p.radians(45));
                p.fill(colors[1] + '82');
                p.text(gridY+gridX+10 + ":" + 0 + 0, 10, 0);
                p.pop();
            }
        }
    }

    // Timeline
    function drawBottomTimeline() {                                                 
        let ticks = 61;
        let tickSeparation = (p.width-p.width*0.14)/ticks;
        p.strokeWeight(1);
        p.noFill();
        p.stroke(colors[1]);
        for (let i = 0; i < ticks; i++) {
        let tickHeight = p.height*0.995;
        if (i%10 == 0) {
            tickHeight = p.height*0.985;
        }
        p.line(p.width*0.07+i*tickSeparation, p.height, p.width*0.07+i*tickSeparation, tickHeight);
        }
    }
  
  // Draw the vertical progress bar
  function drawProgress() {
    p.push();
    p.strokeCap(p.ROUND);
    let lineWidth;
    p.textFont(Maxima);
    p.textSize(p.int(p.height / 40));
    p.fill(colors[1]);
    p.strokeWeight(6);
    p.stroke(colors[5]);  
  
    if (fortschritt <= 100) {
      lineWidth = p.map(fortschritt, 0, 50, p.width/2, p.width*0.065);
      let positionLeft = p.map(fortschritt, 0, 50, p.width*0.065, p.width/2);
      p.noStroke();
      p.text(jahr[abschnitt], p.map(fortschritt, 0, 50, p.width*0.065, p.width/2-25), p.height - p.int(p.height / 30));
      p.stroke(colors[1]);
      p.line(positionLeft, p.height*0.98, positionLeft+lineWidth-p.width*0.065, p.height*0.98);
    } else {
      lineWidth = p.map(fortschritt, 50, 100, p.width/2, p.width-p.width*0.075);
      p.noStroke();
      p.text(jahr[abschnitt], p.map(fortschritt, 50, 100, p.width/2-25, p.width-p.width*0.195), p.height-40);
      p.stroke(colors[1]);
      p.line(p.width/2, p.height*0.98, lineWidth, p.height*0.98);
    }
    p.pop();
  }
  
  let mausSensitivitaet = 0.1; // Wie sensibel reagiert das System auf die Scroll-Geste? Kleinere Werte = weniger sensibel
  p.mouseWheel = function(event) {
    let aenderungDurchMaus = event.delta * mausSensitivitaet;
    if (fortschritt+aenderungDurchMaus >= 0 && fortschritt+aenderungDurchMaus <= 100) {
      fortschritt += aenderungDurchMaus;
    }
    return false;
  }

      let touchSensitivty = 1.5;
      let sketchContainer = document.querySelector('.sketchContainer');
      const hammertime = new Hammer(sketchContainer);
        hammertime.on('pan', function(ev) {
        //console.log(ev);
        if (fortschritt + ev.overallVelocityY >= 0 && fortschritt + ev.overallVelocityY <= 100) {
          fortschritt += ev.overallVelocityY * touchSensitivty;
        }
      });
      
      p.touchMoved = function() {
        return false;
      }


  }
  
  export default sketch6;