var amplitude;
var fft, spectrum, low, midLo, midHi, high;
var volume = 0;
var maxx = 0;

var client_id = '3018af38063abcf6a38748e9ad55b455';
var url = 'https://soundcloud.com/shhsecretsongs/shh020-diveo-summer-trees';
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
            p.translate(width / 2, height / 2)
            p.stroke(255);

            p.rotate(frameCount / midHi);
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

            var cirB = height / 2;
            p.ellipse(p.map(high, 0, 255, 0, width),
                p.map(low, 0, 255, 0, height), cirB, cirB);

            p.ellipse(width - p.map(high, 0, 255, 0, width),
                height - p.map(low, 0, 255, 0, height), cirB, cirB);

            p.ellipse(p.map(high, 0, 255, 0, width),
                height - p.map(low, 0, 255, 0, height), cirB, cirB);

            p.ellipse(width - p.map(high, 0, 255, 0, width),
                p.map(low, 0, 255, 0, height), cirB, cirB);

            var cirA = 2 * midHi;
            p.ellipse(p.map(low, 0, 255, 0, width),
                p.map(high, 0, 255, 0, height), cirA, cirA);
            p.ellipse(width - p.map(low, 0, 255, 0, width),
                height - p.map(high, 0, 255, 0, height), cirA, cirA);
            p.ellipse(width - p.map(low, 0, 255, 0, width),
                p.map(high, 0, 255, 0, height), cirA, cirA);
            p.ellipse(p.map(low, 0, 255, 0, width),
                height - p.map(high, 0, 255, 0, height), cirA, cirA);

            p.stroke(255);

            p.strokeWeight(p.map(low, 0, 255, 1, 30));
            for (var i = 0; i <= width; i += (width / p.map(midLo, 0, 255, 6, 16))) {
                p.line(i, 0, i, height);
            }

            p.strokeWeight(p.map(high, 0, 255, 1, 30));
            for (var j = 0; j <= height; j += (height / p.map(midHi, 0, 255, 6, 16))) {
                p.line(0, j, width, j);
            }

            /*noFill();
      for (var i = 1; i <= 20; i+=4){
        rect(width/2 - ((low/4)*i)/2, 
          height/2 - ((high/4)*i) /2, (low/4)*i, (high/4)*i );
  }*/
        } else if (numpressed == 2) {
            var waveform = fft.waveform();
            p.noFill();

            p.stroke(255);
            p.strokeWeight(20);
            for (var i = 0; i <= width; i += width / 12) {
                p.line(random(10, 100) + i, 0, random(10, 100) + i, height);
            }

            p.beginShape();
            p.stroke(255, 255, 255); // waveform is red
            p.strokeWeight(p.map(low, 0, 255, 1, 30));
            for (var i = 0; i < waveform.length; i++) {
                var x = p.map(i, 0, waveform.length, 0, width);
                var y = p.map(waveform[i], 0, 255, 0, height / 4);
                p.vertex(x, y);
            }
            p.endShape();

            p.beginShape();
            p.strokeWeight(p.map(midLo, 0, 255, 1, 30));
            for (var i = 0; i < waveform.length; i++) {
                var x = p.map(i, 0, waveform.length, 0, width);
                var y = p.map(waveform[i], 0, 255, height / 4, 2 * height / 4);
                p.vertex(x, y);
            }
            p.endShape();

            p.beginShape();
            p.strokeWeight(p.map(midHi, 0, 255, 1, 30));
            for (var i = 0; i < waveform.length; i++) {
                var x = p.map(i, 0, waveform.length, 0, width);
                var y = p.map(waveform[i], 0, 255, 2 * height / 4, 3 * height / 4);
                p.vertex(x, y);
            }
            p.endShape();

            p.beginShape();
            p.strokeWeight(p.map(high, 0, 255, 1, 30));
            for (var i = 0; i < waveform.length; i++) {
                var x = p.map(i, 0, waveform.length, 0, width);
                var y = p.map(waveform[i], 0, 255, 3 * height / 4, height);
                p.vertex(x, y);
            }
            p.endShape();
        } else if (numpressed == 3) {
            num = 12;
            p.noStroke();

            p.fill(0, 0, 0);
            p.ellipse(width / 2, height / 2, midLo * 4, midLo * 4);

            p.push();
            p.translate(width / 2, height / 2);
            p.rotate(frameCount / low / 2);
            p.fill(0, 0, 255 - maxx);
            for (var i = 0; i <= width; i += width / num) {
                for (var j = 0; j <= height; j += height / num) {
                    p.rotate(frameCount / low / 2);
                    p.ellipse(i + random(5, 15), j + random(5, 15), high / 2, high / 2);
                }
            }
            p.pop();

            p.stroke(255);
            p.strokeWeight(25 + low / 15);
            p.fill(255, 255, 255); // spectrum is green
            for (var i = 0; i < spectrum.length; i += 8) {
                var x = p.map(i, 0, spectrum.length, 0, width);
                var h = p.map(spectrum[i], 0, 255, 0, height / 8) * 4;
                p.line(x, 0, x, h);
                p.line(width - x, height, width - x, height - h);
                p.line(x, height, x, height - h);
                p.line(width - x, 0, width - x, h);
            }
            console.log(width);
            p.stroke(0, 0, maxx);
            p.strokeWeight(25);
            for (var i = 0; i < spectrum.length; i += 8) {
                var x = p.map(i, 0, spectrum.length, 0, width);
                var h = p.map(spectrum[i], 0, 255, 0, height / 8) * 4;
                p.line(x, 0, x, h);
                p.line(width - x, height, width - x, height - h);
                p.line(x, height, x, height - h);
                p.line(width - x, 0, width - x, h);
            }
        } else if (numpressed == 4) {
            p.noStroke();
            p.angleMode(RADIANS);

            p.translate(width / 2, height / 2);

            p.push();
            p.rotate(frameCount / 1 / midHi);
            for (var angleB = 0; angleB <= 2 * PI; angleB += PI / round(high / 5)) {
                polygon((high + (width / 28)) * cos(angleB), (high + (height / 24)) * sin(angleB), high / 16, 3);
            }
            p.pop();

            p.push();
            p.rotate(frameCount / 1 / high);
            for (var angleB = 0; angleB <= 2 * PI; angleB += PI / round(midHi / 10)) {
                polygon((midHi + (width / 16)) * cos(angleB), (midHi + (height / 12)) * sin(angleB), midHi / 8, 5);
            }
            p.pop();

            p.push();
            p.rotate(frameCount / 1 / low);
            for (var angle = 0; angle <= 2 * PI; angle += PI / round(midLo / 15)) {
                polygon((midLo + (width / 8)) * cos(angle), (midLo + (height / 6)) * sin(angle), midLo / 4, 8);
            }
            p.pop();

            p.push();
            p.rotate(frameCount / 1 / midLo);
            for (var angle = 0; angle <= 2 * PI; angle += PI / round(low / 20)) {
                polygon((low + (width / 4)) * cos(angle), (low + (height / 3)) * sin(angle), low / 3, 20);
            }
            p.pop();

            // p.rotate(frameCount/midHi);
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
        var angle = TWO_PI / npoints;
        p.beginShape();
        for (var a = 0; a < TWO_PI; a += angle) {
            var sx = x + cos(a) * radius;
            var sy = y + sin(a) * radius;
            p.vertex(sx, sy);
        }
        p.endShape(CLOSE);
    };
};

SC.initialize({
    client_id: '3018af38063abcf6a38748e9ad55b455'
});

SC.get('/resolve.json', { url: url }, function(data) {
    sound = data;
    myp5 = new p5(sketch);
});