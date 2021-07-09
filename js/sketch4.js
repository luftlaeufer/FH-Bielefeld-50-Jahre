const sketch4 = p => {

    p.destroySketch = false;

    let fortschritt = 0;
    let tabelle; // table
    let datensaetze;
    let font; //font

    let BWL;
    let Grafik;
    let Architektur;
    let Pflege;
    let Maschienenbau;
    let Sozialearbeit;
    let Jahr;
    let BA;
    let Miete;
  
    p.windowResized = function () {
      p.resizeCanvas(setCanvas().x, setCanvas().y);
    };

    function setCanvas() {
      /* set canvas dimensions according to 19,5 : 9 ==> iPhone11 ration */
      let wh = 0.9 * (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
      let ww = p.round(wh / 2.166666);
      return {
        x: ww,
        y: wh
      }
    }


        p.preload = function() {
          font = p.loadFont("../assets/fonts/Elsner.otf");
          tabelle = p.loadTable("../../assets/data/04_wohnraumData.csv", 'csv', 'header');
        }
      
        p.setup = function () {
          p.createCanvas(setCanvas().x, setCanvas().y);
          p.smooth(8);

          // Wir speichern die Daten der Tabelle in acht einzelne Arrays
          // Hier werden die Arrays mit der Anzahl der Zeilen in der Tabelle initialisiert
          Jahr = new Array(tabelle.getRowCount());
          BWL = new Array(tabelle.getRowCount());
          Grafik = new Array(tabelle.getRowCount());
          Architektur = new Array(tabelle.getRowCount());
          Pflege = new Array(tabelle.getRowCount());
          Maschienenbau = new Array(tabelle.getRowCount());
          Sozialearbeit = new Array(tabelle.getRowCount());
          BA = new Array(tabelle.getRowCount());
          Miete = new Array(tabelle.getRowCount());

          datensaetze = tabelle.getRowCount();

          // Nun gehen wir die Tabelle durch und speichern die Daten jeweils in den vorbereiteten Arrays
          // So können wir später auf die Daten einfacher zugreifen
          for (let i = 0; i < tabelle.getRowCount(); i++) {
            // Zeile laden
            let datensatz = tabelle.getRow(i);

            // Daten in die jeweiligen Arrays speichern
              Jahr[i] = datensatz.getNum("Jahr");
              BWL[i] = datensatz.getNum("BWL");
              Grafik[i] = datensatz.getNum("Grafik");
              Architektur[i] = datensatz.getNum("Architektur");
              Pflege[i] = datensatz.getNum("Pflege");
              Maschienenbau[i] = datensatz.getNum("Maschienenbau");
              Sozialearbeit[i] = datensatz.getNum("Sozialearbeit");
              BA[i] = datensatz.getNum("BA");
              Miete[i] = datensatz.getNum("Miete");
          }
        }
      
        p.draw = function() {

          if (p.destroySketch == true) {
            p.remove();
            console.log('destroyed')
          }

          p.background(255);
          p.textFont(font);

          // Um die Veränderung der Daten kontinuierlich zeichnen zu können müssen wir immer zwischen zwei Datensätze interpolieren
          let prozentsatz = (1/datensaetze);
          // Dafür benötigen wir den Abschnitt in dem wir uns befinden (hier: Abschnitt 0 = Jahr 1991, Abschnitt 1 = Jahr 2071, etc.)
          let abschnitt = p.int(fortschritt/prozentsatz/100);
          // Und einen Anteil, der zwischen 0-1 berechnet wird
          // Diesen Anteil brauchen wir für die fließende Berechnung der Zahlen während des Scrollens 
          let anteil = (fortschritt-(abschnitt*(prozentsatz*100)))/100 *datensaetze;

          // Um den Code nicht 3x schreiben zu müssen, gibt es eine Funktion in die wir die jeweiligen Parameter übergeben
          zeichneDaten(BWL, p.createVector(p.width*0.25, p.height*0.25), abschnitt, anteil, p.color('#EBC91540'), p.color(0));
          zeichneDaten(BA, p.createVector(p.width*0.25, p.height*0.25), abschnitt, anteil, p.color('#EBC915'), p.color(0));
          zeichneDaten(Grafik, p.createVector(p.width*0.75, p.height*0.25), abschnitt, anteil, p.color('#48558A40'), p.color(0));
          zeichneDaten(BA, p.createVector(p.width*0.75, p.height*0.25), abschnitt, anteil, p.color('#48558A'), p.color(0));
          zeichneDaten(Architektur, p.createVector(p.width*0.25, p.height*0.5), abschnitt, anteil, p.color('#54398A40'), p.color(0));
          zeichneDaten(BA, p.createVector(p.width*0.25, p.height*0.5), abschnitt, anteil, p.color('#54398A'), p.color(0));
          zeichneDaten(Pflege, p.createVector(p.width*0.75, p.height*0.5), abschnitt, anteil, p.color('#A0157140'), p.color(0));
          zeichneDaten(BA, p.createVector(p.width*0.75, p.height*0.5), abschnitt, anteil, p.color('#A01571'), p.color(0));
          zeichneDaten(Maschienenbau, p.createVector(p.width*0.25, p.height*0.75), abschnitt, anteil, p.color('#A74B0B40'), p.color(0));
          zeichneDaten(BA, p.createVector(p.width*0.25, p.height*0.75), abschnitt, anteil, p.color('#A74B0B'), p.color(0));
          zeichneDaten(Sozialearbeit, p.createVector(p.width*0.75, p.height*0.75), abschnitt, anteil, p.color('#33663B40'), p.color(0));
          zeichneDaten(BA, p.createVector(p.width*0.75, p.height*0.75), abschnitt, anteil, p.color('#33663B'), p.color(0));



          // Zeichnen des Jahres
          zeichneJahr(abschnitt);

          // Legende zeichnen
          zeichneLegende();

          // Fortschrittsindikator zeichnen 
          //zeichneIndiaktor();

          // Zeichnen der Wohnfläche 
          zeichneWohnflaeche();
          drawProgress();
          drawBottomTimeline();
  
        }

        function zeichneDaten(input, position, abschnitt, anteil, farbe, textfarbe) {
          let daten;
        
          // Der "Trick" besteht hier darin, das wir -abhängig vom Fortschritt und dem Abschnitt in dem wir uns befinden-
          // zwischen dem aktuellen Datensatz und dem nächsten Datensatz über die lerp()-Funktion interpolieren.
          // vgl. https://processing.org/reference/lerp_.html
          //
          // Konkretes Beispiel: Datensatz #1 hat den Wert 10, Datensatz #2 den Wert 20
          // Sind wir ganz am Anfang des Abschnitss, hat unser <anteil> den Wert 0. Sind wir am Ende hat der <anteil> den Wert 1.
          // Die lerp()-Funktion erlaubt es nun zu berechnen, welchen Wert wir bei z.B. 50% zwischen den beiden Werten haben.
          // 50% dem Datensatz #1 und Datensatz #2 ist dann konkret 15.
        
          if (abschnitt < p.round(datensaetze-1)) {
            daten = p.lerp(input[abschnitt], input[abschnitt+1], anteil);
          } else {
            daten = input[p.round(datensaetze-1)];
          }
          p.fill(farbe);
          p.noStroke();
          p.ellipse(position.x, position.y, daten/8, daten/8);
        }

        function zeichneJahr(abschnitt) {
          p.fill(0);
          p.noStroke();
          p.textSize(45);
          p.text(Jahr[abschnitt], p.width*0.05, p.height*0.05);
        }

        function zeichneWohnflaeche() {
          p.noFill();
          p.stroke(0);
          p.strokeWeight(2);
          p.rectMode(p.CENTER);
          let rechtecke = Miete[p.round(fortschritt)];
          let rechteckGroesse = 9;
          let position = p.createVector(p.width*0.23, p.height*0.23);
          for (let i=0; i < rechtecke; i++) {
            position.x = p.width*0.23+i%3*rechteckGroesse;
            if (i%3 ==0) position.y+=9;
            p.rect(position.x, position.y, rechteckGroesse, rechteckGroesse);
          }
          p.noFill();
          p.stroke(0);
          p.strokeWeight(2);
          p.rectMode(p.CENTER);
          let rechteckeb = Miete[p.round(fortschritt)];
          let rechteckGroesseb = 9;
          let positionb = p.createVector(p.width*0.73, p.height*0.23);
          for (let i=0; i < rechteckeb; i++) {
            positionb.x = p.width*0.73+i%3*rechteckGroesseb;
            if (i%3 ==0) positionb.y+=9;
            p.rect(positionb.x, positionb.y, rechteckGroesseb, rechteckGroesseb);
          }
          p.noFill();
          p.stroke(0);
          p.strokeWeight(2);
          p.rectMode(p.CENTER);
          let rechteckec = Miete[p.round(fortschritt)];
          let rechteckGroessec = 9;
          let positionc = p.createVector(p.width*0.23, p.height*0.48);
          for (let i=0; i < rechteckec; i++) {
            positionc.x = p.width*0.23+i%3*rechteckGroessec;
            if (i%3 ==0) positionc.y+=9;
            p.rect(positionc.x, positionc.y, rechteckGroessec, rechteckGroessec);
          }
          p.noFill();
          p.stroke(0);
          p.strokeWeight(2);
          p.rectMode(p.CENTER);
          let rechtecked = Miete[p.round(fortschritt)];
          let rechteckGroessed = 9;
          let positiond = p.createVector(p.width*0.73, p.height*0.48);
          for (let i=0; i < rechtecked; i++) {
            positiond.x = p.width*0.73+i%3*rechteckGroessed;
            if (i%3 ==0) positiond.y+=9;
            p.rect(positiond.x, positiond.y, rechteckGroessed, rechteckGroessed);
          }
          p.noFill();
          p.stroke(0);
          p.strokeWeight(2);
          p.rectMode(p.CENTER);
          let rechteckee = Miete[p.round(fortschritt)];
          let rechteckGroessee = 9;
          let positione = p.createVector(p.width*0.23, p.height*0.73);
          for (let i=0; i < rechteckee; i++) {
            positione.x = p.width*0.23+i%3*rechteckGroessee;
            if (i%3 ==0) positione.y+=9;
            p.rect(positione.x, positione.y, rechteckGroessee, rechteckGroessee);
          }
        
          p.noFill();
          p.stroke(0);
          p.strokeWeight(2);
          p.rectMode(p.CENTER);
          let rechteckeg = Miete[p.round(fortschritt)];
          let rechteckGroesseg = 9;
          let positiong = p.createVector(p.width*0.73, p.height*0.73);
          for (let i=0; i < rechteckeg; i++) {
            positiong.x = p.width*0.73+i%3*rechteckGroesseg;
            if (i%3 ==0) positiong.y+=9;
            p.rect(positiong.x, positiong.y, rechteckGroesseg, rechteckGroesseg);
          }
        }

        function zeichneLegende() {

          p.textFont (font);
          p.textSize(11);
          p.noStroke();
        
          p.fill(0);
          p.text("rent index", p.width*0.08, p.height*0.865);
        
          p.fill(255);
          p.stroke(0);
          p.strokeWeight(2);
          p.rectMode(p.CENTER);
          p.rect(p.width*0.05, p.height*0.86, 10, 10);
        
          p.fill('#A01571');
          p.stroke(0);
          p.ellipse(p.width*0.50, p.height*0.05, 11, 11);
          p.fill(0);
          p.noStroke();
          p.text("bafög", p.width*0.53, p.height*0.05);
        
          p.fill('#A0157160');
          p.stroke(0);
          p.ellipse(p.width*0.68, p.height*0.05, 11, 11);
          p.fill(0);
          p.noStroke();
          p.text("starting salary", p.width*0.71, p.height*0.05);
        
        
          p.fill('#EBC915');
          p.stroke(0);
          p.ellipse(p.width*0.05, p.height*0.91, 11, 11);
          p.fill(0);
          p.noStroke();
          p.text("economics", p.width*0.08, p.height*0.92);
        
          p.fill('#48558A');
          p.stroke(0);
          p.ellipse(p.width*0.30, p.height*0.91, 11, 11);
          p.fill(0);
          p.noStroke();
          p.text("graphicdesign", p.width*0.33, p.height*0.92);
        
          p.fill('#54398A');
          p.stroke(0);
          p.ellipse(p.width*0.58, p.height*0.91, 11, 11);
          p.fill(0);
          p.noStroke();
          p.text("architecture", p.width*0.61, p.height*0.92);
        
          p.fill('#A01571');
          p.stroke(0);
          p.ellipse(p.width*0.05, p.height*0.95, 11, 11);
          p.fill(0);
          p.noStroke();
          p.text("nursing", p.width*0.08, p.height*0.96);
        
          p.fill('#A74B0B');
          p.stroke(0);
          p.ellipse(p.width*0.30, p.height*0.95, 11, 11);
          p.fill(0);
          p.noStroke();
          p.text("engineering", p.width*0.33, p.height*0.96);
        
          p.fill('#33663B');
          p.stroke(0);
          p.ellipse(p.width*0.58, p.height*0.95, 11, 11);
          p.fill(0);
          p.noStroke();
          p.text("social work", p.width*0.61, p.height*0.96);
        }


        function drawBottomTimeline() {
          let ticks = 101;
          let tickSeparation = (p.width-p.width*0.14)/ticks;
          p.strokeWeight(1);
          p.noFill();
          p.stroke(0);
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
          p.noFill();
          p.stroke(0);
          p.strokeWeight(2);
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


        let mausSensitivitaet = 0.05; // Wie sensibel reagiert das System auf die Scroll-Geste? Kleinere Werte = weniger sensibel
        p.mouseWheel = function (event) {
          let aenderungDurchMaus = event.delta * mausSensitivitaet;
          console.log(aenderungDurchMaus);
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
        



      };
        
  export default sketch4;
      