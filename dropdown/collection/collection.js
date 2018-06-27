function Collection(parent, mode) {
    ChildElement.call(this, parent);
    this.mode = mode;
    this.items = [];

    this.setItems = function(items) {
        this.items = items;
    };

    this.createElement = function() {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-dropdown-collection");
        this.items.forEach(
            function(item) {
                var itemElement = document.createElement("DIV");
                itemElement.classList.add("vk-dropdown-collection__item");
                var imageElement = document.createElement("DIV");
                imageElement.style.backgroundImage = "url(" + item.imgUrl + ")";
                imageElement.classList.add("vk-dropdown-collection__item__image");
                itemElement.appendChild(imageElement);
                this.element.appendChild(itemElement);
            }.bind(this)
        );
    };
}
