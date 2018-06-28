function VkCollection(parent, mode) {
    VkChildElement.call(this, parent);
    this.mode = mode;
    this.items = [];

    this.setItems = function(items) {
        this.items = items || [];
    };

    this.createElement = function() {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-dropdown-collection");
        this.items.forEach(
            function(item) {
                var itemElement = new VkCollectionItem(this.element, item);
                itemElement.appendDom(item);
            }.bind(this)
        );
    };
}
