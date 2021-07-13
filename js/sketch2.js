const sketch2 = p => {

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

  let ani = 0.0;    // Variable für den Fortschritt
  let endOfFirstPhase = lastSetYear - startingYear;
  let endOfSecondPhase = diversePhaseEnd - startingYear;
  let boarderWidth = 0.0;
  let boarderSoft = 0.0;

  let data = new p5.Table();    //neue Tabelle die aus dem Datensatz und der generierten Zukunft erstellt wird
  let pastData = new p5.Table();    //vorhandener Datensatz



  let metaballs;    //Shader, der die Metaballs erstellt.
  let img;    //In dem Image werden die Position und Radius von den Metaballs gespeichert. Das Bild wird an den Shader weitergegeben. Dieser zieht sich die Daten daraus um die Metaballs zu generieren.

  //Fonts
  let headerFont;
  let subheaderFont;
  let detailFont;
  let copyFont;

  let prediction = new Array(genders);  //ArrayList in der Anteile in der Zukunft gespeichert werden.

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
    p.resizeCanvas(setCanvas().x, setCanvas().y, this.WEBGL);
  };


  p.preload = function () {

    metaballs = p.loadShader("../../assets/shader/metaballs_vert.vert", "../../assets/shader/Metaballs_CiColor.frag");    //import von shader
    pastData = p.loadTable("../../assets/data/02_GenderData.csv", "csv", "header");    //import von Datensatz

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

    //console.log(data);
    img = p.createImage(genders, years); //Das Image für den Shader wird erstellt. Die Pixel in der Y-Achse/Höhe stehen für die Jahre und die X-Achse/Breite steht für ein Geschlecht (Richtet sich also nach der oben eingefügten Variable für Gender)
    generateFuture();
  }

  p.draw = function () {

    p.background(25);

    if (p.destroySketch == true) {
      p.remove();
      console.log('destroyed')
    }

    p.translate(-p.width/2, -p.height/2);

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
    metaballs.setUniform("iResolution", [p.float(p.width), p.float(p.height)]);
    metaballs.setUniform("iAni", p.float(p.map(ani, 0, 100, 0, 1)));
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
      data.addColumn(`futureGender${col}`);
    }


    // Hinzufügen der Rows. Eine Row pro Jahr. ZUunäcsht wird alles mit 0 gefüllt (wahrescheinlich nicht notwendig?)
    for (let row = 0; row < years; row++) {
      let newRow = data.addRow();
      for (let i = 0; i < data.getColumnCount(); i++) {
        newRow.setNum(i, 0);
      }
    }


    //Hier wird bestimmt, welchen Anteil männlich, weiblich und divers am ende der zweiten Phase haben sollen
    data.setNum(endOfSecondPhase, 0, 46);
    data.setNum(endOfSecondPhase, 1, 47);
    data.setNum(endOfSecondPhase, 2, 7);

    console.log(data);


    n_random(100, genders); //Anteil aller Geschlechter im Jahre 2071. Alle Anteile ergeben zusammen 100%. Anteile werden im Array prediction gespeichert.

    // Anteile im Jahre 2071 werden in die letzte Reihe der Tabelle Geschrieben.
    for (let i = 0; i < genders; i++) {
      let thisPrediction = prediction[i];
      data.setNum(years - 1, i, thisPrediction);
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
          let male = tableRow.getNum("male");
          let female = tableRow.getNum("female");
          data.setNum(row, 0, male);
          data.setNum(row, 1, female);
        }

        //WRITE PHASE 2 ( DIVERSE GROWTH )
        if (row > endOfFirstPhase && row <= endOfSecondPhase && col <= 2) {
          lerpStatus = p.float(row - endOfFirstPhase) / p.float(endOfSecondPhase - endOfFirstPhase);
          lerpStart = data.getNum(endOfFirstPhase, col);
          lerpEnd = data.getNum(endOfSecondPhase, col);
          lerpPrediction = p.lerp(lerpStart, lerpEnd, lerpStatus);
          data.setNum(row, col, lerpPrediction);
        }

        //WRITE PHASE 3 ( MULTIPLE GENDER GROWTH )
        if (row > endOfSecondPhase + delay && row <= data.getRowCount()) {
          lerpStatus = p.float(row - endOfSecondPhase - delay) / p.float(years - endOfSecondPhase - delay);
          lerpStart = data.getNum(endOfSecondPhase, col);
          lerpEnd = data.getNum(years - 1, col);
          lerpPrediction = p.lerp(lerpStart, lerpEnd, lerpStatus);
          data.setNum(row, col, lerpPrediction);
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
        if (col <= 1) { b = p.map(data.getNum(row, col), 0, 100, 0, 255); }
        else { b = p.map(data.getNum(row, col), 0, 10, 0, 255); }

        img.pixels[index] = p.color(r, g, b);
      }
    }
  }

