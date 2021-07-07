const s2 = p => {

  p.destroySketch = false;

  //SETTINGS
  let title = "GENDER FLUIDS";
  let description = "Eine Frage und Spekulation über die Zukunft \nund Grenzen von Geschlechterkategorien.";

  let mousSensetivity = 0.1;    // Wie sensibel reagiert das System auf die Scroll-Geste? Kleinere Werte = weniger sensibel
  let startSmooth = 0.001;    //smoothness von den Kanten der Metaballs zu Beginn der Animation 
  let endSmooth = 0.0075;    //smoothness von den Kanten der Metaballs am Ende der Animation 
  let startingYear = 1971;    //Beginn der ersten Phase aka. Erstes Jahr
  let lastSetYear = 2017;    //Ende der ersten Phase
  let diversePhaseEnd = 2030;    //Jahr an dem die zweite Phase Endet
  let years = 100;    //Anzahl an gesamt abgebildeten Jahren
  let genders = p.floor(p.random(20, 50));    //Hier wird festgelegt, wie viele Geschlechter am ende der Animation exisiteren.
  let boarderDist = 60;    //Distanz zum Rand (Für Overlay)
  let femalePos = 0.85;    //Relative Y-Position vom Kreis des Frauenanteils
  let malePos = 0.3;    //Relative Y-Position vom Kreis des Männeranteils
  let diversePos = (femalePos + malePos) / 2;    //Relative Y-Position vom Kreis des Diversanteil (Mitte aus Frauenkreis und Männerkreis)
  let fontColor = p.color(255);    //Schriftfarbe vom Overlay

  let ani;    // Variable für den Fortschritt
  let endOfFirstPhase = lastSetYear - startingYear;
  let endOfSecondPhase = diversePhaseEnd - startingYear;
  let boarderWidth;
  let boarderSoft;

  let data;    //neue Tabelle die aus dem Datensatz und der generierten Zukunft erstellt wird
  let pastData;    //vorhandener Datensatz

  let metaballs;    //Shader, der die Metaballs erstellt.
  let img;    //In dem Image werden die Position und Radius von den Metaballs gespeichert. Das Bild wird an den Shader weitergegeben. Dieser zieht sich die Daten daraus um die Metaballs zu generieren.

  //Fonts
  let headerFont;
  let subheaderFont;
  let detailFont;
  let copyFont;

  let prediction = [];  //ArrayList in der Anteile in der Zukunft gespeichert werden.


  function setCanvas() {
    /* set canvas dimensions according to 19,5 : 9 ==> iPhone11 ration */
    let wh = window.innerHeight;
    let ww = wh / 2.166666;
    return {
      x: ww,
      y: wh
    }
  }

  p.windowResized = function () {
    p.resizeCanvas(setCanvas().x, setCanvas().y, this.WEBGL);
  };


  p.preload = function () {

    //metaballs = p.loadShader("../../assets/shader/Metaballs_OwnColor.frag");    //import von shader
    pastData = p.loadTable("../../assets/data/02_GenderData.csv", "header");    //import von Datensatz
    //data = new Table();    //Neue Tabelle für generierten Datensatz wird erstellt.
    img = p.createImage(genders, years); //Das Image für den Shader wird erstellt. Die Pixel in der Y-Achse/Höhe stehen für die Jahre und die X-Achse/Breite steht für ein Geschlecht (Richtet sich also nach der oben eingefügten Variable für Gender)

    //Import der Fonts
    headerFont = p.loadFont("../../assets/fonts/MaximaNowTBProMedium.otf"); // 30
    subheaderFont = p.loadFont("../../assets/fonts/MaximaNowTBProMedium.otf"); // 26
    copyFont = p.loadFont("../../assets/fonts/MaximaNowTBProRegular.otf"); //16
    detailFont = p.loadFont("../../assets/fonts/MaximaNowTBProRegular.otf"); //16

  }


  //import java.util.*;

  p.setup = function () {
    p.createCanvas(setCanvas().x, setCanvas().y, this.WEBGL);
    p.noStroke();

    generateFuture();
  }

  p.draw = function () {

    p.background(25);

    if (p.destroySketch == true) {
      p.remove();
      console.log('destroyed')
    }

    animation();  // Jegliche Art von Entwicklungen über den Verlauf der Animation werden hier berechnet. 
    sendDataToShader();   // Senden von Informationen und Daten an den Shader

    // Der shader wird hier angewendet auf das Rechteck was über die gesamte Größe geht.
    p.fill(255);
    p.shader(metaballs);
    p.rect(0, 0, p.width, p.height);
    p.resetShader();

    drawOnShader();   //Alles weitere was noch über den Shader drüber kommt.

  }

  // Hier werden weitere Sachen über den Shader geschrieben (Im wesentlichen das Overlay aus Jahreszahlen und Balken, sowie Titel und Beschreibung. 
  function drawOnShader() {
    drawPortions(); // Hier werden die Anteile der Geschlechter auf die Kreise geschrieben.
    drawProgress();
    drawBottomTimeline();
    drawTitle();
  }

  function sendDataToShader() {
    //metaballs.set(a, b) sagt quasi: "Im Shader Metaball bestimme die Variable a und setzte sie mit b gleich. A ist dabei ein zu vegebener Name und b ist der Wert. 
    metaballs.setUniform("iResolution", p.float(p.width), p.float(p.height));
    metaballs.setUniform("iAni", p.map(ani, 0, 100, 0, 1));
    metaballs.setUniform("img", img);
    metaballs.setUniform("iBlobCount", genders);
    metaballs.setUniform("iBoarderWidth", boarderWidth);
    metaballs.setUniform("iMalePos", malePos);
    metaballs.setUniform("iFemalePos", femalePos);
  }


  // GENERATE FUTURE 
  function generateFuture() {
    // Hinzufügen der Columns. Eine Colum pro Geschlecht
    for (let col = 0; col < genders; col++) {
      data.addColumn(p.str(col));
    }

    // Hinzufügen der Rows. Eine Row pro Jahr. ZUunäcsht wird alles mit 0 gefüllt (wahrescheinlich nicht notwendig?)
    for (let row = 0; row < years; row++) {
      let newRow = data.addRow();
      for (let i = 0; i < data.getColumnCount(); i++) {
        newRow.set(p.str(i), 0);
      }
    }


    //Hier wird bestimmt, welchen Anteil männlich, weiblich und divers am ende der zweiten Phase haben sollen
    data.set(endOfSecondPhase, 0, 46);
    data.set(endOfSecondPhase, 1, 47);
    data.set(endOfSecondPhase, 2, 7);

    n_random(100, genders); //Anteil aller Geschlechter im Jahre 2071. Alle Anteile ergeben zusammen 100%. Anteile werden im Array prediction gespeichert.

    // Anteile im Jahre 2071 werden in die letzte Reihe der Tabelle Geschrieben.
    for (int i = 0; i < genders; i++) {
      int thisPrediction = prediction.get(i);
      data.setInt(years, i, thisPrediction);
    }

    // Berechnung der Interpolation zwischen den verschiedenen Phasen
    for (let col = 0; col < genders; col++) {
      let delay = 0; //delay wird genutzt um später alle Geschlechter nach und nach hinzuzufügen
      if (col > 2) { delay = col; } // Kein Delay für colum 0, 1, 2 (Colum 0, 1, 2 sind Männlich, weiblich und Divers)
      for (let row = 0; row < years; row++) {
        //Variabeln für folgende Berechnung: lerpPrediction = lerp(lerpStart, lerpEnd, lerpStatus)
        let lerpPrediction = 0;
        let lerpStatus = 0;
        let lerpStart = 0;
        let lerpEnd = 0;

        //WRITE PHASE 1 (EXISTING DATA)
        if (row < pastData.getRowCount()) {
          let tableRow = pastData.getRow(row);
          let male = tableRow.getFloat("male");
          let female = tableRow.getFloat("female");
          data.setNum(row, 0, male);
          data.setNum(row, 1, female);
        }

        //WRITE PHASE 2 ( DIVERSE GROWTH )
        if (row > endOfFirstPhase && row <= endOfSecondPhase && col <= 2) {
          lerpStatus = p.float(row - endOfFirstPhase) / p.float(endOfSecondPhase - endOfFirstPhase);
          lerpStart = data.getFloat(endOfFirstPhase, col);
          lerpEnd = data.getFloat(endOfSecondPhase, col);
          lerpPrediction = p.lerp(lerpStart, lerpEnd, lerpStatus);
          data.setFloat(row, col, lerpPrediction);
        }

        //WRITE PHASE 3 ( MULTIPLE GENDER GROWTH )
        if (row > endOfSecondPhase + delay && row <= data.getRowCount()) {
          lerpStatus = p.float(row - endOfSecondPhase - delay) / p.float(years - endOfSecondPhase - delay);
          lerpStart = data.getFloat(endOfSecondPhase, col);
          lerpEnd = data.getFloat(years, col);
          lerpPrediction = p.lerp(lerpStart, lerpEnd, lerpStatus);
          data.setFloat(row, col, lerpPrediction);
        }
      }
    }

    //Image wird aus der oben genertierten Tabelle geschrieben.
    //r -> X-Position
    //g -> Y-Position
    //b -> Radius
    img.loadPixels();
    for (let col = 0; col < genders; col++) {

      let r = p.random(25, 230); // der Rotanteil im Bild ist später die x-Position der Metaballs
      let g = p.random(.05, .95) * 255; // der Grünanteil im Bild ist später die y-Position der Metaballs

      // x und y Position ist für die ersten drei Colums (männlich, weiblich, divers) fest gesetzt.
      if (col == 0) { r = 255 * .5; g = malePos * 255; };
      if (col == 1) { r = 255 * .5; g = femalePos * 255; };
      if (col == 2) { r = 255 * .5; g = diversePos * 255; };

      for (let row = 0; row < years; row++) {
        let index = col + row * genders;
        let b = 0;
        if (col <= 1) { b = p.map(data.getFloat(row, col), 0, 100, 0, 255); }
        else { b = p.map(data.getNum(row, col), 0, 10, 0, 255); }

        img.pixels[index] = p.color(r, g, b);
      }
    }
  }




};

export default s2;
