(async () => {
    window.onload = function() {
        var canvas = document.getElementById('render');
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var img = new Image();
        img.src = `http://mountainstats-api.qauinger.com/mountains/${getParam('m')}/map`;
        img.onload = function() {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img,0,0, canvas.width, canvas.height);
            showMountainStatus();
        }

        updateLegend();
    }
})()

async function showMountainStatus() {
    const mountain_response = await fetch(`https://mountainstats-api.qauinger.com/mountains/${getParam('m')}`);
    var mountain = (await mountain_response.json())[getParam('m')];

    const status_response = await fetch(`https://mountainstats-api.qauinger.com/mountains/${getParam('m')}/status`);
    var status = (await status_response.json());
    
    var trail_status = status['trails'];
    Object.keys(trail_status).forEach(trail => {
        var polylines = mountain['trails'][trail]['polylines'];
        Object.keys(polylines).forEach(line => {
            var x = polylines[line][0][0];
            var y = polylines[line][0][1];
            var curves = [];
            for(var i = 1; i < Object.keys(polylines[line]).length; i++) {
                curves.push(polylines[line][i]);
            }

            var color;
            if(trail_status[trail] === 1) {
                color = getCookie('open_trail_color');
            } else if(trail_status[trail] === 0) {
                color = getCookie('closed_trail_color');
            } else {
                color = "black";
            }
            drawBezier(x, y, curves, color);
        });
    });

    var lift_status = status['lifts'];
    console.log(status);
    Object.keys(lift_status).forEach(lift => {
        var polylines = mountain['lifts'][lift]['polylines'];
        Object.keys(polylines).forEach(line => {
            var x = polylines[line][0][0];
            var y = polylines[line][0][1];
            var curves = [];
            for(var i = 1; i < Object.keys(polylines[line]).length; i++) {
                curves.push(polylines[line][i]);
            }

            var color;
            if(lift_status[lift] === 1) {
                color = getCookie('open_lift_color');
            } else if(lift_status[lift] === 0) {
                color = getCookie('closed_lift_color');
            } else {
                color = "black";
            }
            drawBezier(x, y, curves, color, true);
        });
    });
}

function updateLegend() {
    document.getElementById('open-trail-legend').style = `background-color: ${getCookie('open_trail_color')}`;
    document.getElementById('closed-trail-legend').style = `background-color: ${getCookie('closed_trail_color')}`;
    document.getElementById('open-lift-legend').style = `background-color: ${getCookie('open_lift_color')}`;
    document.getElementById('closed-lift-legend').style = `background-color: ${getCookie('closed_lift_color')}`;
}

function drawBezier(x, y, curves, color, dotted) {
    var ctx = document.getElementById('render').getContext('2d');
    ctx.lineWidth = getCookie('line_thickness');
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    if(dotted) {
        ctx.setLineDash([1, 15]);
        ctx.lineCap = 'round';
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (i = 0; i < curves.length; i++) {
        c = curves[i];
        ctx.bezierCurveTo(c[0], c[1], c[2], c[3], c[4], c[5]);
        ctx.moveTo(c[4], c[5]);
        ctx.stroke();
    }
}

function getParam(param) {
    var val = new URL(document.URL).searchParams.get(param);
    return val;
}
