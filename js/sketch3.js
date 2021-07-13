const sketch3 = p => {

  p.destroySketch = false;

  //let mausSensitivitaet = .3; // Wie sensibel reagiert das System auf die Scroll-Geste? Viel scrollen, viel Details
  let mausSensitivitaet = 0.1; // Wie sensibel reagiert das System auf die Scroll-Geste? Weniger scrollen, weniger Details

  let progress;

  let x, xML, xA;

  let cML = '#eb9d1533'; // orange
  let cMLfull = '#eb9d15FF'; // orange
  let cA = '#2e375966'; // dark blue top
  let cAfull = '#2e3759FF'; // dark blue top
  let cT = '#cfc9b8FF'; // beige top
  let cTmin = '#cfc9b833'; // beige top
  let cTyear = cMLfull;
  let cLyear = '#7ed95733'; // light green bottom transparent
  let cL = '#223e17ff'; // green top

  let yML, yYearML, yA;
  let tSizeYear, tSizeInfo, tSizeML, tSizeA;
  let minTextML, maxTextML;

  let yMinML = 320;
  let yMaxML = 555;

  let minTextA, maxTextA;

  let yMinA = -300;
  let yMaxA = 5000;

  let yRawML, yRawA;

  let tab;

  let yTitleML, yTitleA, spekTitleML, spekTitleA;
  let datumML, datumA;

  let year, month;

  // Platzierung und sichtbarer Bereich
  let min, xAdjust, xAdjustML, xAdjustA, lineX;
  let xSpace, rowCount, startRow;

  // Gleichzeitig angezeigte Datensätze (= Monate).
  // Hieraus wird auch xSpace berechnet
  let displayRows = 144;

  let fReg, fIta, fMed, fMedIta;
  let co2;

  let checkYear, tmonth, tyear;

  let startYear = 1971;
  let stopYear = 2071;
  let startMonth = 8;
  let stopMonth = 8;

  let lastMLyear = 2021;
  let lastAyear = 2021;
  let lastMLmonth = 4;
  let lastAmonth = 2;

  let spekLerpML = [];
  let spekLerpA = [];
  let lerpStartML, lerpStartA, lerpStopA, lerpStopML, lerpBeforeA, lerpBeforeML, lerpCountML, lerpCountA;
  let spekindexA, spekindexML;

  let was55 = false, was45 = false, newZero = false;

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

    let tabrandom = p.round(p.random(0, 2));
    console.log(tabrandom)
    tab = p.loadTable(`../../assets/data/03_apgw_scenarios${tabrandom}.csv`, 'csv', "header");

    fReg = p.loadFont("../assets/fonts/MaximaNowTBProRegular.otf");
    fIta = p.loadFont("../assets/fonts/MaximaNowTBProRegularItalic.otf");
    fMed = p.loadFont("../assets/fonts/MaximaNowTBProMedium.otf");
    fMedIta = p.loadFont("../assets/fonts/MaximaNowTBProMediumItalic.otf");
  }


  p.setup = function () {
    p.createCanvas(setCanvas().x, setCanvas().y);

    co2 = "CO\u2082";
    p.colorMode(p.RGB, 255,255,255);

    min = p.height / 13; // Platz für Bereich für Legende

    // Schriftgrößen
    tSizeML = p.width / 18.5;
    tSizeYear = p.width / 24.4;
    //tSizeInfo=tSizeYear;
    tSizeInfo = p.width / 33.3;
    tSizeA = tSizeML;

    // dynamische Textgrößen der Kurven je y-Wert
    //minTextML = tSizeML/2.5;
    minTextML = tSizeML / 1.5;
    maxTextML = tSizeML * 10;

    minTextA = tSizeA / 5;
    maxTextA = tSizeA * 13;

    p.textSize(p.width / 12);
    p.textFont(fReg);

 

    // load the table(s)
    
    //println(tablefile);
    //datML=new Datenpunkt[tabML.getRowCount()];

    // Timeline wird von "Mouna Loa"-Daten bestimmt,
    // für Zukunft muss neu generiert werden.
    rowCount = tab.getRowCount();

    // Table columns:
    // Yr,Mn,Mouna Loa CO2 fit [ppm],Adobe net income [Millions of US$],c1.5,c3.0,cbase,c4.0,a1,a2,a3
    yTitleML = 'Mouna Loa CO2 fit [ppm]';    //tab.getColumnTitle(2);
    yTitleA = 'Adobe net income [Millions of US$]' //tab.getColumnTitle(3);

    // Select wich columns to use for speculations + create arrays
    spekselect();

    // +2, weil links und rechts ein space
    xSpace = p.width / (displayRows);

    // Rechts-Links-Verschiebung der Graphen
    //xAdjust=width/33; 
    xAdjust = p.width / 12;
    xAdjustML = p.width / 3;
    xAdjustA = p.width / 3;

    // Now Arrow/Year-Position
    lineX = xAdjustML + 0.5 * tSizeYear;

    // startRow soll am Anfang genau 50 Jahre Mitte sein, also: 2021 08
    //startRow=(rowCount/2);
    progress = 50;

  }



  p.draw = function () {

    if (p.destroySketch == true) {
      p.remove();
      console.log('destroyed')
    }

    p.background(0);

    startRow=p.int(p.map(progress, 0, 100, 0, rowCount-1));
    //println("startRow " + startRow);
    //println(rowCount);
  
    // re-compute speculation if going over middle
    //println(progress);
    if (progress >= 55 || progress <= 45 ) {
      was55=true;
      was45=true;
    } else if (progress == 50 && (was55==true || was45==true)) {
      spekselect(); // Select spec-columns + create arrays
      was55=false;
      was45=false;
    }
  
    // year für Anzeige einmal via startRow ermitteln
    let datensatzYear = tab.getRow(startRow);
    month = datensatzYear.getNum("Mn"); //getInt
    //println(month);
    year = datensatzYear.getNum("Yr"); //getInt
    //datumML= year + " " + month;
    //println(datumML);
  
    // Single draw per frame functions
    myYear();
    drawInfo();
    drawProgress();
    drawBottomTimeline();
  
    // Select startposition for range
    let realStartRow = 1;
    if (startRow > displayRows/2) {
      realStartRow=startRow-displayRows/2;
    }
    if (startRow <= displayRows/2) {
      realStartRow=1;
    }
  
    // Tablestructure:
    // Yr,Mn,Mouna Loa CO2 fit [ppm],Adobe net income [Millions of US$],c1.5,c3.0,cbase,c4.0,a1,a2,a3
  
    for (let i=realStartRow; i<(startRow+displayRows/2) && i < rowCount; i++) {
      //println("i " + i);
      let datensatz = tab.getRow(i);
  
      let checkYear=datensatz.getNum("Yr");
      let checkMonth=datensatz.getNum("Mn");
      //println(checkYear);
      //println(checkMonth);
      if (checkYear==lastMLyear && checkMonth>lastMLmonth) {
        //println(checkYear + " " + checkMonth);
        yRawML=spekLerpML[i];
        //yRawML=yRawML*0.992;
        //yRawML=yRawML+noise(i);
      } else if (checkYear>lastMLyear) {
        yRawML=spekLerpML[i];
        yRawML=yRawML+p.noise(i);
      } else {
        yRawML=datensatz.getNum(yTitleML);
      }
      let yMapML=p.map(yRawML, yMinML, yMaxML, min, p.height-2*min);
      yML = p.height-yMapML;
      //println(yML);
  
      if (checkYear==lastAyear && checkMonth>lastAmonth) {
        //println(checkYear + " " + checkMonth);
        yRawA=spekLerpA[i];
        yRawA=yRawA+p.noise(i);
        //yRawA=yRawA*0.992;
      } else if (checkYear>lastAyear) {
        yRawA=spekLerpA[i];
        yRawA=yRawA+p.noise(i);
      } else {
        yRawA=datensatz.get(yTitleA);
      }
      let yMapA=p.map(yRawA, yMinA, yMaxA, min, p.height-2*min);
      yA = p.height-yMapA; 
  
      //x = i-startRow+xAdjust;
      xML = (i-startRow)*xSpace+xAdjustML;
      xA = (i-startRow)*xSpace+xAdjustA;
  
      // The Curves
      myDraw();
  
      // DEBUG:
      //println(startRow);
      //println(x, yML, yA, displayRows, startRow);
    }




  }


  function spekselect() {

    // Select speculative CO2-scenario
    let randomML=p.int(p.random(1, 4.1));
    switch(randomML) {
    case 1: 
      spekTitleML="c1.5";
      break;
    case 2: 
      spekTitleML="c3.0";
      break;
    case 3: 
      spekTitleML="cbase";
      break;
    case 4: 
      spekTitleML="c4.0";
      break;
    default:
      spekTitleML="Mouna Loa CO2 fit [ppm]";
      break;
    }
  
    // Select speculative Adobe-scenario
    let randomA=p.int(p.random(1, 3.1));
    switch(randomA) {
    case 1: 
      spekTitleA="a1";
      break;
    case 2: 
      spekTitleA="a2";
      break;
    case 3: 
      spekTitleA="a3";
      break;
    default:
      spekTitleA="Adobe net income [Millions of US$]";
      break;
    }
    //println(spekTitleML);
    //println(spekTitleA);
    spekLerpML = new Array(rowCount);
    spekLerpA = new Array(rowCount);
  
    //int startYear=1971;
    //int stopYear=2071;
    //int startMonth=8;
    //int stopMonth=8;
  
    //int lastMLyear=2021;
    //int lastAyear=2021;
    //int lastMLmonth=4;
    //int lastAmonth=2;
    lerpCountA=1;
    lerpCountML=1;
    for (let t = 0; t < rowCount; t++) {
      if (t==0) {
        tmonth=startMonth;
        tyear=startYear;
      }
      //println(tyear + " " + tmonth);
  
      let datensatzSpek=tab.getRow(t);
  
      if (tmonth==lastAmonth && tyear==lastAyear) {
        lerpStartA=datensatzSpek.getNum(yTitleA);
        spekLerpA[t]=lerpStartA;
        lerpCountA=0;
        //println("lerpStartA " + lerpStartA);
      }
      if (tmonth==lastMLmonth && tyear==lastMLyear) {
        lerpStartML=datensatzSpek.getNum(yTitleML);
        spekLerpML[t]=lerpStartML;
        lerpCountML=0;
        //println("lerpStartML " + lerpStartML);
      }
      if (tmonth==stopMonth && tyear==lastAyear) {
        lerpStopA=datensatzSpek.getNum(spekTitleA);
        spekLerpA[t]=lerpStopA;
        for (let aa=1; aa<lerpCountA; aa++) {
          //println(lerpCountA);
          //println(aa);
          let amtA=aa/lerpCountA;
          //println(amtA);
          spekindexA=t-p.int(lerpCountA)+aa;
          spekLerpA[spekindexA] = p.lerp(lerpStartA, lerpStopA, amtA);
          //println(t);
          //println(t-lerpCountA+aa);
          //println("spekLerpA[spekindexA] " + spekLerpA[spekindexA]);
          //println("lerpStopA " + lerpStopA);
          //println("lerpStopML " + lerpStopML);
        }
        lerpCountA=0;
      }
      // HeightGap-Correction for ML-Spekstart
      let spekCorrectML=4.2;
      if (tmonth==stopMonth && tyear==lastMLyear) {
        lerpStopML=datensatzSpek.getNum(spekTitleML)-spekCorrectML;
        spekLerpML[t]=lerpStopML;
        for (let mm=1; mm<lerpCountML; mm++) {
          //println(lerpCountML);
          //println(mm);
          let amtML=mm/lerpCountML;
          //println(amtML);
          spekindexML=t-p.int(lerpCountML)+mm;
          spekLerpML[spekindexML] = p.lerp(lerpStartML, lerpStopML, amtML);
          //println(t);
          //println(t-int(lerpCountML)+mm);
          //println("spekLerpML[spekindexML] " + spekLerpML[spekindexML]);
          //println("lerpStopA " + lerpStopA);
          //println("lerpStopML " + lerpStopML);
        }
        lerpCountML=0;
      }
      // as long as A und ML start in same year
      // it is OK to use just one as selector
      if (tmonth==stopMonth && tyear>lastAyear && tyear<=stopYear) {
        lerpStartA=lerpStopA;
        lerpStartML=lerpStopML;
        lerpStopA=datensatzSpek.getNum(spekTitleA);
        spekLerpA[t]=lerpStopA;
        lerpStopML=datensatzSpek.getNum(spekTitleML)-spekCorrectML;
        spekLerpML[t]=lerpStopML;
        //println("lerpStartA " + lerpStartA);
        //println("lerpStartML " + lerpStartML);
        //println("lerpStopA " + lerpStopA);
        //println("lerpStopML " + lerpStopML);
        for (let mm=1; mm<lerpCountA; mm++) {
          //println("lerpCountA " + lerpCountA);
          //println("mm " + mm);
          let amtA=mm/lerpCountA;
          //println(amtA);
          spekindexA=t-p.int(lerpCountA)+mm;
          spekLerpA[spekindexA] = p.lerp(lerpStartA, lerpStopA, amtA);
          spekindexML=t-p.int(lerpCountA)+mm;
          spekLerpML[spekindexML] = p.lerp(lerpStartML, lerpStopML, amtA);
          //println("t " + t);
          //println(t-int(lerpCountA)+mm);
          //println("spekLerpML[spekindexML] " + spekLerpML[spekindexML]);
          //println("spekLerpA[spekindexA] " + spekLerpA[spekindexA]);
        }
        lerpCountA=0;
      }
      if (tmonth==12) {
        tmonth=0;
        tyear++;
      }
      tmonth++;
      lerpCountA++;
      lerpCountML++;
    }
    //printArray(spekLerpML);
    //printArray(spekLerpA);
    //println(spekTitleML);
    //println(spekTitleA);
  }



  function myDraw() {

    // Adobe /////////////////////////////////
    if ( isNaN(yA) ) {   // Float.isNaN(yA)
      p.fill(0);
      p.stroke(0);
    } else {
      p.fill(cA);
      p.stroke(0);
      // dynamische Änderung Schriftgröße:
      let tSizeA=p.map(yRawA, yMinA, yMaxA, minTextA, maxTextA);
      if (tSizeA<0) {
        tSizeA=p.sqrt(tSizeA);
      }
      p.textAlign(p.CENTER);
      p.textFont(fMed);
      p.textSize(tSizeA);
      p.noStroke();
      //text("A$", x*xSpace+xAdjust, yA);
      p.text("A$", xA, yA);
    }
  
    // Mouna Loa CO2 /////////////////////////
    p.fill(cML);
    // dynamische Änderung Schriftgröße:
    let tSizeML=p.map(yRawML, yMinML, yMaxML, minTextML, maxTextML);
    if (tSizeML<0) {
      tSizeML=p.sqrt(tSizeML);
    }
    p.textAlign(p.CENTER);
    p.textFont(fMed);
    p.textSize(tSizeML);
  
    //text(co2, x*xSpace, yML);
    p.text(co2, xML, yML);
  
    // Circle /////////////////////////////
    //fill(cML);
    //circle(lineX, height/2, yA);
    //fill(cA);
    //line(lineX, 0.7*min, lineX, height-1.7*min);
  }


  // year /////////////////////////////////
