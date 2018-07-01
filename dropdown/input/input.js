function VkInput(parent, options) {
    VkChildElement.call(this, parent);
    var DropdownMode = getDropdownModes();
    this.placeholder = options.placeholder || "";
    this.selectedItems = options.selectedItems || [];
    this.mode = options.mode || DropdownMode.SINGLE_SELECT;

    this.setSelectedItems = function(items) {
        this.tagsCollection.setSelectedItems(items);
        if (items.length === 1 && this.mode === DropdownMode.SINGLE_SELECT) {
            this.handleSelectedSingleMode();
        }
        if (items.length === 0 && this.mode === DropdownMode.SINGLE_SELECT) {
            this.handleUnselectedSingleMode();
        }
        this.tagsCollection.render();
    };

    this.createElement = function() {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-dropdown__input");
        this.tagsCollection = new VkTagsCollection(this.element, this.selectedItems, {
            labelProp: options.labelProp,
            dataProp: options.dataProp,
            onRemove: options.onRemove
        });
        this.tagsCollection.appendDom();
        var input = document.createElement("INPUT");
        if (this.placeholder) input.placeholder = this.placeholder;
        this.inputElement = input;
        this.element.appendChild(this.inputElement);
    };

    this.handleSelectedSingleMode = function() {
        this.inputElement.placeholder = "";
        this.element.classList.add("vk-dropdown__input--selected");
    };

    this.handleUnselectedSingleMode = function() {
        this.inputElement.placeholder = this.placeholder;
        this.element.classList.remove("vk-dropdown__input--selected");
    };

    this.getWidth = function() {
        return this.element.offsetWidth - 2;
    };

    this.disable = function() {
        this.element.childNodes[1].setAttribute("disabled", "disabled");
    };

    this.enable = function() {
        this.element.childNodes[1].removeAttribute("disabled");
    };
}
