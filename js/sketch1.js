const sketch1 = (p) => {

  p.destroySketch = false;

  let progress = 0;

  let grid = p.createVector(2, 4); //PVector
  let gridDimensions;
  let colors = ['#ffe86e', '#ffa063', '#ff5cca', '#894ce6', '#6880e5', '#3caee5', '#2cbb60', '#50d846', '#141414']; // including black arrow to erase arrows
  let arrows = []; //PShape
  let sketchHeight;

  let boldFont; //font
  let italicFont; //font
  let regularFont; //font

  let shaderImages = [];

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
    p.resizeCanvas(setCanvas().x, setCanvas().y, p.WEBGL);
  };

  p.setup = function () {

    // Load the JSON file and store nested content in array
    
    p.createCanvas(setCanvas().x, setCanvas().y, p.WEBGL);

    // Set internal variables
    sketchHeight = p.height * 0.8;
    gridDimensions = p.createVector(p.width / grid.x, sketchHeight / grid.y); // set up the grid dimensions

    p.imageMode(p.CENTER);
    p.rectMode(p.CENTER);

    // Set a random noise seed so that every animation is truly unique
    p.noiseSeed((p.round(p.random(0, 10000))));

  };

  p.preload = function () {

    loadAndParseJSONData();

    // Load fonts
    boldFont = p.loadFont("../assets/fonts/MaximaNowTBProMedium.otf");
    italicFont = p.loadFont("../assets/fonts/MaximaNowTBProRegularItalic.otf");
    regularFont = p.loadFont("../assets/fonts/MaximaNowTBProRegular.otf");

    // Load the arrow vector file and set drawing styles
    for (let i = 0; i < colors.length; i++) {
      arrows[i] = p.loadImage(`../assets/images/arrow_${i}.png`);
    }

    for (let i = 0; i < 38; i++) {
      shaderImages[i] = p.loadImage(`../assets/images/animation/01/01_animation_${i}.jpg`);
    }

  }

  // Load and parse JSON file. Store the data into multiple arrays to be accessed later
  let changeData; // 2D-array containing individual change data for each topic at each year
  let prediction = []; // Accumulated prediction data for each topic 
  let predicitionRange = p.createVector(0, 0); // user to determine min. and maximum range of the prediction within map()
  let topics = []; // Strings containing all names of the topics

  function loadAndParseJSONData() {

    fetch('../assets/data/01_collectedData.json')
      .then(response => response.json())
      .then(data => {

        //console.log(data);

        let years = data.length;

        let dataPointsPerYear = data[0].content.length; //let dataPointsPerYear = data.getJSONObject(0).getJSONArray("content").size();

        //changeData = new Array(years).fill(new Array(dataPointsPerYear));
        changeData = new Array(years);
        prediction = new Array(dataPointsPerYear).fill(0);
        topics = new Array(dataPointsPerYear);

        for (let i = 0; i < years; i++) {
          let year = data[i];
          //console.log(year);
          let contentOfYear = year.content; //array
          //console.log(contentOfYear);

          changeData[i] = [];

          for (let j = 0; j < dataPointsPerYear; j++) {
            let element = contentOfYear[j];
            //console.log(element);
            let change = element.change;
            changeData[i][j] = change;
            prediction[j] += change;
            let topic = element.query;
            topics[j] = topic;
          }
        }

        //console.log(changeData);
        predicitionRange.x = p.min(prediction);
        predicitionRange.y = p.max(prediction);

      });
  }

  p.draw = function () {


    if (p.destroySketch == true) {
      p.canvas.width = 1;
      p.canvas.height = 1;
      p.resizeCanvas(1,1);
      p.remove();
      console.log('destroyed')
    }
    
    p.background('#141414');
    p.translate(-p.width / 2, -p.height / 2);
    drawGrid();
    
    // Apply the filter pass at/after 60% progress
    if (progress >= 60) {
      let shaderImageIndex = p.int(p.map(progress,60,100,0,shaderImages.length - 1));
      p.image(shaderImages[shaderImageIndex], p.width/2, p.height/2, p.width, p.height);
    } 
  
    drawText();
    drawProgress();
    drawBottomTimeline();
  };




  // Draw the actual grid
  function drawGrid() {
    let index = 0;
    for (let y = 0; y < grid.y; y++) {
      for (let x = 0; x < grid.x; x++) {
        drawTopic(x, y, index);
        index++;
      }
    }
  }


  // Draw one of the eight topics
  let gridSize = 0;
  function drawTopic(x, y, index) {

    // Determine the amount of years that we want to draw
    let years = p.round(p.map(progress, 0, 50, 50, 2));
    // Set a hard limit at 50% progress so that only one data-set is displayed at this point
    if (progress >= 50) {
      years = 2;
    }
    // Determine how many elements we actually want to draw (this is used to hide elements from the grid as we scroll)
    let elementsToDraw = p.round(years - p.pow(1, gridSize) - 1);


    // Determine the grid size by calculating the square root of the desired amount of years (so as to get a number we can draw as a grid)
    gridSize = p.round(p.sqrt(years));
    // Determine the pixel dimensions of the grid
    let gSize = p.createVector(gridDimensions.x / gridSize, gridDimensions.y / gridSize);

    // If we are above 60% progress, we want elements to increase in size as we scroll.
    let addToSize = 0;
    if (progress >= 60) {
      addToSize = p.map(progress, 60, 100, 1, 400);
    }

    // Let's draw the grid
    let indexOfCurrentYear = 0;
    for (let gY = gridSize; gY > 0; gY--) {
      for (let gX = gridSize; gX > 0; gX--) {

        //console.log(gY,gX);

        // Determine position in grid
        let positionInGrid = p.createVector(x * gridDimensions.x, y * gridDimensions.y);
        let positionOfElement = p.createVector(gX * gSize.x, gY * gSize.y);
        let position = p.createVector(positionInGrid.x + positionOfElement.x, positionInGrid.y + positionOfElement.y);

        // Determine ratio of change and set rotation based on this
        let rotation = 0;
        if (years > 2) {
          // Rotation variations for the past
          let changeOfThisYear = changeData[indexOfCurrentYear][index];
          rotation = p.map(changeOfThisYear, -100, 100, -45, 45);
        } else {
          // Rotation variations for the future
          let changeOfThisYear = prediction[index];
          rotation = p.map(changeOfThisYear, predicitionRange.x, predicitionRange.y, -45, 45);

          // For the progress section between 60% and 100%, move the rotation forward in the direction of the predicition
          if (progress >= 60) {
            if (rotation > 0) {
              rotation = p.map(changeOfThisYear, predicitionRange.x, predicitionRange.y, -45, 45) + p.map(progress, 60, 100, 0, 40);
            } else {
              rotation = p.map(changeOfThisYear, predicitionRange.x, predicitionRange.y, -45, 45) + p.map(progress, 60, 100, 0, -40);
            }
          }
          // For any progress beyond 90%, make it a random (noise-based) rotation/animation
          if (progress > 90) {
            rotation += p.noise(p.frameCount * 0.002) * p.map(progress, 90, 100, 1, 200);
          }
        }

        // Set position at center of grid-block
        position.x -= gSize.x / 2;
        position.y -= gSize.y / 2;


        // Set colors
        p.noStroke();
        //p.tint(colors[index]);
        p.fill(colors[index]);
        
        // Set rotation
        p.push();
        p.translate(position.x, position.y);
        p.rotate(p.radians(rotation));
        p.translate(-position.x, -position.y);

        // Draw arrow
        let arrowSize = p.createVector(gSize.x + addToSize, gSize.y + addToSize);
        p.image(arrows[index], position.x, position.y, arrowSize.x, arrowSize.y);

        // As we scroll, we want to hide certain elements to show the progress
        if (indexOfCurrentYear > elementsToDraw) {
          p.image(arrows[8], position.x, position.y, arrowSize.x, arrowSize.y);
        }

        // Draw text labels in case of the time-state being between 2021-2031
        if (years == 2) {
          let thisText = topics[index];
          p.push();
          p.fill(colors[index]);
          p.textFont(boldFont);
          p.textSize(p.width * 0.02);
          if (progress <= 60) {
            p.text(thisText, position.x - gSize.x * 0.2, position.y - gSize.y * 0.16);
          }
          p.pop();
        }

        p.pop();

        indexOfCurrentYear++;
      }
    }


    // Draw individual text character (only applies to visualization of the past)
    indexOfCurrentYear = 0;
    if (years > 2) {
      for (let gY = 0; gY < gridSize; gY++) {
        for (let gX = 0; gX < gridSize; gX++) {
          // Determine position in grid
          let positionInGrid = p.createVector(x * gridDimensions.x, y * gridDimensions.y);
          let positionOfElement = p.createVector(gX * gSize.x, gY * gSize.y);
          let position = p.createVector(positionInGrid.x + positionOfElement.x, positionInGrid.y + positionOfElement.y);

          // Set position at center of grid-block
          position.x += gSize.x / 6;

          // Set colors
          p.noStroke();
          p.fill(colors[index]);

          // Draw text
          let character = topics[index].charAt(indexOfCurrentYear % topics[index].length);
          p.textAlign(p.CENTER, p.CENTER);
          p.textFont(boldFont);
          p.textSize((gSize.y + addToSize) * 0.5);
          p.text(character, position.x, position.y);

          indexOfCurrentYear++;
        }
      }
    }
  }

  // Draw the ticks at the bottom of the visualization
  function drawBottomTimeline() {
    let ticks = 101;
    let tickSeparation = (p.width - p.width * 0.14) / ticks;
    p.strokeWeight(1);
    //p.noFill();
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
    //p.noFill();
    p.stroke(255);
    p.strokeWeight(6);
    let lineWidth;

    if (progress <= 50) {
      lineWidth = p.map(progress, 0, 50, p.width / 2, p.width * 0.07);
      let positionLeft = p.map(progress, 0, 50, p.width * 0.07, p.width / 2);
      p.line(positionLeft, p.height * 0.98, positionLeft + lineWidth - p.width * 0.07, p.height * 0.98);
    } else {
      lineWidth = p.map(progress, 50, 100, p.width / 2, p.width - p.width * 0.07);
      p.line(p.width / 2, p.height * 0.98, lineWidth, p.height * 0.98);
    }
  }



  // Draw the text at the bottom of the screen
  let yearText;
  function drawText() {
    p.textAlign(p.LEFT, p.BASELINE);

    p.fill(255);
    p.textFont(boldFont);
    p.textSize(p.width * 0.065);
    p.text("PROLOG DES MÖGLICHEN", p.width * 0.07, p.height * 0.86);

    p.textFont(italicFont);
    p.textSize(p.width * 0.025);
    p.text("Eine Auseinandersetzung mit der Zukunft, basierend auf 403.891 Artikeln\nder vergangenen 50 Jahre - extrahiert aus dem Archiv der New York Times.", p.width * 0.07, p.height * 0.885);

    p.textFont(regularFont);
    p.textSize(p.width * 0.066);

    let yearFrom = 1971;
    if (gridSize < 7) {
      yearFrom = 2020 - gridSize * gridSize;
    }
    yearText = yearFrom + "-2020";

    if (gridSize == 1) {
      if (progress >= 49 && progress <= 60) {
        yearText = "2021-2031";
      } else {
        yearText = "2031-2071";
      }
    }

    p.text(yearText, p.width * 0.07 + p.map(progress, 0, 100, 0, p.width * 0.57), p.height * 0.96);
  }

  // Map mouse wheel event to <progress> variable
  let mouseSensitivity = 0.05;
  p.mouseWheel = function (event) {
    let change = event.delta * mouseSensitivity;
    if (progress + change >= 0 && progress + change <= 100) {
      progress += change;
    }
    return false;
  }


  let touchSensitivty = 1.5;
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
 
}

export default sketch1;