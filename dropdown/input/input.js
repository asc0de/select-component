function VkInput(parent, placeholder) {
    VkChildElement.call(this, parent);
    this.placeholder = placeholder || "";

    this.createElement = function() {
        var input = document.createElement("INPUT");
        input.placeholder = this.placeholder;
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-dropdown__input");
        this.element.appendChild(input);
    };
}
