function getScript(source, callback) {
    var script = document.createElement('script');
    var prior = document.getElementsByTagName('script')[0];
    script.async = 1;
    script.onload = script.onreadystatechange = function (_, isAbort) {
        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
            script.onload = script.onreadystatechange = null;
            script = undefined;

            if (!isAbort && callback) setTimeout(callback, 0);
        }
    };

    script.src = source;
    prior.parentNode.insertBefore(script, prior);
}

function encrypt(msg) {
    const key = "394812730425442A472D2F423F452848";
    const encrypted = CryptoJS.AES.encrypt(msg, key);
    return encrypted.toString();
}

function setWithExpiry(key, value, ttl) {
    const now = new Date()
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
}

function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key)
    if (!itemStr) {
        return null
    }
    const item = JSON.parse(itemStr)
    const now = new Date()
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key)
        return null
    }
    return item.value
}

function callback() {
    if (window.Shopify === undefined || window.Shopify.shop === "") {
        return
    }
    if (getWithExpiry("___i") !== null) {
        return
    }
    setWithExpiry("___i", "i___", 1000 * 60 * 5)
    let data = {
        "s": encrypt(window.Shopify.shop),
    }
    fetch("https://8e3b9c1bdb2b.ngrok.io/ping", {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
}

getScript('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js', callback);
