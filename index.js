(async () => {
    const response = await fetch('https://api.github.com/repos/qauinger/mountainstats/contents/mountains');
    const data = await response.json();
    console.log(data);
    Object.keys(data).forEach(async function(k) {
        var mtn = data[k];
        var id = data[k]['name'].slice(0, -5);
        const r = await fetch(mtn['download_url']);
        const d = await r.json();
        var name = d['name'];
        var node = document.createElement('li');
        node.className = 'mtn';
        var link = document.createElement('a');
        link.setAttribute('href', 'render.html?m=' + id);
        link.innerHTML = name + ' (' + d['region'] + ')';
        node.appendChild(link);
        document.getElementById('mountains').appendChild(node);
    })
})()
