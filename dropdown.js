;(function () {
function VkDropdown(options) {
    VkBaseElement.call(this);
    var DropdownMode = getDropdownModes();
    var KeyCode = getKeyCodes();
    options = options || {};
    if (!options.element && !(options instanceof Node)) throw new Error("Dom element should be initialized!");
    if (options instanceof Node) {
        this.element = options;
    } else {
        this.element = options.element;
    }

    //properties
    this.mode = options.mode || DropdownMode.SINGLE_SELECT;
    this.service = new VkDropdownService();
    this.items = getUsers();

    //elements
    this.input = new VkInput(this.element, options.placeholder);
    this.collection = new VkCollection(this.element, this.mode);

    var onInputFocus = function(e) {
        this.collection.setItems(this.items);
        this.collection.appendDom();
    };

    var onInputBlur = function(e) {
        this.collection.detachFromDom();
    };

    var onInputKeyUp = function(e) {
        switch (e.keyCode) {
            case KeyCode.ARROW_LEFT:
            case KeyCode.ARROW_TOP:
            case KeyCode.ARROW_RIGHT:
            case KeyCode.ARROW_DOWN:
            case KeyCode.ALT:
            case KeyCode.SHIFT: {
                break;
            }
            default: {
                this.items = this.service.search(e.target.value, this.items);
                this.collection.setItems(this.items);
                this.collection.render();
                break;
            }
        }
    };

    this.appendDom = function() {
        this.element.innerHTML = "";
        this.element.classList.add("vk-dropdown");
        this.input.appendDom();
        var debouncedInputKeyUp = this.helper.debounce(onInputKeyUp.bind(this));
        this.input.addEvent("keyup", debouncedInputKeyUp, 300, this);
        this.input.addEvent("focus", onInputFocus.bind(this), true);
        this.input.addEvent("blur", onInputBlur.bind(this), true);
    };

    this.appendDom();
}

function VkDropdownService() {
    this.search = function(searchString, items) {
        items = items || [];
        if (!items.length) return items;
        return items.filter(function(item) {
            return item.name.toLowerCase().indexOf(searchString.toLowerCase()) != -1;
        });
    };
}

function VkCollection(parent, mode) {
    VkChildElement.call(this, parent);
    this.mode = mode;
    this.items = [];

    this.setItems = function(items) {
        this.items = items || [];
    };

    this.render = function() {
        this.clearElement();
        this.items.forEach(
            function(item) {
                var itemElement = new VkCollectionItem(this.element, item);
                itemElement.appendDom(item);
            }.bind(this)
        );
    };

    this.createElement = function() {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-dropdown-collection");
        this.render();
    };
}

function getDropdownModes() {
    var modes = {};

    Object.defineProperty(modes, "SINGLE_SELECT", { value: 1, writable: false });
    Object.defineProperty(modes, "MULTI_SELECT", { value: 2, writable: false });

    return modes;
}

function getKeyCodes() {
    var codes = {};

    Object.defineProperty(codes, "ARROW_LEFT", { value: 37, writable: false });
    Object.defineProperty(codes, "ARROW_UP", { value: 38, writable: false });
    Object.defineProperty(codes, "ARROW_RIGHT", { value: 39, writable: false });
    Object.defineProperty(codes, "ARROW_DOWN", { value: 40, writable: false });
    Object.defineProperty(codes, "SHIFT", { value: 16, writable: false });
    Object.defineProperty(codes, "ALT", { value: 17, writable: false });

    return codes;
}

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

function VkBaseElement() {
    this.helper = new VkElementHelper();
}

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

function VkElementHelper() {
    this.debounce = function(callback, duration, context) {
        var debounceTimeout;
        return function() {
            args = arguments;
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(function() {
                debounceTimeout = null;
                callback.apply(context, args);
            }, duration || 500);
        };
    };
}

function getUsers() {
    return [
        {
            imgUrl: "https://pp.userapi.com/c841339/v841339466/51b24/unRuQrPG6kA.jpg?ava=1v",
            name: "Илья Суховей",
            university: "БГТУ (Военмех)"
        },
        {
            imgUrl: "https://pp.userapi.com/c846021/v846021248/79dc8/VdouMjPTBy0.jpg?ava=1",
            name: "Альбина Деханова",
            university: ""
        },
        {
            imgUrl: "https://pp.userapi.com/c841338/v841338120/3b14c/kjybYosMc_0.jpg?ava=1",
            name: "Василий Котов",
            university: ""
        }
    ];
}

function VkCollectionItem(parent, item) {
    VkChildElement.call(this, parent);
    this.item = item;

    this.createElement = function(model) {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-dropdown-collection__item");

        var imageElement = document.createElement("DIV");
        imageElement.style.backgroundImage = "url(" + item.imgUrl + ")";
        imageElement.classList.add("vk-dropdown-collection__item__image");

        var infoContainer = document.createElement("DIV");
        infoContainer.classList.add("vk-dropdown-collection__item__info");

        var nameElement = document.createElement("SPAN");
        nameElement.innerHTML = model.name;
        infoContainer.appendChild(nameElement);

        var universityElement = document.createElement("SPAN");
        universityElement.innerHTML = model.university;
        infoContainer.appendChild(universityElement);

        this.element.appendChild(imageElement);
        this.element.appendChild(infoContainer);
    };
}

// new VkDropdown(document.getElementById("dropdown1"));
new VkDropdown({ element: document.getElementById("dropdown2"), placeholder: "Введите имя" });

})();