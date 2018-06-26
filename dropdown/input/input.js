function Input(parent, placeholder) {
    ChildElement.call(this, parent);
    this.placeholder = placeholder || "";
    this.createElement = function() {
        this.element = document.createElement("INPUT");
        this.element.placeholder = this.placeholder;
        this.element.classList.add("vk-dropdown__input");
    };
}
