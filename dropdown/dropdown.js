function VkDropdown(options) {
    var DropdownMode = getDropdownModes();
    var KeyCode = getKeyCodes();
    options = options || {};
    if (!options.element && !(options instanceof Node)) throw new Error("Dom element should be initialized!");
    if (options instanceof Node) {
        this.element = options;
    } else {
        this.element = options.element;
    }
    this.mode = options.mode || DropdownMode.SINGLE_SELECT;
    this.input = new Input(this.element, options.placeholder);
    this.collection = new Collection(this.element, this.mode);

    var onInputFocus = function(e) {
        this.collection.setItems(getUsers());
        this.collection.appendDom();
    };

    var onInputBlur = function(e) {
        this.collection.detachFromDom();
    };

    var onInputKeyUp = function(e) {
        switch (e.keyCode) {
            case KeyCode.ARROW_DOWN: {
                break;
            }
            default: {
                break;
            }
        }
    };

    this.appendDom = function() {
        this.element.innerHTML = "";
        this.element.classList.add("vk-dropdown");
        this.input.appendDom();
        this.input.addEvent("keyup", onInputKeyUp.bind(this));
        this.input.addEvent("focus", onInputFocus.bind(this), true);
        this.input.addEvent("blur", onInputBlur.bind(this), true);
    };

    this.appendDom();
}
