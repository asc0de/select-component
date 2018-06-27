function getKeyCodes() {
    var codes = {};

    Object.defineProperty(codes, "ARROW_UP", { value: 38, writable: false });
    Object.defineProperty(codes, "ARROW_DOWN", { value: 40, writable: false });

    return codes;
}
