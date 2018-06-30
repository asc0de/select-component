function VkChildElement(parent) {
    VkBaseElement.call(this);

    this.parent = parent;
    this.events = [];
    this.appended = false;

    var checkElement = function(model) {
        if (!this.element) this.createElement(model);
    };

    this.createElement = function() {
        throw new Error('"createElement" function should be implemented for child elements');
    };
    this.appendDom = function(model) {
        checkElement.call(this, model);
        if (!this.appended) {
            this.parent.appendChild(this.element);
            this.appended = true;
        } else {
            this.show();
        }
    };
    this.detachFromDom = function(force) {
        if (force) {
            this.parent.removeChild(this.element);
            this.appended = false;
        } else {
            this.hide();
        }
    };
    this.hide = function() {
        this.element.style.display = "none";
    };
    this.show = function() {
        this.element.style.display = "";
    };
    this.addEvent = function(eventName, callback, useCapture) {
        checkElement.call(this);
        useCapture = useCapture || false;
        this.element.addEventListener(eventName, callback, useCapture);
        this.events.push({ event: eventName, callback: callback });
    };
    this.removeEvent = function(eventName) {
        checkElement.call(this);
        var currentEvent = this.events.filter(function(event) {
            return eventName === event.name;
        });
        this.element.removeEventListener(currentEvent.name, currentEvent.callback);
    };
    this.destroyElement = function() {
        this.events.forEach(
            function(event) {
                this.removeEvent(event.name);
            }.bind(this)
        );
        this.detachFromDom();
    };
    this.clearElement = function() {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    };
}
