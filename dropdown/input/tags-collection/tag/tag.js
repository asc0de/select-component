function VkTag(parent, item, options) {
    VkChildElement.call(this, parent);
    this.item = item;
    this.dataProp = options.dataProp || "id";
    this.labelProp = options.labelProp || "name";

    this.createElement = function() {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-tags-collection__tag");
        this.element.innerText = this.item[this.labelProp];
    };
}
