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
    this.searchEnabled = options.search || false;
    this.avatarEnabled = options.avatar || false;
    this.dataProp = options.dataProp || "id";
    this.labelProp = options.labelProp || "name";
    this.service = new VkDropdownService();
    this.selectedItems = [];
    this.items = getUsers();

    this.getValue = function() {
        if (this.mode === DropdownMode.SINGLE_SELECT) {
            return this.items[0];
        }
        if (this.mode === DropdownMode.MULTI_SELECT) {
            return this.items;
        }
    };

    this.onSelect = function(id) {
        var filteredItems = this.items.filter(
            function(item) {
                return item[this.dataProp] === id;
            }.bind(this)
        );
        if (!filteredItems || !filteredItems.length) return;
        var item = filteredItems[0];
        this.selectedItems.push(item);
        if (this.mode === DropdownMode.SINGLE_SELECT) {
            this.detachEvents();
        } else {
            var selectedItemIds = this.selectedItems.map(
                function(selItem) {
                    return selItem[this.dataProp];
                }.bind(this)
            );
            this.items = this.items.reduce(
                function(newItems, currentItem) {
                    if (selectedItemIds.indexOf(currentItem[this.dataProp]) == -1) {
                        newItems.push(currentItem);
                    }
                    return newItems;
                }.bind(this),
                []
            );
            this.collection.setItems(this.items);
            this.collection.render();
        }
        this.input.setSelectedItems(this.selectedItems);
        this.input.inputElement.value = "";
    };

    this.onRemove = function(id) {
        this.selectedItems.splice(
            this.selectedItems
                .map(
                    function(item) {
                        return item[this.dataProp];
                    }.bind(this)
                )
                .indexOf(id),
            1
        );

        if (this.selectedItems.length === 0 && this.mode === DropdownMode.SINGLE_SELECT) {
            this.attachEvents();
        }
        this.input.setSelectedItems(this.selectedItems);
        this.input.tagsCollection.render();
    };

    //elements
    this.input = new VkInput(this.element, {
        placeholder: options.placeholder,
        selectedItems: this.selectedItems,
        onRemove: this.onRemove.bind(this),
        mode: this.mode
    });

    this.collection = new VkCollection(this.element, {
        mode: this.mode,
        avatarEnabled: this.avatarEnabled,
        onSelect: this.onSelect.bind(this),
        getWidth: this.input.getWidth.bind(this.input)
    });

    var onInputClick = function(e) {
        this.collection.setItems(this.items);
        this.collection.appendDom();
    };

    var onInputBlur = function(e) {
        this.collection.detachFromDom();
        this.input.inputElement.value = "";
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

    this.attachEvents = function() {
        this.input.addEvent("blur", onInputBlur.bind(this), true);
        this.input.addEvent("click", onInputClick.bind(this), true);
    };

    this.detachEvents = function() {
        this.input.removeEvent("blur");
        this.input.removeEvent("click");
    };

    this.appendDom = function() {
        this.element.innerHTML = "";
        this.element.classList.add("vk-dropdown");
        this.input.appendDom();
        var debouncedInputKeyUp = this.helper.debounce(onInputKeyUp.bind(this));
        if (this.searchEnabled) {
            this.input.addEvent("keyup", debouncedInputKeyUp, 300, this);
        } else {
            this.input.disable();
        }
        this.attachEvents();
    };

    this.appendDom();
}

function VkDropdownService() {
    BaseService.call(this);
    var LanguageType = getLanguageTypes();
    this.languageHelper = new LanguageHelper();

    this.fetchUsers = function(searchString, onFetch) {
        this.get("users?search=" + searchString, onFetch);
    };

    this.search = function(searchString, items, onFetch) {
        items = items || [];
        if (!items.length) return items;

        return items.filter(
            function(item) {
                var name = item.name.toLowerCase();
                var enToRuKeyboard = this.languageHelper.transform("en", "ru", LanguageType.KEYBOARD, searchString);
                var ruToEnKeyboard = this.languageHelper.transform("ru", "en", LanguageType.KEYBOARD, searchString);
                var enToRuPronounce = this.languageHelper.transform("en", "ru", LanguageType.PRONOUNCE, searchString);
                var ruToEnPronounce = this.languageHelper.transform("ru", "en", LanguageType.PRONOUNCE, searchString);
                return (
                    name.indexOf(enToRuKeyboard) != -1 ||
                    name.indexOf(ruToEnKeyboard) != -1 ||
                    name.indexOf(enToRuPronounce) != -1 ||
                    name.indexOf(ruToEnPronounce) != -1 ||
                    name.indexOf(searchString.toLowerCase()) != -1
                );
            }.bind(this)
        );
    };
}

