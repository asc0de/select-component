function VkCollectionItem(parent, item) {
    VkChildElement.call(this, parent);
    this.item = item;

    this.createElement = function() {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-dropdown-collection__item");
        var imageElement = document.createElement("DIV");
        imageElement.style.backgroundImage = "url(" + item.imgUrl + ")";
        imageElement.classList.add("vk-dropdown-collection__item__image");
        this.element.appendChild(imageElement);
    };
}
