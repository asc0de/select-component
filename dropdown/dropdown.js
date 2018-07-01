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

    this.onSelect = function(item) {
        this.selectedItems.push(item);
        this.input.setSelectedItems(this.selectedItems);
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

        this.input.setSelectedItems(this.selectedItems);
        this.input.tagsCollection.render();
    };

    //elements
    this.input = new VkInput(this.element, {
        placeholder: options.placeholder,
        selectedItems: this.selectedItems,
        onRemove: this.onRemove.bind(this)
    });
    this.collection = new VkCollection(this.element, {
        mode: this.mode,
        avatarEnabled: this.avatarEnabled,
        onSelect: this.onSelect.bind(this)
    });

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
        if (this.searchEnabled) {
            this.input.addEvent("keyup", debouncedInputKeyUp, 300, this);
        } else {
            this.input.disable();
        }
        this.input.addEvent("click", onInputFocus.bind(this));
        this.input.addEvent("blur", onInputBlur.bind(this), true);
    };

    this.appendDom();
}