// Java -> JavaScript new Random()
// https://gist.github.com/raybellis/4c15a1746724be7bd03964e9d03e0c75
// https://stackoverflow.com/questions/53165118/javascript-implementation-of-javas-random-class-that-will-generate-same-sequenc


// class UInt48 {

// 	constructor(n) {
// 		if (n instanceof UInt48) {
// 			Object.assign(this, n);
// 		} else if (typeof n === 'number') {
// 			let w0 = n & 0xffff;
// 			n /= 0x10000;
// 			let w1 = n & 0xffff;
// 			n /= 0x10000;
// 			let w2 = n & 0xffff;
// 			Object.assign(this, { w2, w1, w0 });
// 		}
// 	}

// 	norm() {
// 		if (this.w0 >= 0x10000) {
// 			let carry = Math.floor(this.w0 / 0x10000);
// 			this.w1 += carry;
// 			this.w0 &= 0xffff;
// 		}
// 		if (this.w1 >= 0x10000) {
// 			let carry = Math.floor(this.w1 / 0x10000);
// 			this.w2 += carry;
// 			this.w1 &= 0xffff;
// 		}
// 		this.w2 &= 0xffff;

// 		return this;
// 	}

// 	add(n) {
// 		let tmp = new UInt48(this);

// 		tmp.w0 += n.w0;
// 		tmp.w1 += n.w1;
// 		tmp.w2 += n.w2;

// 		return tmp.norm();
// 	}

// 	xor(n) {
// 		let tmp = new UInt48(this);

// 		tmp.w2 ^= n.w2;
// 		tmp.w1 ^= n.w1;
// 		tmp.w0 ^= n.w0;

// 		return tmp;
// 	}

// 	mul(n) {
// 		let tmp1 = new UInt48(n);
// 		tmp1.w2 = tmp1.w2 * this.w0;
// 		tmp1.w1 = tmp1.w1 * this.w0;
// 		tmp1.w0 = tmp1.w0 * this.w0;
// 		tmp1.norm();

// 		let tmp2 = new UInt48(n);
// 		tmp2.w2 = tmp2.w1 * this.w1;
// 		tmp2.w1 = tmp2.w0 * this.w1;
// 		tmp2.w0 = 0;
// 		tmp2.norm();

// 		let tmp3 = new UInt48(n);
// 		tmp3.w2 = tmp3.w0 * this.w2;
// 		tmp3.w1 = 0;
// 		tmp3.w0 = 0;
// 		tmp3.norm();

// 		return tmp3.add(tmp2).add(tmp1);
// 	}

// 	valueOf() {
// 		return 0x10000 * (0x10000 * this.w2 + this.w1) + this.w0;
// 	}
// }

// class Random {

// 	constructor(seed) {

// 		const mul = new UInt48(0x5deece66d);
// 		const add = new UInt48(0xb);

// 		if (seed === undefined) {
// 			seed = Math.floor(Math.random() * 0x1000000000000);
// 		}

// 		this.setSeed = (n) => {
// 			seed = new UInt48(n).xor(mul);
// 		}

// 		this.setSeed(seed);

// 		this.next = (bits) => {
// 			seed = seed.mul(mul).add(add);
// 			// return ~~(seed / Math.pow(2, 48 - bits));
// 			return (seed / 0x10000) >> (32 - bits);
// 		}

// 		this.nextInt = () => this.next(32);
// 	}
// };



// n_random


