function ChildElement(parent) {
    this.parent = parent;
    this.appendDom = function() {
        if (!this.element) this.createElement();
        this.parent.appendChild(this.element);
    };
}
