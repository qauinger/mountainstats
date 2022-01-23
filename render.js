(async () => {
    fetch('https://raw.githubusercontent.com/qauinger/mountainstats/master/mountains/' + getParams()['m'] + '.json')
    .then(response => {
        if (response.ok) {
            return response.json()
        } else if(response.status === 404) {
            return Promise.reject('error 404')
        } else {
            return Promise.reject('some other error: ' + response.status)
        }
    })
    .then(data => loadData(data))
    .catch(error => invalid());
})()

function getParams() {
    var idx = document.URL.indexOf('?');
    var params = new Array();
    if (idx != -1) {
        var pairs = document.URL.substring(idx + 1, document.URL.length).split('&');
        for (var i = 0; i < pairs.length; i++) {
            var nameVal = pairs[i].split('=');
            params[nameVal[0]] = nameVal[1];
        }
    }
    return params;
}

function loadData(data) {
    var title = document.createElement('a');
    title.setAttribute('href', data['webpage'])
    title.setAttribute('style', 'text-decoration: none;')
    title.setAttribute('target', '_blank')
    var header = document.createElement('h1');
    header.innerHTML = data['name'];
    title.appendChild(header);

    document.body.appendChild(title)
    //document.getElementById('header').innerHTML = 'Loading ' + data['name'] + '...';
    document.getElementById('title').innerHTML = 'Mountain Stats' + data['name'];
}

function invalid() {
    document.getElementById('title').innerHTML = 'Mountain Stats | Invalid!';
    document.getElementById('header').innerHTML = 'Unknown mountain.';
    var ret = document.createElement('a');
    ret.setAttribute('href', 'index.html');
    ret.setAttribute('style', 'text-decoration: none;');
    ret.innerHTML = '<- Return';
    document.body.appendChild(ret);
}