function n_random(targetSum, numberOfDraws) {

  // random numbers, just like new Random() in Java
  let ra = Array(numberOfDraws).fill().map(() => Math.round(Math.random() * 100))
  console.log(ra);
  
  //random numbers
  let sum = 0;
  for (let i = 0; i < numberOfDraws; i++) {
      //let next = parseInt(ra.slice(i,i+1)) + 1;
      let next = parseInt(ra.slice(i, i+1)) + 1;
      prediction[i] = next;
      sum += next;
  }
  //console.log(prediction)

  //scale to the desired target sum
  let scale = targetSum / sum;
  sum = 0;
  for (let i = 0; i < numberOfDraws; i++) {
      prediction[i] = parseInt(prediction.slice(i, i+1) * scale);
      sum += prediction[i];
  }

  for (let i = 0; i < targetSum - 1; i++) {
    let index = parseInt(ra.slice(i, i + 1));
    prediction[index] = prediction[index] + 1;
  }

  //take rounding issues into account
/*   while(sum++ < targetSum) {
      let i = parseInt(ra.slice(numberOfDraws, numberOfDraws + 1));
      prediction[i] = prediction[i] + 1;
  } */
}

  //ANIMATION
  function animation() {
    boarderWidth = startSmooth;
    if (ani > 65) {
      boarderWidth = p.map(ani, 65, 100, startSmooth, endSmooth);
    }
  }

  // OVERLAY: Anteile der Geschlechter
  function drawPortions() {
    p.textAlign(p.CENTER);
    p.textFont(detailFont);
    let alpha = 255;

    if (ani > endOfSecondPhase) {
      alpha = p.map(ani, endOfSecondPhase, 100, 255, 0);
    }
    p.fill(fontColor, alpha);
    //console.log(data.getRowCount() + 1);
    let row = p.floor(p.map(ani, 0, 100, 0, data.getRowCount() + 1));
    //console.log(row);
    let femaleSize = p.floor(data.getNum(row, 1));
    let maleSize = p.floor(data.getNum(row, 0));
    let diverseSize = p.floor(data.getNum(row, 2));

    p.text("Frauen", p.width / 2, (1 - femalePos) * p.height);
    p.text(p.str(femaleSize) + "%", p.width / 2, (1 - femalePos) * p.height + 18);

    p.text("Männer", p.width / 2, (1 - malePos) * p.height);
    p.text(p.str(maleSize) + "%", p.width / 2, (1 - malePos) * p.height + 18);

    if (ani > endOfFirstPhase) {
      p.textAlign(p.CENTER);
      p.textFont(detailFont);
      if (ani < endOfSecondPhase) {
        alpha = p.map(ani, endOfFirstPhase, endOfFirstPhase + (endOfSecondPhase - endOfFirstPhase) / 2, 0, 255);
      }
      p.fill(fontColor, alpha);
      p.text("Divers", p.width / 2, (1 - diversePos) * p.height);
      p.text(p.str(diverseSize) + "%", p.width / 2, (1 - diversePos) * p.height + 16);
    }
  }



  // OVERLAY: Titel und Beschreibung
  function drawTitle() {
    p.textAlign(p.LEFT);
    p.textFont(headerFont);
    let boarder = p.width * 0.07;
    p.text(title, boarder, p.height * 0.85);
    p.textFont(copyFont);
    p.text(description, boarder, p.height * 0.85 + 13, 500, p.height);
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
    p.noFill();
    p.stroke(255);
    p.strokeWeight(2);
    let lineWidth;
    let year = p.str(p.floor(p.map(ani, 0, 100, startingYear, startingYear + data.getRowCount())));
    p.fill(255);
    p.textFont(subheaderFont);

    if (ani <= 50) {
      lineWidth = p.map(ani, 0, 50, p.width / 2, p.width * 0.07);
      let positionLeft = p.map(ani, 0, 50, p.width * 0.07, p.width / 2);
      p.line(positionLeft, p.height * 0.98, positionLeft + lineWidth - p.width * 0.07, p.height * 0.98);
      p.text(year, positionLeft, p.height * 0.972);
    } else {
      lineWidth = p.map(ani, 50, 100, p.width / 2, p.width - p.width * 0.07);
      p.line(p.width / 2, p.height * 0.98, lineWidth, p.height * 0.98);
      p.text(year, lineWidth, p.height * 0.972);
    }


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



};

export default sketch2;
