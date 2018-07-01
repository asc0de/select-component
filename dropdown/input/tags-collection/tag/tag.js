function VkTag(parent, item, options) {
    VkChildElement.call(this, parent);
    this.item = item;
    this.dataProp = options.dataProp || "id";
    this.labelProp = options.labelProp || "name";
    this.onRemove = options.onRemove;

    this.createElement = function() {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-tags-collection__tag");
        this.element.setAttribute("data-value", this.item[this.dataProp]);
        this.element.innerText = this.item[this.labelProp];
    };

    var onDeleteClick = function(e) {
        e.stopPropagation();
        this.onRemove(parseInt(e.target.getAttribute("data-value"), 10));
    };

    this.addEvent("mousedown", onDeleteClick.bind(this), true);
}