function VkCollection(parent, options) {
    VkChildElement.call(this, parent);
    this.mode = options.mode || DropdownMode.SINGLE_SELECT;
    this.avatarEnabled = options.avatarEnabled || false;
    this.dataProp = options.dataProp || "id";
    this.onSelect = options.onSelect;
    this.items = [];

    this.setItems = function(items) {
        this.items = items || [];
    };
    this.onSelect = function(id) {
        options.onSelect(id);
        this.hide();
    };

    this.render = function() {
        this.clearElement();
        this.items.forEach(
            function(item) {
                var itemElement = new VkCollectionItem(this.element, item, {
                    avatarEnabled: this.avatarEnabled,
                    onSelect: this.onSelect.bind(this)
                });
                itemElement.appendDom(item);
            }.bind(this)
        );
    };

    this.createElement = function() {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-dropdown-collection");
        if (options.getWidth) this.element.style.width = (options.getWidth() || 200) + "px";
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

function getSettings() {
    var settings = {};

    Object.defineProperty(settings, "serverUrl", { value: "http://localhost:8000/api/", writable: false });

    return settings;
}

function VkInput(parent, options) {
    VkChildElement.call(this, parent);
    var DropdownMode = getDropdownModes();
    this.placeholder = options.placeholder || "";
    this.selectedItems = options.selectedItems || [];
    this.mode = options.mode || DropdownMode.SINGLE_SELECT;

    this.setSelectedItems = function(items) {
        this.tagsCollection.setSelectedItems(items);
        if (items.length === 1 && this.mode === DropdownMode.SINGLE_SELECT) {
            this.handleSelectedSingleMode();
        }
        if (items.length === 0 && this.mode === DropdownMode.SINGLE_SELECT) {
            this.handleUnselectedSingleMode();
        }
        this.tagsCollection.render();
    };

    this.createElement = function() {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-dropdown__input");
        this.tagsCollection = new VkTagsCollection(this.element, this.selectedItems, {
            labelProp: options.labelProp,
            dataProp: options.dataProp,
            onRemove: options.onRemove
        });
        this.tagsCollection.appendDom();
        var input = document.createElement("INPUT");
        if (this.placeholder) input.placeholder = this.placeholder;
        this.inputElement = input;
        this.element.appendChild(this.inputElement);
    };

    this.handleSelectedSingleMode = function() {
        this.inputElement.placeholder = "";
        this.element.classList.add("vk-dropdown__input--selected");
    };

    this.handleUnselectedSingleMode = function() {
        this.inputElement.placeholder = this.placeholder;
        this.element.classList.remove("vk-dropdown__input--selected");
    };

    this.getWidth = function() {
        return this.element.offsetWidth - 2;
    };

    this.disable = function() {
        this.element.childNodes[1].setAttribute("disabled", "disabled");
    };

    this.enable = function() {
        this.element.childNodes[1].removeAttribute("disabled");
    };
}

function VkBaseElement() {
    this.helper = new VkElementHelper();
}

function BaseService() {
    var settings = getSettings();
    var proceedRequest = function(url, type, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(type, settings.serverUrl + url, true);
        xhr.onreadystatechange = function() {
            callback(JSON.parse(xhr.responseText));
        };
        xhr.send();
    };

    this.get = function(url, callback) {
        proceedRequest(url, "GET", callback);
    };
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
        this.events.push({ name: eventName, callback: callback, useCapture: useCapture });
    };
    this.removeEvent = function(eventName) {
        checkElement.call(this);
        var currentEvent = this.events.filter(function(currentEvent) {
            return eventName === currentEvent.name;
        })[0];
        this.events.splice(
            this.events
                .map(function(currentEvent) {
                    return currentEvent.name;
                })
                .indexOf(eventName),
            1
        );
        this.element.removeEventListener(currentEvent.name, currentEvent.callback, currentEvent.useCapture);
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
            id: 1,
            imgUrl: "https://pp.userapi.com/c841339/v841339466/51b24/unRuQrPG6kA.jpg?ava=1v",
            name: "Илья Суховей",
            university: "БГТУ (Военмех)"
        },
        {
            id: 2,
            imgUrl: "https://pp.userapi.com/c846021/v846021248/79dc8/VdouMjPTBy0.jpg?ava=1",
            name: "Альбина Деханова",
            university: ""
        },
        {
            id: 3,
            imgUrl: "https://pp.userapi.com/c841338/v841338120/3b14c/kjybYosMc_0.jpg?ava=1",
            name: "Василий Котов",
            university: ""
        },
        {
            id: 4,
            imgUrl: "https://pp.userapi.com/c624626/v624626708/3fdbe/z1YhrwafU64.jpg?ava=1",
            name: "Марина Полякова",
            university: "СПбГХФА"
        },
        {
            id: 5,
            imgUrl: "https://pp.userapi.com/c629320/v629320419/3349a/V3t3mqmJMiE.jpg?ava=1",
            name: "Максим Левшин",
            university: ""
        }
    ];
}

