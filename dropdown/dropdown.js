function VkDropdown(options) {
    options = options || {};
    if (!options.element && !(options instanceof Node)) throw new Error("Dom element should be initialized!");
    if (options instanceof Node) {
        this.element = options;
    } else {
        this.element = options.element;
    }
    this.mode = options.mode || DropdownMode.SINGLE_SELECT;
    this.input = new Input(this.element, options.placeholder);

    this.appendDom = function() {
        this.element.innerHTML = "";
        this.element.classList.add("vk-dropdown");
        this.input.appendDom();
    };

    this.appendDom();
}
