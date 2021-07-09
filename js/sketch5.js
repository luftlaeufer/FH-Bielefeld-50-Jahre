const sketch5 = (p) => {

    p.destroySketch = false;

     let Graph1; //Graph  //Der Sketch hat ein Objekt Graph1 alle Graphendarstellungen werden daruch getätigt
     let Static1; //Static

    let font;

    let fortschritt = 0; // fortschritt ist IMMER von 0 100 alle anderen Variablen this.mappen darauf
    let maxHeight; // bezieht sich auf die maximale pixelHöhe wobei height ein auschnitt aus 0 - maxheight ist

    let ausmasse; //Ausmaße ist die Skalierung der anzuzeigenden Daten 
    let position; //Position verschiebt das Koordinatensystem

    let farben1; // farben1 ist ne Tabelle mit den Fraben bis in die Gegenwart 2 für die Zukunft
    let farben2; // 0 ist immer BG, 1 die tabelle und der Rest der Gaph

    let worter1;
    let worter2;
    let worter3;

    let werte;

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

        Graph1 = new Graph(werte); // der Graph wird compiled
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

        werte = p.loadTable("../assets/data/05_werte.csv", 'csv', "header");

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
          
            p.push(); // um nur den Graphen zu verschieben kommt das bewegte in ne push klammer
          
            position.y = -p.map(fortschritt, 0, 100, 0, maxHeight); //bei einer Scollbewegung wird die Y Koordinate nach unten verschoben abhängig vom Fortschritt und der MaxHeight
            //verschiebt das koordinatensytem nach PVector position
            p.translate (position.x, position.y + p.height/4.06);
          
          
          
          
            // Der Graph wird außerhalb des Bildes gerendert. Wenn der momentane Frotschritt + der Höhe größer als die Position der rechten Schranke der Tabelle -1 ist(es soll ja vor dem Bildschirm passieren)
            //vielleicht versteht mans mit SK02 besser
            //alles wird auf die 0 - 100 skala this.gemappt in der auch die fortschritt variable ist
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
        
          let r1 = p.int(p.random(0,this.worter1.getRowCount()-1));
          let r2 = p.int(p.random(0,this.worter2.getRowCount()-1));
          let r3 = p.int(p.random(0,this.worter3.getRowCount()-1));
          let r4 = p.int(p.random(0,10));
          
          let output = "";
          
          if (r4 > 6) {
            output = this.worter3.getString(r3,0) + this.worter1.getString(r1,0) +this.worter2.getString(r2,0);
          } else {
            output = this.worter1.getString(r1,0) +this.worter2.getString(r2,0);
          }
          return output;
        }
    }


    class Static {

        constructor() {
            this.horizont = p.height/8.12;
            this.bottomGrid = p.createVector(p.width, p.height/60); //Bottom Grid ist die höhe und breite der Spalten unten
            this.pp = false; //this.pp steht für Predictions, please ;) und toggelt das blinken vom Text
        }
      
        //Namen Zeichnen2 zeichnet eine LIste von Fachbereichen am unteren Bilschirmrand
        namenZeichnen2(pNamen, farben, pTabelle, pRechteSchranke) {
      
          //das Basis Recheck im Hintergrund
          p.fill(p.color(farben.getNum(0, "r"), farben.getNum(0, "g"), farben.getNum(0, "b")), 255);
          p.noStroke();
          p.rect(0, p.height - this.horizont, p.width, this.horizont);
      
          //Um die Fraben korrekt zu machen kopiere ich zuerst die farbtabelle
          let newFarben = new p5.Table();
      
          //indem ich mit i=2 starte lasse nehmen ich nur die Farben für die FBs
          for (let i = 2; i<=farben.getRowCount()-1; i++) {
            newFarben.addRow(farben.getRow(i));
            //println("newFrabenrow count" + newFarben.getRowCount());
          }
      
          //dann chekce ich ob die Namen der nicht 0  Fachbereche mit denen der Normalen Liste übereinstimmen
          //wenn dies nicht so ist wird die eintsprechende Zeile aus der Fabtabelle gelöscht
          let ii = 0;
          for (let i = 0; i< farben.getRowCount()-1; i++) {
            if (i <= pNamen.length-1 ) {
              if (pNamen[i]!= pTabelle.getColumnTitle(ii)) {
                if (i<newFarben.getRowCount()-1) {
                  //println("newFarben remove row an stelle"+i);
                  newFarben.removeRow(i);
                }
              } else {
                ii++;
              }
            }
          }
      
          //ein Rechteck wird hinter die namen gezeichnet mit der größe des Grids und wenn in der Zukunft größer um den Text mit einzuschließen
          if (fortschritt >= 50) {   
            p.rect(0, p.height - (pNamen.length -1)*this.bottomGrid.y - p.height/70 - p.height/12, p.width, (pNamen.length -1)*this.bottomGrid.y);
          } else {
            p.rect(0, p.height - (pNamen.length -1)*this.bottomGrid.y - p.height/70 - p.height/20, p.width, (pNamen.length -1)*this.bottomGrid.y);
          }
      
          //Der text wird gezeichet
          if (this.pp == true && fortschritt >= 50) {      
            p.textAlign(p.CENTER);
            p.fill(p.color(farben.getNum(1, "r"), farben.getNum(1, "g"), farben.getNum(1, "b")), 255);
            p.textSize(22);
            p.text("Predictions, please!", p.width/2, p.height - ((pNamen.length -1)*this.bottomGrid.y) - p.height/17);
            p.textAlign(p.LEFT);
            p.textSize(13);
          }
          //dann wird bei einem Modulo von 20 FRames this.pp geswitcht
          if ((p.frameCount % 22) == 0) {
            if (this.pp == true) {   
              this.pp = false;
            } else {
              this.pp = true;
            }
          }
      
          //Dann gehe ich alle Namen durch und zeichne namen, farbnindikator und zahl der STudierenden
          for (let i = 0; i< pNamen.length -1; i++) {
            let wert = pTabelle.getNum(pTabelle.getRowCount()-1 - (pTabelle.getRowCount()-pRechteSchranke) -5, pNamen[i]);
            //println(newFarben.getRowCount());
      
            // zuerst male ich ein Rechteck unter den Text damit wenn es der Text den unteren Kansten sprengen würde wird der kasten "erweitert"
            p.fill(p.color(farben.getNum(0, "r"), farben.getNum(0, "g"), farben.getNum(0, "b")), 255);    
            //rect(0, height - i*this.bottomGrid.y - height/70 - height/20, width, this.bottomGrid.y);
      
            //Die farbe korrekt zu bestimmen ist sehr fehleranfällig weswegen ich failsaves eingeführt habe.....
            if (i<=newFarben.getRowCount()-1) {
              //println("ok");
              p.fill(p.color(newFarben.getNum(i, 0), newFarben.getNum(i, 1), newFarben.getNum(i, 2)), 255);
            } else if (i<farben.getRowCount() -2) {
              //println("farbenreinschiss");
              p.fill(p.color(farben.getNum(i+2, 0), farben.getNum(i+2, 1), farben.getNum(i+2, 2)), 255);
            } else {
              //println("farben ultra Reinschiss");
              p.fill(p.color(farben.getNum(farben.getRowCount()-1, "r"), farben.getNum(farben.getRowCount()-1, "g"), farben.getNum(farben.getRowCount()-1, "b")));
              //fill(color(farben.getNum(1, 0), farben.getNum(1, 1), farben.getNum(1, 2)), 255);
            }
            //Der Kreis wird mit der entsprechenden Fraben gezeichnen
            p.ellipse(0 + p.width/ 13, p.height - i*this.bottomGrid.y - p.height / 200 - p.height/20, 5, 5);
      
      
            p.fill(p.color(farben.getNum(1, "r"), farben.getNum(1, "g"), farben.getNum(1, "b")), 255);
      
            p.text(pNamen[i], 0 + p.width/ 10, p.height - i*this.bottomGrid.y - p.height/20);
            p.text((p.int(wert), p.width-p.width/7.3, p.height - i*this.bottomGrid.y - p.height/20));
          }
        }
    }
    


    class Graph {

        constructor(tabelle) {
            this.RWC1 = new RandomWordCombiner();
      
            this.tabelle = tabelle; 
            this.supplements; // Supplements ist eine Tabelle mit Zusaätzlichen Infos
          
            this.zeitlange = 16; //definiert die rechte Schranke in Abhängigkeit der linken
            this.linkeSchranke = 0; //l und r Schranke definieren den anzuzeigenden Bereich
            this.rechteSchranke = linkeSchranke + zeitlange;;
          
            this.originalLange = this.tabelle.getRowCount();; //ist die länge der Tabelle bevor so modifiziert wird
            this.maximaleLange = this.originalLange * 2 +2; //ist die Maximale RowCount die die Tabelle haben darf
          
            this.supplements = new p5.Table(); //Supplements ist eine Tabelle mit einigen Werten die in gleichschaltung mir den daten geslöscht und erstellt werden müssen
            this.supplements.addColumn("maxWerte"); //Spalte1: maxWerte sindimmer die Werte die bisher maximale gefunden wurden. Wenn eine Zeile gelöscht wird kann so auf den Vorherigen Höchsttand zurück gegriffen werden
            this.supplements.addColumn("strokeWeight");
            this.supplements.addColumn("opacity");
        
            this.fillSupplements(); // Füllt die Supplements Tabelle

            this.noiseSeedBase = new Array((this.tabelle.getColumnCount()-1) * 100); //noiseSeedBase ist nen Array mit verschieden Werten von -100 bis 100 um immer neue Noise werte zu generieren aber diese nihct zu verlieren
            
            for (let i = 0; i<this.noiseSeedBase.length-1; i++) {
                this.noiseSeedBase[i] = p.random(-100, 100);
              }

            this.mdcb = 0;
        }

      
        anzeigen = (farben) => {
          // Redndert alle Spalten der Tabelle
          // bracht nur die obergeordneten Farben
      
          p.strokeWeight(4);
          // die Graph Labels werden gezeichnet
          this.graphLabelsZeichnen(p.color(farben.getNum(1, "r"), farben.getNum(1, "g"), farben.getNum(1, "b")), farben);
      
          //das StrokeWeight wrird aus der supplements Tabelle geladen. und zwar immer das letzte
          p.strokeWeight(this.supplements.getNum(this.supplements.getRowCount()-1, "strokeWeight"));
      
          // ich gehe jede SPalte durch und zeichne den Ausshnitt mit der passenden Farbe. Wenn die Farbtabelle zuende ist wird nurnoch die letzte angezeigt 
          for (let i = 0; i<tabelle.getColumnCount()-1 - 2; i++) {
            if (i<farben.getRowCount()-1 -2) {
              this.ausschnittZeichnen (linkeSchranke, rechteSchranke, i, p.color(farben.getNum(i +2, "r"), farben.getNum(i +2, "g"), farben.getNum(i +2, "b")));
            } else if (i>farben.getRowCount()-1 -2 && i<(farben.getRowCount()-1 -2)*2) {
              let p = i - (farben.getRowCount()-1);
              this.ausschnittZeichnen (linkeSchranke, rechteSchranke, i, p.color(farben.getNum(p +2, "r"), farben.getNum(p +2, "g"), farben.getNum(p +2, "b")));
            } else {
              this.ausschnittZeichnen (linkeSchranke, rechteSchranke, i, p.color(farben.getNum(farben.getRowCount()-1, "r"), farben.getNum(farben.getRowCount()-1, "g"), farben.getNum(farben.getRowCount()-1, "b")));
            }
          }
        }
      

        ausschnittZeichnen (pos1, pos2, spalte, c) {
      
          //ausschnittzeichnen ist eine Funkton, die einen Ausschnitt der Tabelle zwischen 2 Punkten zeichnet
          //Name definiert die Spalte und c die Farbe der Linie
      
      
          //die dabele wird zwischen pos1 und pos2 durchgegangen
          for (let i = pos1; i < pos2; i++) {
      
      
            //zeichnet eine Linie in regelmäßigen Abständen zwischen Tabellen einträgen 
            //x1:  nimmt die Tabelle an stelle i und der passenden Spalte und map es von maxWerte bis 0 nach 0 bis die Breite es Graphen
            //y1: i  wird von der Gesammtmöglichen Tabelle auf die passende Pixelzahl gebracht
            //x,y2: wie x1 und y1 nur mit i-1 damit eine Linie zum letzten EIntrag gezeichnet wird
            //da nach "oben" gezeichnet wird ist i=pos1 egal dieser wird nachgezeichnet
      
            if (i != pos1) {
              if (this.tabelle.getNum(i, spalte)>0 || this.tabelle.getNum(i-1, spalte)>0) {
                p.stroke(
                  c, 
                  this.supplements.getNum(this.supplements.getRowCount()-1, "opacity"));
                /*eiegndlich ist nur das else: wichtig. der Rest sind Randfälle an denen werte random unter 0 gehen*/
                if (tabelle.getNum(i, spalte)<0 ) {
                  p.line(
                    p.map(0, -this.supplements.getNum(this.supplements.getRowCount()-1, "maxWerte"), 0, 0, ausmasse.x), 
                    p.map((i), 0, this.maximaleLange, 0, maxHeight), 
                    p.map(-this.tabelle.getNum(i-1, spalte), -this.supplements.getNum(this.supplements.getRowCount()-1, "maxWerte"), 0, 0, ausmasse.x), 
                    p.map((i -1), 0, this.maximaleLange, 0, maxHeight)
                    );
                } else if (this.tabelle.getNum(i-1, spalte)<0) {
                  p.line(
                    p.map(-this.tabelle.getNum(i, spalte), -this.supplements.getNum(this.supplements.getRowCount()-1, "maxWerte"), 0, 0, ausmasse.x), 
                    p.map((i), 0, this.maximaleLange, 0, maxHeight), 
                    p.map(0, -this.supplements.getNum(this.supplements.getRowCount()-1, "maxWerte"), 0, 0, ausmasse.x), 
                    p.map((i -1), 0, this.maximaleLange, 0, maxHeight)
                    );
                } else {
                  line(
                    p.map(-this.tabelle.getNum(i, spalte), -this.supplements.getNum(this.supplements.getRowCount()-1, "maxWerte"), 0, 0, ausmasse.x), 
                    p.map((i), 0, this.maximaleLange, 0, maxHeight), 
                    p.map(-this.tabelle.getNum(i-1, spalte), -this.supplements.getNum(this.supplements.getRowCount()-1, "maxWerte"), 0, 0, ausmasse.x), 
                    p.map((i -1), 0, this.maximaleLange, 0, maxHeight)
                    );
                }
              }
            }
            for (let ii = 0; ii<this.noiseSeedBase.length-1; ii++) {
              this.noiseSeedBase[ii] = this.noiseSeedBase[ii] + ii;
            }
          }
        }
      
        // Graphlabels zeichnen zwichnet die Jahrenzahlen am Rand der Tabelle und die Striche
        graphLabelsZeichnen (c, farben) {
          for (let i = 0; i < this.tabelle.getRowCount(); i++) {
            p.push();
            p.noStroke();
            p.fill(c, 80);
            p.rect(-p.width, p.map((i), 0, this.maximaleLange, 0, maxHeight), p.width*2, 1);
            p.fill(c, 255);
      
            p.text(1971 + (i)/2, -width+3.4*width/40, p.map((i), 0, this.maximaleLange, 0, maxHeight)-p.height/53,57);
      
            let mdc = c;
      
            if ((p.frameCount % 40) == 0) {
              if(mdcb < 6){
                this.mdcb++;
              }else {
                this.mdcb = 0;
              }
            }
            
            mdc = p.color (
            farben.getNum(this.mdcb+2,"r"),
            farben.getNum(this.mdcb+2,"g"),
            farben.getNum(this.mdcb+2,"b")
            );
      
      
            p.fill(mdc, 255);
            p.textAlign(p.CENTER);
            p.textSize(18);
            if (i>=2-1 && i<=6-1) {
              p.text("missing Data", -p.width/2, p.map((i), 0, this.maximaleLange, 0, maxHeight)-p.height/53,57);
            }
            if (i>=42-1 && i<=65-1) {
              text("missing Data", -p.width/2, p.map((i), 0, this.maximaleLange, 0, maxHeight)-p.height/53,57);
            }
            p.fill(c, 255);
            p.textAlign(p.LEFT);
            p.textSize(13);
      
            p.pop();
          }
        }


        loadFuture = () => {
          // es wird eine weitere zeile der Tabelle geladen
          //Wenn noch keine existiert wird eine erstellt
      
          //um kein OutofBoundsError zu kriegen wird erst geprüft
          if (this.rechteSchranke +1 < this.originalLange) {
            //NICHT ZUKUNFT
            this.linkeSchranke = this.linkeSchranke +1;
            this.rechteSchranke = this.rechteSchranke +1;
            //println("load l"+this.linkeSchranke);
            //println("load r"+this.rechteSchranke);
          } else if (this.rechteSchranke +1 < this.maximaleLange) {
            //ZUKUNFT
      
            // Am Anfanag wird randomize ausgeführt alle Werte berechnen sich dann danach
            this.randomize();
            //Da in der Zukunft die nächten Zeilen noch nicht existieren wird eine zufällig generiert
            this.tabelle.addRow();
            this.supplements.addRow();
      
    
            let random = new Array(this.tabelle.getColumnCount()); //Neues Array mit random Werten für jede Zeile
            for (let i = 0; i < this.tabelle.getColumnCount(); i++) {
              random[i] = p.noise(this.noiseSeedBase[i]) * 1000 - p.noise(this. noiseSeedBase[i * 2])*1000 + p.noise(this.noiseSeedBase[i *3])*200 - p.noise(this.noiseSeedBase[i * 3])*200 + p.random(-200, 200);
            }
      
            for (let i = 0; i<this.tabelle.getColumnCount()-1; i++) {
              if (this.tabelle.getNum(this.rechteSchranke, i)>0) {
                this.tabelle.setNum(this.rechteSchranke +1, i, this.tabelle.getNum(this.rechteSchranke, i)+ random[i]);
              } else {
                this.tabelle.setNum(this.rechteSchranke +1, i, 0 );
              }
            }
      
      
            // das ist der Teil um die Supplements Tablle weiter zu füllen
            //Wir gehen die Spalten der Tabelle durch und gucken bei jedem ob er größer als der momentane Höchstwert ist ggf wird dann ersetzt
            //Wenn das nicht gegeben ist wird einfach der Wert aus der letzten Tabellenzeilen genommen
      
            let maxColWert = 0;
            for (let i = 0; i < this.tabelle.getColumnCount(); i++) {
              if (this.supplements.getNum(this.supplements.getRowCount()-2, "maxWerte")<this.tabelle.getNum(this.tabelle.getRowCount()-1, i)  && maxColWert < this.tabelle.getNum(this.tabelle.getRowCount()-1, i)) {
                maxColWert = this.tabelle.getNum(this.tabelle.getRowCount()-1, i);
              }
            }
            if (this.supplements.getNum(this.supplements.getRowCount()-2, "maxWerte")<maxColWert) {
              this.supplements.setNum(this.supplements.getRowCount()-1, "maxWerte", maxColWert);
            } else {
              this.supplements.setNum(this.supplements.getRowCount()-1, "maxWerte", this.supplements.getNum(this.supplements.getRowCount()-2, "maxWerte"));
            }
      
            // der Wert für opacity und StrokeWeight muss auch übernommen werden
            this.supplements.setNum(this.supplements.getRowCount()-1, "strokeWeight", (this.supplements.getNum(this.supplements.getRowCount()-2, "strokeWeight")));
            this.supplements.setNum(this.supplements.getRowCount()-1, "opacity", (this.supplements.getNum(this.supplements.getRowCount()-2, "opacity")));
      
            this.linkeSchranke = this.linkeSchranke +1;
            this.rechteSchranke = this.rechteSchranke +1;
          }
        }
      


        
        /* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ HIER GEHTS WEITER ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */
      
        void unLoadFuture () {
          //die letzte Zeile wird entladen
          //Wenn diese Zeile in der Zukunft leigt wird diese gelöscht
      
          //um kein OutofBoundsError zu kriegen wird erst geprüft
          if (linkeSchranke -1 > 1) {
      
      
            //wenn man in der Zukunft ist werden Zeilen gelöscht nachdem man sie rückgängig gemacht hat
            if (rechteSchranke >= originalLange -1) {
              tabelle.removeRow(tabelle.getRowCount()-1);
              supplements.removeRow(supplements.getRowCount()-1);
            }
      
            linkeSchranke = linkeSchranke -1;
            rechteSchranke = rechteSchranke -1;
          }
        }
      
      
        //nen Haufen Returns für die higherUps
      
        int getRechteSchranke () {
          return rechteSchranke;
        }
      
        int getZeitlange () {
          return zeitlange;
        }
      
        int getMaximaleLange () {
          return this.maximaleLange;
        }
      
        Table getTabelle () {
          return this.tabelle;
        }
      
        // gibt die Y position an einer bestimmten Stelle des Graphen in realtion zu rechteSchranke zurück, da alle Punkte an der Selben Y Koordinate sind
        float getPositionYVonNichtNull (int minus) {
      
          float positionYVonNichtNull = map((rechteSchranke -minus), 0, this.maximaleLange, 0, maxHeight);
      
          return positionYVonNichtNull;
        }
      
        //gibt die X werte (wo der TabellenWert nicht 0 ist) zurück
        float[] getPositionXVonNichtNull (int minus) {
      
          //zuerst wird die ziellänge bestimmt
          int lange=0;
          for (int i = 0; i < tabelle.getColumnCount()-1; i++) {
            if (tabelle.getNum(rechteSchranke -minus, i) != 0) {
              lange ++;
            }
          }
      
          // dann werden 2 temp Arrays gemacht eins ist das Original das zweite das Ziel
          float[] temp = new float [tabelle.getColumnCount()-1];
          float[] temp2 = new float [lange+1];
      
          // i und ii ticken mit jeder Runde hoch aber ii nur wenn der Tabellenwert nicht 0 ist
          // Also werden 0 Stellen ausgelassen und der Rest Rorrekte eingefügt
          int ii=0;
          for (int i = 0; i < tabelle.getColumnCount()-1; i++) {
            temp[i] =  map(-tabelle.getNum(rechteSchranke -minus, i), -supplements.getNum(supplements.getRowCount()-1, "maxWerte"), 0, 0, ausmasse.x);
            if (ii<=lange) {
              if (tabelle.getNum(rechteSchranke -minus, i) != 0) {
                temp2 [ii] = temp [i];
                ii ++;
              }
            }
          }
          return temp2;
        }
      
      
        // das Gleichte wie getPositionXVonNichtNull nur dass das Array nicht die X Koordinate sondern die Werte enthält
        float[] getWerteVonNichtNull (int minus) {
          int lange=0;
          for (int i = 0; i < tabelle.getColumnCount()-1; i++) {
            if (tabelle.getNum(rechteSchranke -minus, i) != 0) {
              lange ++;
            }
          }
      
          float[] temp = new float [tabelle.getColumnCount()-1];
          float[] temp2 = new float [lange+1];
      
          int ii=0;
          for (int i = 0; i < tabelle.getColumnCount()-1; i++) {
            temp[i] =  tabelle.getNum(rechteSchranke -minus, i);
            if (ii<=lange) {
              if (temp[i] != 0) {
                temp2 [ii] = temp [i];
                ii ++;
              }
            }
          }
          return temp2;
        } 
      
      
      
        // das Gleichte wie getPositionXVonNichtNull nur dass das Array nicht die X Koordinate sondern die Namen der Header enthält
        String[] getNamenVonNichtNull (int minus) {
          int lange=0;
          for (int i = 0; i < tabelle.getColumnCount()-1; i++) {
            if (tabelle.getNum(rechteSchranke -minus, i) != 0) {
              lange ++;
            }
          }
      
          String[] temp = new String [tabelle.getColumnCount()-1];
          String[] temp2 = new String [lange+1];
      
          int ii=0;
          for (int i = 0; i < tabelle.getColumnCount()-1; i++) {
            temp[i] =  tabelle.getColumnTitle(i);
            if (ii<=lange) {
              if (tabelle.getNum(rechteSchranke - minus, i) != 0) {
                temp2 [ii] = temp [i];
                ii ++;
              }
            }
          }
          return temp2;
        } 
      
      
        // gibt nur die länge von oben aus
        int getLangeVonNichtNull (int minus) {
          int lange=0;
          for (int i = 0; i < tabelle.getColumnCount()-1; i++) {
            if (tabelle.getNum(rechteSchranke -minus, i) != 0) {
              lange ++;
            }
          }
          return lange;
        } 
      
        // Fill Supplements füllt die Supplements Tabelle
        void fillSupplements () {
      
          //maxWerte:
          // Zuerste wird der Maximale Wert jeder Zeile ermittelt
          for (int i = 0; i < tabelle.getRowCount(); i++) {
            float maxColWert = 0;
            for (int ii = 0; ii < tabelle.getColumnCount(); ii++) {
              if (maxColWert<tabelle.getNum(i, ii)) {
                maxColWert = tabelle.getNum(i, ii);
              }
            }
            //println(maxColWert);
      
            // dann wenn der Wert größer als der wert an der selben stelle -1 ist wird er neu aufgeschirben wenn nicht wird der alte "mitgezogen"
            // also nicht {12427814} sondern {12447888}
            if ((i == 0) || (maxColWert > supplements.getNum(i-1, "maxWerte")) ) {
              supplements.setNum(i, "maxWerte", maxColWert);
            } else {
              supplements.setNum(i, "maxWerte", supplements.getNum(i-1, "maxWerte"));
            }
          }
      
          //strokeWeight
          for (int i = 0; i < tabelle.getRowCount(); i++) {
            supplements.setNum(i, "strokeWeight", 4);
          }
      
          //opacity
          for (int i = 0; i < tabelle.getRowCount(); i++) {
            supplements.setNum(i, "opacity", 255);
          }
        }
      
        //randomize nimmt sich einen random Float von 0 bis 100 und generiert damit random events
        void randomize () {
          float r = random(0, 100);
      
          // neue Spalte 
          if (r>55 && r<100) {
            addNewCol();
          }
      
          //ein Wert wird gebosted
          if (r>80 && r<96) {
            tabelle.setNum(
              tabelle.getRowCount()-1, 
              (int)random(0, tabelle.getColumnCount()-1), 
              random(0, supplements.getNum(supplements.getRowCount()-1, "maxWerte")));
          } 
      
          //ein Wert wird auf 2 gesetzt
          if (r>70 && r<80) {
            tabelle.setNum(
              tabelle.getRowCount()-1, 
              (int)random(0, tabelle.getColumnCount()-1), 
              2);
          }
      
          //Die linien werden Fett und halb transparent
          if (r>54 && r<60) {
            if (supplements.getNum(supplements.getRowCount()-2, "strokeWeight")*12 < 120) {
              supplements.setNum(supplements.getRowCount()-1, "strokeWeight", (supplements.getNum(supplements.getRowCount()-2, "strokeWeight")*12));
              supplements.setNum(supplements.getRowCount()-1, "opacity", (supplements.getNum(supplements.getRowCount()-2, "opacity")/1.5));
            } else {
              supplements.setNum(supplements.getRowCount()-1, "strokeWeight", 100);
              supplements.setNum(supplements.getRowCount()-1, "opacity", (supplements.getNum(supplements.getRowCount()-2, "opacity")*random(0.1, 1.2)));
            }
          }
      
      
          //Alles wird 0 und ein einzelner Studiengang mit dem namen Studiengang wird erzeugt
          if (r>0 && r<0.5) {
            for (int i = 0; i< tabelle.getColumnCount()-1; i++) {
              tabelle.setNum(tabelle.getRowCount()-1, i, 0);
            }
      
            tabelle.addColumn("Studiengang");
            for (int i =0; i< tabelle.getRowCount()-1; i++) {
              tabelle.setNum(i, "Studiengang", 0);
            }
            tabelle.setNum(tabelle.getRowCount()-1, "Studiengang", random(0, 2000));
          }
      
          // viele neue Spalten 
          if (r>60 && r<63) {
            for (int i = 0; i < random(5, 10); i++) {
              addNewCol();
            }
          }
      
          // Scale wird komisch
          if (r>20 && r<25) {
            supplements.setNum(supplements.getRowCount()-1, "maxWerte", (supplements.getNum(supplements.getRowCount()-2, "maxWerte")*random(0.25, 2)));
          }
        }
      
        //AddNewCol erschafft eine neue Spalte mit einem random Titel und füllt diese mit nullen danach wird die letzte Spalte zufällig erhöht
        //aber nur wenn die anzahl der Spalten die nicht 0 sind kleiner als 22 ist
        void addNewCol() {
          if (getLangeVonNichtNull(5)<19) { 
            String r = RWC1.getRandomWord ();
            tabelle.addColumn(r);
            for (int i =0; i< tabelle.getRowCount()-1; i++) {
              tabelle.setNum(i, r, 0);
            }
            tabelle.setNum(tabelle.getRowCount()-1, r, random(0, 2000));
          }
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