function VkCollection(parent, options) {
    VkChildElement.call(this, parent);
    this.mode = options.mode || DropdownMode.SINGLE_SELECT;
    this.avatarEnabled = options.avatarEnabled || false;
    this.dataProp = options.dataProp || "id";
    this.notFoundLabel = options.notFoundLabel || "Результатов не найдено";
    this.onSelect = options.onSelect;
    this.items = [];

    this.setItems = function(items) {
        this.items = items || [];
    };
    this.onSelect = function(id) {
        options.onSelect(id);
        this.hide();
    };

    this.render = function() {
        this.clearElement();
        if (this.items.length) {
            this.items.forEach(
                function(item) {
                    var itemElement = new VkCollectionItem(this.element, item, {
                        avatarEnabled: this.avatarEnabled,
                        onSelect: this.onSelect.bind(this)
                    });
                    itemElement.appendDom(item);
                }.bind(this)
            );
        } else {
            var notFoundContainer = document.createElement("DIV");
            notFoundContainer.innerText = this.notFoundLabel;
            notFoundContainer.classList.add("vk-dropdown-collection--not-found");
            this.element.appendChild(notFoundContainer);
        }
    };

    this.createElement = function() {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-dropdown-collection");
        if (options.getWidth) this.element.style.width = (options.getWidth() || 200) + "px";
        this.render();
    };
}
