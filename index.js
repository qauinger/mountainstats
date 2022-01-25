(async () => {
    const response = await fetch('https://api.github.com/repos/qauinger/mountainstats/contents/mountains');
    const data = await response.json();
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        var mtn = data[i];
        var id = data[i]['name'];
        if(!id.endsWith('.json'))
            break;
        id = id.slice(0, -5);
        const r = await fetch(mtn['download_url']);
        const d = await r.json();
        var name = d['name'];
        var node = document.createElement('li');
        node.classList.add('mtn');
        var link = document.createElement('a');
        link.setAttribute('href', 'render?' + id);
        link.innerHTML = name + ' (' + d['region'] + ')';
        node.appendChild(link);
        document.getElementById('mtn-list').appendChild(node);
    }
})()