function myYear() {
  // Line
  //stroke(cLyear);
  //stroke(cTmin);
  p.stroke(cT);
  //strokeWeight(2.2*tSizeYear);
  p.strokeWeight(2);
  //strokeCap(SQUARE);
  p.line(lineX, 3*tSizeYear, lineX, p.height-.93*min-2.6*tSizeYear);
  //line(lineX, height-1.3*min, 1.04*lineX, height-1.15*min);
  //line(lineX, height-1.3*min, 0.96*lineX, height-1.15*min);
  //stroke(cA);
  //line(lineX, height-0.7*min, lineX, height-1.7*min);

  // Zahl
  //fill(cTyear);
  p.fill(cT);
  p.textAlign(p.CENTER);
  p.textFont(fReg);
  p.textSize(tSizeYear);
  p.noStroke();
  //text(year, lineX, tSizeYear);
  //text(year, lineX, height-.93*min);
  p.text(year, lineX, 2.5*tSizeYear);
  //text(year, lineX, height-.93*min-1.65*tSizeYear);
  p.text(year, lineX, p.height-min-1.2*tSizeYear);
}


// Info ////////////////////////////////////
function drawInfo() {

  let left=p.width-(p.width*0.93);
  let right=p.width*0.93;

  p.fill(cT);
  p.noStroke();
  p.textAlign(p.LEFT);
  p.textFont(fReg);
  p.textSize(tSizeInfo);
  //text("»Wachstum?«", left, height-.93*min);
  p.text("Wachstum.", left, p.height-.93*min);
  p.textAlign(p.RIGHT);
  //text("»Growth?«", right, height-.93*min);
  p.text("Growth.", right, p.height-.93*min);

  p.textAlign(p.LEFT);
  p.fill(cMLfull);
  p.textFont(fReg);
  p.textSize(tSizeInfo);

  p.text(co2 + " Concentration at Mouna Loa Observatory (in parts per million) ", left, p.height-min+1.65*tSizeInfo);

  p.fill(cAfull);
  p.textFont(fReg);
  p.textSize(tSizeInfo);

  p.text("Adobe quarterly Net Income (in millions US$, monthly interpolated)", left, p.height-min+2.85*tSizeInfo);
}


