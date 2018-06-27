function getDropdownModes() {
    var modes = {};

    Object.defineProperty(modes, "SINGLE_SELECT", { value: 1, writable: false });
    Object.defineProperty(modes, "MULTI_SELECT", { value: 2, writable: false });

    return modes;
}
