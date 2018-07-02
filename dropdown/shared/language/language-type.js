function getLanguageTypes() {
    var types = {};

    Object.defineProperty(types, "KEYBOARD", { value: 1, writable: false });
    Object.defineProperty(types, "PRONOUNCE", { value: 2, writable: false });

    return types;
}
