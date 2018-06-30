function getKeyCodes() {
    var codes = {};

    Object.defineProperty(codes, "ARROW_LEFT", { value: 37, writable: false });
    Object.defineProperty(codes, "ARROW_UP", { value: 38, writable: false });
    Object.defineProperty(codes, "ARROW_RIGHT", { value: 39, writable: false });
    Object.defineProperty(codes, "ARROW_DOWN", { value: 40, writable: false });
    Object.defineProperty(codes, "SHIFT", { value: 16, writable: false });
    Object.defineProperty(codes, "ALT", { value: 17, writable: false });

    return codes;
}
