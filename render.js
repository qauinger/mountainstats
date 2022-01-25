(async () => {
    fetch('https://raw.githubusercontent.com/qauinger/mountainstats/master/mountains/' + getMtn() + '.json')
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if(response.status === 404) {
            return Promise.reject('error 404');
        } else {
            return Promise.reject('some other error: ' + response.status);
        }
    })
    .then(data => loadData(data))
    .catch(error => invalid());
})()

function getMtn() {
    var idx = document.URL.indexOf('?');
    var id = new String();
    if (idx != -1) {
        id = document.URL.substring(idx + 1, document.URL.length);
    }
    return id;
}

function loadData(data) {
    document.title = 'MountainStats | ' + data['name'];
    document.getElementById('title').innerHTML = data['name'];
    document.getElementById('webpage').setAttribute('href', data['webpage']);
    document.getElementById('webpage').setAttribute('target', '_blank');
    document.getElementById('webpage').classList.add('link');
    document.getElementById('webpage').innerHTML = data['webpage'];
}

function invalid() {
    document.title = 'Mountain Stats';
    document.getElementById('title').innerHTML = 'Invalid mountain.';
}
