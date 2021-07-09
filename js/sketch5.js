const sketch5 = (p) => {

    p.destroySketch = false;

    // Graph Graph1; //Der Sketch hat ein Objekt Graph1 alle Graphendarstellungen werden daruch getätigt
    // Static Static1;

    let font;

    let fortschritt = 0; // fortschritt ist IMMER von 0 100 alle anderen Variablen mappen darauf
    let maxHeight; // bezieht sich auf die maximale pixelHöhe wobei height ein auschnitt aus 0 - maxheight ist

    let ausmasse; //Ausmaße ist die Skalierung der anzuzeigenden Daten 
    let position; //Position verschiebt das Koordinatensystem

    let farben1; // farben1 ist ne Tabelle mit den Fraben bis in die Gegenwart 2 für die Zukunft
    let farben2; // 0 ist immer BG, 1 die tabelle und der Rest der Gaph

    let worter1;
    let worter2;
    let worter3;

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

        maxHeight = p.height*18.472;

        Graph1 = new Graph(); // der Graph wird compiled
        Static1 = new Static(); // Die Statische Oberfläche wird compiled
      
        position = p.createVector(p.width - p.width/40, 0); 
        ausmasse = p.createVector(-p.width + p.width/5, p.height); 
      
    };

    p.preload = function () {

        font = p.loadFont("../assets/fonts/MaximaNowTBProRegular.otf");
        farben1 = p.loadTable("../assets/data/05_farben1.csv", 'csv', "header");
        farben2 = p.loadTable("../assets/data/05_farben2.csv", 'csv', "header");
        
        worter1 = p.loadTable("../assets/data/05_worter1.csv", 'csv', "header");
        worter2 = p.loadTable("../assets/data/05_worter2.csv", 'csv', "header");
        worter3 = p.loadTable("../assets/data/05_worter3.csv", 'csv', "header");

    }

    p.draw = function () {

        if (p.destroySketch == true) {
          p.remove();
          console.log('destroyed')
        }

    
            //Styles:
            p.textFont(font);
            p.strokeWeight(4);
          
            // der switch für die Fraben bei fortschritt = 50 damit andere Farben in der Zukunft
            let farben = farben1;
            if (fortschritt < 50) {
              farben  = farben1;
            } else {
              farben  = farben2;
            }
          
            p.background(p.color(farben.getNum(0, "r"), farben.getNum(0, "g"), farben.getNum(0, "b")));
          
            p.push(); // um nur den Graphen zu verschieben kommt das bewegte in ne pushMatrix klammer
          
            position.y = -p.map(fortschritt, 0, 100, 0, maxHeight); //bei einer Scollbewegung wird die Y Koordinate nach unten verschoben abhängig vom Fortschritt und der MaxHeight
            //verschiebt das koordinatensytem nach PVector position
            p.translate (position.x, position.y + p.height/4.06);
          
          
          
          
            // Der Graph wird außerhalb des Bildes gerendert. Wenn der momentane Frotschritt + der Höhe größer als die Position der rechten Schranke der Tabelle -1 ist(es soll ja vor dem Bildschirm passieren)
            //vielleicht versteht mans mit SK02 besser
            //alles wird auf die 0 - 100 skala gemappt in der auch die fortschritt variable ist
            //es gibt einen Bereich in dem alles fine ist. also muss erst unLoad gemacht werdeb wenn der selbe Spaß bei +1
          
          
            if (fortschritt + 
              p.map(p.height, 0, maxHeight, 0, 100) > 
              p.map(Graph1.getRechteSchranke() + 0.5, 0, Graph1.getMaximaleLange(), 0, 100)
              ) {
              Graph1.loadFuture();
            } else if (fortschritt + 
              p.map(height, 0, maxHeight, 0, 100) <
              p.map(Graph1.getRechteSchranke() - 1, 0, Graph1.getMaximaleLange(), 0, 100)
              ) {
              Graph1.unLoadFuture();
            }
          
            Graph1.anzeigen(farben); // Der Graph wird gerendert
          
            p.pop();
          
            // ab hier werden die Statischen Elemente angezeigt dafür wird das Koordinaensystem auf 0,0 gestellt
            p.push();
            p.translate(0, 0);
          
            Static1.namenZeichnen2(Graph1.getNamenVonNichtNull(5), farben, Graph1.getTabelle(), Graph1.getRechteSchranke());
          
          
            drawProgress(p.color(farben.getNum(1, "r"), farben.getNum(1, "g"), farben.getNum(1, "b")));
            drawBottomTimeline(p.color(farben.getNum(1, "r"), farben.getNum(1, "g"), farben.getNum(1, "b")));
            p.pop();
    }


    class RandomWordCombiner {

        // der RandomWordCombiner nimmt sich die 3 Tabellen mit wörtern und generwirt daraus einen Zusammengestzten String
        //nur in 7/10tel der Fälle wird das 3. Word vorgehängt sonst nicht 

        constructor(worter1, worter2, worter3) {
            this.worter1 = worter1;
            this.worter2 = worter2;
            this.worter3 = worter3;
          }
      
        //RandomWordCombiner () {
        //   worter1 = loadTable("worter1.csv");
        //   worter2 = loadTable("worter2.csv");
        //   worter3 = loadTable("worter3.csv");
        //}
        
        getRandomWord() {
        
          let r1 = (p.int)(p.random(0,this.worter1.getRowCount()-1));
          let r2 = (p.int)(p.random(0,this.worter2.getRowCount()-1));
          let r3 = (p.int)(p.random(0,this.worter3.getRowCount()-1));
          let r4 = (p.int)(p.random(0,10));
          
          let output = "";
          
          if (r4 > 6) {
            output = this.worter3.getString(r3,0) + this.worter1.getString(r1,0) +this.worter2.getString(r2,0);
          } else {
            output = this.worter1.getString(r1,0) +this.worter2.getString(r2,0);
          }
          return output;
        }
    }






    let mausSensitivitaet = 0.05; // Wie sensibel reagiert das System auf die Scroll-Geste? Kleinere Werte = weniger sensibel
    p.mouseWheel = function (event) {
      let aenderungDurchMaus = event.delta * mausSensitivitaet;
      //console.log(aenderungDurchMaus);
      if (fortschritt+aenderungDurchMaus >= 0 && fortschritt+aenderungDurchMaus <= 100) {
        fortschritt += aenderungDurchMaus;
      }
      return false;
    }

    let touchSensitivty = 0.5;
    p.touchMoved = function(e) {
     //console.log(e.touches[0].clientY);
     let touched = e.touches[0].clientY;
     let touchChange = p.map(touched,0,window.innerHeight,2,-2);
      let aenderungDurchMaus = touchChange;

     if (fortschritt+aenderungDurchMaus >= 0 && fortschritt+aenderungDurchMaus <= 100) {
      fortschritt += aenderungDurchMaus * touchSensitivty;
    }
     return false;
    } 

    function drawBottomTimeline(c) {
        let ticks = 101;
        let tickSeparation = (p.width-p.width*0.14)/ticks;
        p.strokeWeight(1);
        p.noFill();
        p.stroke(c);
        for (let i = 0; i < ticks; i++) {
            let tickHeight = p.height*0.995;
            if (i%10 == 0) {
            tickHeight = p.height*0.985;
            }
            p.line(p.width*0.07+i*tickSeparation, p.height, p.width*0.07+i*tickSeparation, tickHeight);
        }
    }

    function drawProgress(c) {
        p.noFill();
        p.stroke(c);
        p.strokeWeight(6);
        let lineWidth;

        if (fortschritt <= 50) {
            lineWidth = p.map(fortschritt, 0, 50, p.width/2, p.width*0.07);
            let positionLeft = p.map(fortschritt, 0, 50, p.width*0.07, p.width/2);
            p.line(positionLeft, p.height*0.98, positionLeft+lineWidth-p.width*0.07, p.height*0.98);
        } else {
            lineWidth = p.map(fortschritt, 50, 100, p.width/2, p.width-p.width*0.07);
            p.line(p.width/2, p.height*0.98, lineWidth, p.height*0.98);
        }
    }



}

export default sketch5;