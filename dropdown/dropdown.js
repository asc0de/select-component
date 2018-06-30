function VkDropdown(options) {
    VkBaseElement.call(this);
    var DropdownMode = getDropdownModes();
    var KeyCode = getKeyCodes();
    options = options || {};
    if (!options.element && !(options instanceof Node)) throw new Error("Dom element should be initialized!");
    if (options instanceof Node) {
        this.element = options;
    } else {
        this.element = options.element;
    }

    //properties
    this.mode = options.mode || DropdownMode.SINGLE_SELECT;
    this.service = new VkDropdownService();
    this.items = getUsers();

    //elements
    this.input = new VkInput(this.element, options.placeholder);
    this.collection = new VkCollection(this.element, this.mode);

    var onInputFocus = function(e) {
        this.collection.setItems(this.items);
        this.collection.appendDom();
    };

    var onInputBlur = function(e) {
        this.collection.detachFromDom();
    };

    var onInputKeyUp = function(e) {
        switch (e.keyCode) {
            case KeyCode.ARROW_LEFT:
            case KeyCode.ARROW_TOP:
            case KeyCode.ARROW_RIGHT:
            case KeyCode.ARROW_DOWN:
            case KeyCode.ALT:
            case KeyCode.SHIFT: {
                break;
            }
            default: {
                this.items = this.service.search(e.target.value, this.items);
                this.collection.setItems(this.items);
                this.collection.render();
                break;
            }
        }
    };

    this.appendDom = function() {
        this.element.innerHTML = "";
        this.element.classList.add("vk-dropdown");
        this.input.appendDom();
        var debouncedInputKeyUp = this.helper.debounce(onInputKeyUp.bind(this));
        this.input.addEvent("keyup", debouncedInputKeyUp, 300, this);
        this.input.addEvent("focus", onInputFocus.bind(this), true);
        this.input.addEvent("blur", onInputBlur.bind(this), true);
    };

    this.appendDom();
}
