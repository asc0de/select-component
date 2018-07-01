function VkCollection(parent, options) {
    VkChildElement.call(this, parent);
    this.mode = options.mode || DropdownMode.SINGLE_SELECT;
    this.avatarEnabled = options.avatarEnabled || false;
    this.dataProp = options.dataProp || "id";
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
        this.items.forEach(
            function(item) {
                var itemElement = new VkCollectionItem(this.element, item, {
                    avatarEnabled: this.avatarEnabled,
                    onSelect: this.onSelect.bind(this)
                });
                itemElement.appendDom(item);
            }.bind(this)
        );
    };

    this.createElement = function() {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-dropdown-collection");
        this.render();
    };
}
