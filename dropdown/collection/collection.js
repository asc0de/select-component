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
    this.selectItem = function(e) {
        var filteredItems = this.items.filter(
            function(item) {
                return item[this.dataProp] === parseInt(e.target.getAttribute("data-value"));
            }.bind(this)
        );
        if (filteredItems && filteredItems.length) {
            this.onSelect(filteredItems[0]);
            this.hide();
        }
    };

    this.render = function() {
        this.clearElement();
        this.items.forEach(
            function(item) {
                var itemElement = new VkCollectionItem(this.element, item, { avatarEnabled: this.avatarEnabled });
                itemElement.appendDom(item);
            }.bind(this)
        );
    };

    this.createElement = function() {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-dropdown-collection");
        this.render();
        this.addEvent("click", this.selectItem.bind(this));
    };
}
