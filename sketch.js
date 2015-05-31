var amplitude;
var fft, spectrum, low, midLo, midHi, high;
var volume = 0;
var maxx = 0;

var client_id = '3018af38063abcf6a38748e9ad55b455';
var url = 'https://soundcloud.com/dirgethexvii/eden';
var sound, soundFile;

var numpressed = 0;
var myp5;

var sketch = function(p) {
    p.preload = function() {
        soundFile = p.loadSound(sound.stream_url + '?client_id=' + client_id);
        //soundFormats('ogg', 'mp3');
    };

    p.setup = function() {
        soundFile.play();
        soundFile.rate(1);

        amplitude = new p5.Amplitude();
        fft = new p5.FFT();

        p.createCanvas(window.innerWidth, window.innerHeight);
        p.background(0);
    };

    p.keyPressed = function() {
        if (p.keyCode >= 48 && p.keyCode <= 57) {
            numpressed = p.keyCode - 48;
        }
    };

    var dofft = function() {
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
    };

    p.draw = function() {
        dofft();
        maxx = p.map(10000 * volume / 1, 0, 10000, 0, 255);
        p.background(0, 0, maxx);

        if (numpressed == 0) {
            p.translate(p.width / 2, p.height / 2)
            p.stroke(255);

            p.rotate(p.frameCount / midHi);
            /* p.fill(0, 0, high);
            p.strokeWeight(midHi/5);
            rect(0, 0, high, high);*/
            p.strokeWeight(midLo % 60);
            p.noFill();
            for (var i = 1; i <= 10; i += 2) {
                polygon(0, 0, (low / 2) * i, p.map(high, 0, 255, 3, 9));
            }
        } else if (numpressed == 1) {
            p.stroke(0);
            p.strokeWeight(midLo / 20);
            p.fill(0, 0, 255 - maxx);

            var cirB = p.height / 2;
            p.ellipse(p.map(high, 0, 255, 0, p.width),
                p.map(low, 0, 255, 0, p.height), cirB, cirB);

            p.ellipse(p.width - p.map(high, 0, 255, 0, p.width),
                p.height - p.map(low, 0, 255, 0, p.height), cirB, cirB);

            p.ellipse(p.map(high, 0, 255, 0, p.width),
                p.height - p.map(low, 0, 255, 0, p.height), cirB, cirB);

            p.ellipse(p.width - p.map(high, 0, 255, 0, p.width),
                p.map(low, 0, 255, 0, p.height), cirB, cirB);

            var cirA = 2 * midHi;
            p.ellipse(p.map(low, 0, 255, 0, p.width),
                p.map(high, 0, 255, 0, p.height), cirA, cirA);
            p.ellipse(p.width - p.map(low, 0, 255, 0, p.width),
                p.height - p.map(high, 0, 255, 0, p.height), cirA, cirA);
            p.ellipse(p.width - p.map(low, 0, 255, 0, p.width),
                p.map(high, 0, 255, 0, p.height), cirA, cirA);
            p.ellipse(p.map(low, 0, 255, 0, p.width),
                p.height - p.map(high, 0, 255, 0, p.height), cirA, cirA);

            p.stroke(255);

            p.strokeWeight(p.map(low, 0, 255, 1, 30));
            for (var i = 0; i <= p.width; i += (p.width / p.map(midLo, 0, 255, 6, 16))) {
                p.line(i, 0, i, p.height);
            }

            p.strokeWeight(p.map(high, 0, 255, 1, 30));
            for (var j = 0; j <= p.height; j += (p.height / p.map(midHi, 0, 255, 6, 16))) {
                p.line(0, j, p.width, j);
            }

            /*noFill();
      for (var i = 1; i <= 20; i+=4){
        rect(p.width/2 - ((low/4)*i)/2, 
          p.height/2 - ((high/4)*i) /2, (low/4)*i, (high/4)*i );
  }*/
        } else if (numpressed == 2) {
            var waveform = fft.waveform();
            p.noFill();

            p.stroke(255);
            p.strokeWeight(20);
            for (var i = 0; i <= p.width; i += p.width / 12) {
                p.line(p.random(10, 100) + i, 0, p.random(10, 100) + i, p.height);
            }

            p.beginShape();
            p.stroke(255, 255, 255); // waveform is red
            p.strokeWeight(p.map(low, 0, 255, 1, 30));
            for (var i = 0; i < waveform.length; i++) {
                var x = p.map(i, 0, waveform.length, 0, p.width);
                var y = p.map(waveform[i], 0, 255, 0, p.height / 4);
                p.vertex(x, y);
            }
            p.endShape();

            p.beginShape();
            p.strokeWeight(p.map(midLo, 0, 255, 1, 30));
            for (var i = 0; i < waveform.length; i++) {
                var x = p.map(i, 0, waveform.length, 0, p.width);
                var y = p.map(waveform[i], 0, 255, p.height / 4, 2 * p.height / 4);
                p.vertex(x, y);
            }
            p.endShape();

            p.beginShape();
            p.strokeWeight(p.map(midHi, 0, 255, 1, 30));
            for (var i = 0; i < waveform.length; i++) {
                var x = p.map(i, 0, waveform.length, 0, p.width);
                var y = p.map(waveform[i], 0, 255, 2 * p.height / 4, 3 * p.height / 4);
                p.vertex(x, y);
            }
            p.endShape();

            p.beginShape();
            p.strokeWeight(p.map(high, 0, 255, 1, 30));
            for (var i = 0; i < waveform.length; i++) {
                var x = p.map(i, 0, waveform.length, 0, p.width);
                var y = p.map(waveform[i], 0, 255, 3 * p.height / 4, p.height);
                p.vertex(x, y);
            }
            p.endShape();
        } else if (numpressed == 3) {
            num = 12;
            p.noStroke();

            p.fill(0, 0, 0);
            p.ellipse(p.width / 2, p.height / 2, midLo * 4, midLo * 4);

            p.push();
            p.translate(p.width / 2, p.height / 2);
            p.rotate(p.frameCount / low / 2);
            p.fill(0, 0, 255 - maxx);
            for (var i = 0; i <= p.width; i += p.width / num) {
                for (var j = 0; j <= p.height; j += p.height / num) {
                    p.rotate(p.frameCount / low / 2);
                    p.ellipse(i + p.random(5, 15), j + p.random(5, 15), high / 2, high / 2);
                }
            }
            p.pop();

            p.stroke(255);
            p.strokeWeight(25 + low / 15);
            p.fill(255, 255, 255); // spectrum is green
            for (var i = 0; i < spectrum.length; i += 8) {
                var x = p.map(i, 0, spectrum.length, 0, p.width);
                var h = p.map(spectrum[i], 0, 255, 0, p.height / 8) * 4;
                p.line(x, 0, x, h);
                p.line(p.width - x, p.height, p.width - x, p.height - h);
                p.line(x, p.height, x, p.height - h);
                p.line(p.width - x, 0, p.width - x, h);
            }
            
            p.stroke(0, 0, maxx);
            p.strokeWeight(25);
            for (var i = 0; i < spectrum.length; i += 8) {
                var x = p.map(i, 0, spectrum.length, 0, p.width);
                var h = p.map(spectrum[i], 0, 255, 0, p.height / 8) * 4;
                p.line(x, 0, x, h);
                p.line(p.width - x, p.height, p.width - x, p.height - h);
                p.line(x, p.height, x, p.height - h);
                p.line(p.width - x, 0, p.width - x, h);
            }
        } else if (numpressed == 4) {
            p.noStroke();
            p.angleMode(p.RADIANS);

            p.translate(p.width / 2, p.height / 2);

            p.push();
            p.rotate(p.frameCount / 1 / midHi);
            for (var angleB = 0; angleB <= 2 * p.PI; angleB += p.PI / round(high / 5)) {
                polygon((high + (p.width / 28)) * p.cos(angleB), (high + (p.height / 24)) * p.sin(angleB), high / 16, 3);
            }
            p.pop();

            p.push();
            p.rotate(p.frameCount / 1 / high);
            for (var angleB = 0; angleB <= 2 * p.PI; angleB += p.PI / round(midHi / 10)) {
                polygon((midHi + (p.width / 16)) * p.cos(angleB), (midHi + (p.height / 12)) * p.sin(angleB), midHi / 8, 5);
            }
            p.pop();

            p.push();
            p.rotate(p.frameCount / 1 / low);
            for (var angle = 0; angle <= 2 * p.PI; angle += p.PI / round(midLo / 15)) {
                polygon((midLo + (p.width / 8)) * p.cos(angle), (midLo + (p.height / 6)) * p.sin(angle), midLo / 4, 8);
            }
            p.pop();

            p.push();
            p.rotate(p.frameCount / 1 / midLo);
            for (var angle = 0; angle <= 2 * p.PI; angle += p.PI / round(low / 20)) {
                polygon((low + (p.width / 4)) * p.cos(angle), (low + (p.height / 3)) * p.sin(angle), low / 3, 20);
            }
            p.pop();

            // p.rotate(p.frameCount/midHi);
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
    };

    var polygon = function(x, y, radius, npoints) {
        var angle = p.TWO_PI / npoints;
        p.beginShape();
        for (var a = 0; a < p.TWO_PI; a += angle) {
            var sx = x + p.cos(a) * radius;
            var sy = y + p.sin(a) * radius;
            p.vertex(sx, sy);
        }
        p.endShape(p.CLOSE);
    };
};

SC.initialize({
    client_id: '3018af38063abcf6a38748e9ad55b455'
});

SC.get('/resolve.json', { url: url }, function(data) {
    sound = data;
    myp5 = new p5(sketch);
});