function VkCollectionItem(parent, item, options) {
    VkChildElement.call(this, parent);
    this.item = item;
    this.avatarEnabled = options.avatarEnabled || false;
    this.dataProp = options.dataProp || "id";

    this.onSelectItem = function(e) {
        e.stopPropagation();
        options.onSelect(parseInt(this.element.getAttribute("data-value"), 10));
    };

    this.createElement = function(model) {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-dropdown-collection__item");
        this.element.setAttribute("data-value", this.item[this.dataProp]);

        if (this.avatarEnabled) {
            var imageElement = document.createElement("DIV");
            imageElement.style.backgroundImage = "url(" + item.imgUrl + ")";
            imageElement.classList.add("vk-dropdown-collection__item__image");
            this.element.appendChild(imageElement);
        }

        var infoContainer = document.createElement("DIV");
        infoContainer.classList.add("vk-dropdown-collection__item__info");

        var nameElement = document.createElement("SPAN");
        nameElement.innerHTML = model.name;
        infoContainer.appendChild(nameElement);

        var universityElement = document.createElement("SPAN");
        universityElement.innerHTML = model.university;
        infoContainer.appendChild(universityElement);

        this.element.appendChild(infoContainer);

        this.addEvent("mousedown", this.onSelectItem.bind(this));
    };
}

function VkTagsCollection(parent, items, options) {
    VkChildElement.call(this, parent);
    this.items = items;
    this.dataProp = options.dataProp || "id";
    this.labelProp = options.labelProp || "name";

    this.setSelectedItems = function(items) {
        this.items = items;
    };

    this.render = function() {
        this.clearElement();
        this.items.forEach(
            function(item) {
                var itemElement = new VkTag(this.element, item, {
                    labelProp: this.labelProp,
                    dataProp: this.dataProp,
                    onRemove: options.onRemove
                });
                itemElement.appendDom(item);
            }.bind(this)
        );
    };

    this.createElement = function() {
        this.element = document.createElement("DIV");
        this.element.classList.add("vk-tags-collection");
    };
}

function getLanguageTypes() {
    var types = {};

    Object.defineProperty(types, "KEYBOARD", { value: 1, writable: false });
    Object.defineProperty(types, "PRONOUNCE", { value: 2, writable: false });

    return types;
}

function getEngToRusPronounce() {
    return {
        a: "а",
        b: "б",
        c: "с",
        d: "д",
        e: "е",
        f: "ф",
        g: "г",
        h: "х",
        i: "и",
        j: "дж",
        k: "к",
        l: "л",
        m: "м",
        n: "н",
        o: "о",
        p: "п",
        q: "",
        r: "р",
        s: "с",
        t: "т",
        u: "у",
        v: "в",
        w: "в",
        x: "кс",
        y: "у",
        z: "з"
    };
}

function getEngToRusKeyboard() {
    return {
        q: "й",
        w: "ц",
        e: "у",
        r: "к",
        t: "е",
        y: "н",
        u: "г",
        i: "ш",
        o: "щ",
        p: "з",
        "[": "х",
        "]": "ъ",
        a: "ф",
        s: "ы",
        d: "в",
        f: "а",
        g: "п",
        h: "р",
        j: "о",
        k: "л",
        l: "д",
        ";": "ж",
        "'": "э",
        z: "я",
        x: "ч",
        c: "с",
        v: "м",
        b: "и",
        n: "т",
        m: "ь",
        ",": "б",
        ".": "ю",
        "`": "ё"
    };
}

function LanguageHelper() {
    var LanguageType = getLanguageTypes();

    this.transform = function(langFrom, langTo, type, str) {
        var currentDictionaryType = {};
        var result = "";
        if (type === LanguageType.KEYBOARD) currentDictionaryType = this.dictionary.keyboard;
        if (type === LanguageType.PRONOUNCE) currentDictionaryType = this.dictionary.pronounce;

        var tran = currentDictionaryType.filter(function(tran) {
            return tran.from === langFrom && tran.to === langTo;
        })[0];

        if (!tran) return result;

        for (var i = 0; i < str.length; i++) {
            var char = tran.dictionary[str.charAt(i)];
            if (!char) return null;
            result += char;
        }
        return result;
    };

    this.getReversedMapping = function(dictionary) {
        var reversedObject = {};
        for (var key in dictionary) {
            if (dictionary.hasOwnProperty(key)) {
                reversedObject[dictionary[key]] = key;
            }
        }
        return reversedObject;
    };

    this.dictionary = {
        keyboard: [
            { from: "en", to: "ru", dictionary: getEngToRusKeyboard() },
            { from: "ru", to: "en", dictionary: this.getReversedMapping(getEngToRusKeyboard()) }
        ],
        pronounce: [
            { from: "en", to: "ru", dictionary: getEngToRusPronounce() },
            { from: "ru", to: "en", dictionary: this.getReversedMapping(getEngToRusPronounce()) }
        ]
    };
}

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

var DropdownMode = getDropdownModes();
new VkDropdown(document.getElementById("dropdown1"));
new VkDropdown({ element: document.getElementById("dropdown2"), placeholder: "Выберите друга", avatar: true });
new VkDropdown({
    element: document.getElementById("dropdown3"),
    placeholder: "Выберите друзей",
    avatar: true,
    mode: DropdownMode.MULTI_SELECT
});
new VkDropdown({
    element: document.getElementById("dropdown4"),
    placeholder: "Введите имя",
    avatar: true,
    search: true,
    mode: DropdownMode.MULTI_SELECT
});

})();