// Timeline ///////////////////////////////
function drawBottomTimeline() {
  let ticks = 101;
  let tickSeparation = (p.width-p.width*0.14)/ticks;
  p.strokeWeight(1);
  p.noFill();
  p.stroke(cT);
  for (let i = 0; i < ticks; i++) {
    let tickHeight = p.height*0.995;
    if (i%10 == 0) {
      tickHeight = p.height*0.985;
    }
    p.line(p.width*0.07+i*tickSeparation+tickSeparation/2, p.height, p.width*0.07+i*tickSeparation+tickSeparation/2, tickHeight);
  }
}

// Progress ////////////////////////////////
function drawProgress() {
  p.noFill();
  p.stroke(cT);
  p.strokeWeight(4);
  let lineWidth;

  if (progress <= 50) {
    lineWidth = p.map(progress, 0, 50, p.width/2, p.width*0.07);
    let positionLeft = p.map(progress, 0, 50, p.width*0.07, p.width/2);
    p.line(positionLeft, p.height*0.98, positionLeft+lineWidth-p.width*0.07, p.height*0.98);
  } else {
    lineWidth = p.map(progress, 50, 100, p.width/2, p.width-p.width*0.07);
    p.line(p.width/2, p.height*0.98, lineWidth, p.height*0.98);
  }
}

