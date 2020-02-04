const isDev = window.isDev;

function getConsumerKey() {
    return "YOUR_KEY_HERE"
}

function getRedirectUri() {
    return "pocketapp1234:authorizationFinished"
}

function getOauthUrl() {
    if(isDev)
        return "https://cors-anywhere.herokuapp.com/https://getpocket.com/v3/oauth/request"
    else
        return "https://getpocket.com/v3/oauth/request"
}

function getAuthorizeUrl() {
    if(isDev)
        return "https://cors-anywhere.herokuapp.com/https://getpocket.com/v3/oauth/authorize"
    else
        return "https://getpocket.com/v3/oauth/authorize"
}

function getArticlesUrl() {
    if(isDev)
        return "https://cors-anywhere.herokuapp.com/https://getpocket.com/v3/get"
    else
        return "https://getpocket.com/v3/get"
}

export { getConsumerKey, getOauthUrl, getAuthorizeUrl, getArticlesUrl, getRedirectUri }