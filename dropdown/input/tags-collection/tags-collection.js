function VkTagsCollection(parent, items, options) {
    VkChildElement.call(this, parent);
    this.items = items;
    this.dataProp = options.dataProp || "id";
    this.labelProp = options.labelProp || "name";

    this.setSelectedItems = function(items) {
        this.items = items;
    };

    this.render = function() {
        this.clearElement();
        this.items.forEach(
            function(item) {
                var itemElement = new VkTag(this.element, item, { labelProp: this.labelProp, dataProp: this.dataProp });
                itemElement.appendDom(item);
            }.bind(this)
        );
    };

    this.createElement = function() {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-tags-collection");
    };
}
