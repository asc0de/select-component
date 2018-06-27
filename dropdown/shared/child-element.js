function ChildElement(parent) {
    this.parent = parent;
    this.events = [];

    var checkElement = function() {
        if (!this.element) this.createElement();
    };

    this.createElement = function() {
        throw new Error('"createElement" function should be implemented for child elements');
    };
    this.appendDom = function() {
        checkElement.call(this);
        this.parent.appendChild(this.element);
    };
    this.detachFromDom = function() {
        this.parent.removeChild(this.element);
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
}
