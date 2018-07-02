function getSettings() {
    var settings = {};

    Object.defineProperty(settings, "serverUrl", { value: "http://localhost:8000/api/", writable: false });

    return settings;
}
