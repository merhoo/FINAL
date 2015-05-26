var soundFile;
var amplitude;
var fft, spectrum, low, midLo, midHi, high;
var volume = 0;

var numpressed = 0;

function preload() {
  text('loading', width/2, height/2);
  soundFormats('ogg', 'mp3');
  soundFile = loadSound('niw.mp3');
}

function setup() {
  soundFile.play();
  soundFile.rate(1);

  amplitude = new p5.Amplitude();
  fft = new p5.FFT();

  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
}

function keyPressed() {
  if (keyCode >= 48 && keyCode <= 57){
    numpressed = keyCode - 48;
  }
}

function dofft(){
  if (soundFile.isPlaying()) {
    // get volume from the amplitude process
    volume = amplitude.getLevel();

    // get frequencies
    spectrum = fft.analyze();
    low = fft.getEnergy('bass');
    midLo = fft.getEnergy('lowMid');
    midHi = fft.getEnergy('mid');
    high = fft.getEnergy('highMid');

  }
}

var maxx = 0;

function draw() {
  this.dofft();
  maxx = map(10000*volume/1, 0, 10000, 0, 255);
  background(0, 0, maxx);

  if (numpressed == 0){
  translate(width/2, height/2)
  stroke(255);


  rotate(frameCount/midHi);
  /*fill(0, 0, high);
  strokeWeight(midHi/5);
  rect(0, 0, high, high);*/
  strokeWeight(midLo%60);
  noFill();
  for (var i = 1; i <= 10; i+=2){
    polygon(0, 0, (low/2)*i, map(high, 0, 255, 3, 9));
  }
  
  } else if (numpressed == 1) {
    stroke(0);
    strokeWeight(midLo/20);
    fill(0, 0, 255-maxx);
    ellipse(map(low, 0, 255, 0, width), 
      map(high, 0, 255, 0, height), midHi, midHi);
    ellipse(width-map(low, 0, 255, 0, width), 
      height-map(high, 0, 255, 0, height), midHi, midHi);
    ellipse(width-map(low, 0, 255, 0, width), 
      map(high, 0, 255, 0, height), midHi, midHi);
    ellipse(map(low, 0, 255, 0, width), 
      height-map(high, 0, 255, 0, height), midHi, midHi);



    ellipse(map(high, 0, 255, 0, width), 
      map(low, 0, 255, 0, height), height/4, height/4);

    ellipse(width-map(high, 0, 255, 0, width), 
      height-map(low, 0, 255, 0, height), height/4, height/4);

    ellipse(map(high, 0, 255, 0, width), 
      height-map(low, 0, 255, 0, height), height/4, height/4);

    ellipse(width-map(high, 0, 255, 0, width), 
      map(low, 0, 255, 0, height), height/4, height/4);


    stroke(255);


    
    strokeWeight(map(low, 0, 255, 1, 50));
    for (var i = 0; i <= width; i+= (width/map(midLo, 0, 255, 6, 16))){
      line(i, 0, i, height);
    }

    strokeWeight(map(high, 0, 255, 1, 50));
    for (var j = 0; j <= height; j+= (height/map(midHi, 0, 255, 6, 16))){
      line(0, j, width, j);
    }

    /*noFill();
    for (var i = 1; i <= 20; i+=4){
      rect(width/2 - ((low/4)*i)/2, 
        height/2 - ((high/4)*i) /2, (low/4)*i, (high/4)*i );
    }*/

  } else if (numpressed == 2) {
    var waveform = fft.waveform();
    noFill();
    beginShape();
    stroke(255,255,255); // waveform is red
    strokeWeight(low/4);
    for (var i = 0; i< waveform.length; i++){
      var x = map(i, 0, waveform.length, 0, width);
      var y = map( waveform[i], 0, 255, 0, height/4);
      vertex(x,y);
    }
    endShape();

    beginShape();
    strokeWeight(midLo/4);
    for (var i = 0; i< waveform.length; i++){
      var x = map(i, 0, waveform.length, 0, width);
      var y = map( waveform[i], 0, 255, height/4, 2*height/4);
      vertex(x,y);
    }
    endShape();

    beginShape();
    strokeWeight(midHi/4);
    for (var i = 0; i< waveform.length; i++){
      var x = map(i, 0, waveform.length, 0, width);
      var y = map( waveform[i], 0, 255, 2*height/4, 3*height/4);
      vertex(x,y);
    }
    endShape();

    beginShape();
    strokeWeight(high/4);
    for (var i = 0; i< waveform.length; i++){
      var x = map(i, 0, waveform.length, 0, width);
      var y = map( waveform[i], 0, 255, 3*height/4, height);
      vertex(x,y);
    }
    endShape();
    


  } else if (numpressed == 3) {
    num = 12;
    noStroke();
    fill(0,0,255-maxx);
    for (var i = 0; i <= width; i+= width/num){
      for (var j = 0; j <= height; j+= height/num){
        ellipse(i+random(10,20), j+random(10,20), high/1.5, high/1.5);
      }
    }

    stroke(255);
    strokeWeight(25+low/35);
    fill(255,255,255); // spectrum is green
    for (var i = 0; i < spectrum.length; i+=width/135){
      var x = map(i, 0, spectrum.length, 0, width);
      var h = 50+map(spectrum[i], 0, 255, 0, height/2);
      line(x, 0, x, h);
      line(width-x, height, width-x, height - h);
      line(x, height, x, height - h);
      line(width-x, 0, width-x, h);
    }

    stroke(0,0, maxx);
    strokeWeight(25);
    for (var i = 0; i < spectrum.length; i+=width/135){
      var x = map(i, 0, spectrum.length, 0, width);
      var h = 50+map(spectrum[i], 0, 255, 0, height/2);
      line(x, 0, x, h);
      line(width-x, height, width-x, height - h);
      line(x, height, x, height - h);
      line(width-x, 0, width-x, h);
    }
  } else if (numpressed == 4) {
    noStroke();
    angleMode(RADIANS);

    translate(width/2, height/2);

    for (var angleB = 0; angleB <= 2*PI; angleB += PI/3){
      polygon((high+(width/6))*cos(angleB), (high+(height/6))*sin(angleB), high/10, 4);
    }
    
    rotate(frameCount/midLo);
    for (var angle = 0; angle <= 2*PI; angle += PI/12){
      ellipse((low+(width/4))*cos(angle), (low+(height/4))*sin(angle), low/10, low/10);
    }

    //rotate(frameCount/midHi);
    
    
  } else if (numpressed == 5) {
    console.log('5');
  } else if (numpressed == 6) {
    console.log('6');
  } else if (numpressed == 7) {
    console.log('7');
  } else if (numpressed == 8) {
    console.log('8');
  } else if (numpressed == 9) {
    console.log('9');
  }
}



function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