p.mouseWheel = function (event) {
  let aenderungDurchMaus = event.delta * mausSensitivitaet;
  if (progress+aenderungDurchMaus >= 0 && progress+aenderungDurchMaus <= 100) {
    progress += aenderungDurchMaus;
  }
}




let touchSensitivty = 2;
let sketchContainer = document.querySelector('.sketchContainer');
const hammertime = new Hammer(sketchContainer);
  hammertime.on('pan', function(ev) {
  //console.log(ev);
  if (progress + ev.overallVelocityY >= 0 && progress + ev.overallVelocityY <= 100) {
    progress += ev.overallVelocityY * touchSensitivty;
  }
});

p.touchMoved = function(e) {
//    //console.log(e.touches[0].clientY);
//   //  let touched = e.touches[0].clientX;
//   //  let touchChange = p.map(touched,0,window.innerWidth,2,-2);

//   //  let change = touchChange;
//   //  if (progress + change >= 0 && progress + change <= 100) {
//   //    progress += change * touchSensitivty;
//   //  }
  return false;
}



  /*   p.mouseWheel = function (e) {
      rotation += p.map(e.delta, -100, 100, -5, 5);
      return false;
    }
  
    p.touchMoved = function (e) {
      console.log(e.touches[0].clientY);
      let touched = e.touches[0].clientY;
      rotation += p.map(touched, 0, window.innerHeight, -5, 5);
      return false;
    } */




};

export default sketch3;
