function VkInput(parent, options) {
    VkChildElement.call(this, parent);
    this.placeholder = options.placeholder || "";
    this.selectedItems = options.selectedItems || [];

    this.setSelectedItems = function(items) {
        this.tagsCollection.setSelectedItems(items);
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

    this.disable = function() {
        this.element.childNodes[1].setAttribute("disabled", "disabled");
    };

    this.enable = function() {
        this.element.childNodes[1].removeAttribute("disabled");
    };
}
