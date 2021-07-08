const s3 = p => {

  p.destroySketch = false;

  //let mausSensitivitaet = .3; // Wie sensibel reagiert das System auf die Scroll-Geste? Viel scrollen, viel Details
  let mausSensitivitaet = 1; // Wie sensibel reagiert das System auf die Scroll-Geste? Weniger scrollen, weniger Details

  let progress;

  //let path="/home/andre/sose2021/spekvis/p/sketch_DatVis_apgw_20210629/";
  let path = "./";

  let x, xML, xA;

  let cML = p.color('0x33eb9d15'); // orange
  let cMLfull = p.color('0xFFeb9d15'); // orange
  let cA = p.color('0x662e3759'); // dark blue top
  let cAfull = p.color('0xFF2e3759'); // dark blue top
  let cT = p.color('0xFFcfc9b8'); // beige top
  let cTmin = p.color('0x33cfc9b8'); // beige top
  let cTyear = cMLfull;
  let cLyear = p.color('0x337ed957'); // light green bottom transparent
  let cL = p.color('0xff223e17'); // green top

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
    let wh = window.innerHeight;
    let ww = wh / 2.166666;
    return {
      x: ww,
      y: wh
    }
  }

  p.windowResized = function () {
    p.resizeCanvas(setCanvas().x, setCanvas().y);
  };

  p.preload = function () {

  }


  p.setup = function () {
    p.createCanvas(setCanvas().x, setCanvas().y);

    co2 = "CO\u2082";

    min = height / 13; // Platz für Bereich für Legende

    // Schriftgrößen
    tSizeML = width / 18.5;
    tSizeYear = width / 24.4;
    //tSizeInfo=tSizeYear;
    tSizeInfo = width / 33.3;
    tSizeA = tSizeML;

    // dynamische Textgrößen der Kurven je y-Wert
    //minTextML = tSizeML/2.5;
    minTextML = tSizeML / 1.5;
    maxTextML = tSizeML * 10;

    minTextA = tSizeA / 5;
    maxTextA = tSizeA * 13;

    textSize(width / 12);
    fReg = createFont("maxiReg.otf", tSizeYear);
    fIta = createFont("maxiIta.otf", tSizeYear);
    fMed = createFont("maxiMed.otf", tSizeYear);
    fMedIta = createFont("maxiMedIta.otf", tSizeYear);

    textFont(fReg);

    // load the table(s)
    int tabrandom = int(random(1, 3.1));
    String tablefile = path + "apgw_scenarios" + tabrandom + ".csv";
    //println(tablefile);
    tab = loadTable(tablefile, "header");
    //datML=new Datenpunkt[tabML.getRowCount()];

    // Timeline wird von "Mouna Loa"-Daten bestimmt,
    // für Zukunft muss neu generiert werden.
    rowCount = tab.getRowCount();

    // Table columns:
    // Yr,Mn,Mouna Loa CO2 fit [ppm],Adobe net income [Millions of US$],c1.5,c3.0,cbase,c4.0,a1,a2,a3
    yTitleML = tab.getColumnTitle(2);
    yTitleA = tab.getColumnTitle(3);

    // Select wich columns to use for speculations + create arrays
    spekselect();

    // +2, weil links und rechts ein space
    xSpace = width / (displayRows);

    // Rechts-Links-Verschiebung der Graphen
    //xAdjust=width/33; 
    xAdjust = width / 12;
    xAdjustML = width / 3;
    xAdjustA = width / 3;

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

export default s3;
