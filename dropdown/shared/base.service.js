function BaseService() {
    var settings = getSettings();
    var proceedRequest = function(url, type, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(type, settings.serverUrl + url, true);
        xhr.onreadystatechange = function() {
            callback(JSON.parse(xhr.responseText));
        };
        xhr.send();
    };

    this.get = function(url, callback) {
        proceedRequest(url, "GET", callback);
    };
}
