var mtn = "";
var mtninfo = {};
var mtnstatus = {};
var mtnmap = new Image();
const dashLength = 15;
var dashAnimationIndex = dashLength;

window.onload = function() {
    mtn = getParam('m');
    
    updateLegend();

    var canvas = document.getElementById('render');
    mtnmap.src = `http://mountainstats-api.qauinger.com/mountains/${mtn}/map`;
    mtnmap.onload = function() {
        canvas.height = mtnmap.height;
        canvas.width = mtnmap.width;
        renderMountainStatus();
    }
}

async function renderMountainStatus() {
    var info = await fetch(`https://mountainstats-api.qauinger.com/mountains/${mtn}`);
    mtninfo = (await info.json())[mtn];

    document.getElementById('mountain-title').innerHTML = mtninfo['name'];
    document.getElementById('mountain-info').innerHTML = `${mtninfo['locality']}, ${mtninfo['region']} - <a href="${mtninfo['url']}" target="_blank">${mtninfo['url']}</a>`;
    
    var status = await fetch(`https://mountainstats-api.qauinger.com/mountains/${mtn}/status`);
    mtnstatus = (await status.json());

    document.getElementById('last-checked').innerHTML = `Last checked: ${new Date(mtnstatus['lastChecked'] * 1000).toLocaleString()}`;
    
    window.requestAnimationFrame(drawMountainStatus);
}

function drawMountainStatus() {

    var canvas = document.getElementById('render');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mtnmap,0,0, canvas.width, canvas.height);

    var trails = mtninfo['trails'];
    Object.keys(trails).forEach(trail => {
        var polylines = mtninfo['trails'][trail]['polylines'];
        Object.keys(polylines).forEach(line => {
            var x = polylines[line][0][0];
            var y = polylines[line][0][1];
            var curves = [];
            for(var i = 1; i < Object.keys(polylines[line]).length; i++) {
                curves.push(polylines[line][i]);
            }
            drawBezier(x, y, curves, 'trail', mtnstatus['trails'][trail] == 1 ? 'open' : mtnstatus['trails'][trail] === 0 ? 'closed' : 'unknown');
        });
    });

    var lifts = mtninfo['lifts'];
    Object.keys(lifts).forEach(lift => {
        var polylines = mtninfo['lifts'][lift]['polylines'];
        Object.keys(polylines).forEach(line => {
            var x = polylines[line][0][0];
            var y = polylines[line][0][1];
            var curves = [];
            for(var i = 1; i < Object.keys(polylines[line]).length; i++) {
                curves.push(polylines[line][i]);
            }
            drawBezier(x, y, curves, 'lift', mtnstatus['lifts'][lift] == 1 ? 'open' : mtnstatus['lifts'][lift] === 0 ? 'closed' : 'unknown', dashAnimationIndex);
        });
    });

    if(dashAnimationIndex >= 0) {
        dashAnimationIndex -= 1;
    } else {
        dashAnimationIndex = dashLength;
    }

    if(getCookie('lift_animation') === 'true') {
        setTimeout(function() {
            window.requestAnimationFrame(drawMountainStatus);
        }, 100);
    }
}

function updateLegend() {
    document.getElementById('open-trail-legend').style = `background-color: ${getCookie('open_trail_color')}`;
    document.getElementById('closed-trail-legend').style = `background-color: ${getCookie('closed_trail_color')}`;
    document.getElementById('open-lift-legend').style = `background-color: ${getCookie('open_lift_color')}`;
    document.getElementById('closed-lift-legend').style = `background-color: ${getCookie('closed_lift_color')}`;
}

function drawBezier(x, y, curves, type, status, startOffset) {
    var ctx = document.getElementById('render').getContext('2d');
    if(type === 'trail') {
        ctx.strokeStyle = getCookie(`${status}_trail_color`);
        ctx.setLineDash([]);
        ctx.lineCap = 'butt';
    } else if(type === 'lift') {
        ctx.strokeStyle = getCookie(`${status}_lift_color`);
        ctx.setLineDash([1, dashLength]);
        if(status === 'open') {
            ctx.lineDashOffset = startOffset;
        } else {
            ctx.lineDashOffset = 0;
        }
        ctx.lineCap = 'round';
    }
    ctx.lineWidth = getCookie('line_thickness');
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
