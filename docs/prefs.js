const default_prefs = {
    "recents_persist":"true",
    "open_trail_color":"#4F7A28",
    "closed_trail_color":"#AAAAAA",
    "open_lift_color":"#89172A",
    "closed_lift_color":"#AAAAAA",
    "line_thickness":"13"
}

function getDefaultPref(id) {
    return default_prefs[id];
}

function getDefaultPrefs() {
    return default_prefs;
}

function savePrefs() {
    setCookie('recents_persist', document.getElementById('recents_persist').checked, 36500);
    setCookie('open_trail_color', document.getElementById('open_trail_color').value, 36500);
    setCookie('closed_trail_color', document.getElementById('closed_trail_color').value, 36500);
    setCookie('open_lift_color', document.getElementById('open_lift_color').value, 36500);
    setCookie('closed_lift_color', document.getElementById('closed_lift_color').value, 36500);
    setCookie('line_thickness', document.getElementById('line_thickness').value, 36500);
    console.log('Saved preferences.');
}

function loadPrefs() {
    document.getElementById('recents_persist').checked = (getCookie('recents_persist') === 'true');
    document.getElementById('open_trail_color').value = getCookie('open_trail_color');
    document.getElementById('closed_trail_color').value = getCookie('closed_trail_color');
    document.getElementById('open_lift_color').value = getCookie('open_lift_color');
    document.getElementById('closed_lift_color').value = getCookie('closed_lift_color');
    document.getElementById('line_thickness').value = getCookie('line_thickness');
    document.getElementById('line_thickness_label').value = getCookie('line_thickness');
    console.log('Loaded preferences.');
}

function getCookie(id) {
    let name = id + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return getDefaultPref(id);
}

function setCookie(id, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = id + "=" + value + ";" + expires + ";path=/";
}

function removeCookie(id) {
    setCookie(id, 0, -1);
}

function removeAllCookies() {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
}
