function VkDropdown(options) {
    VkBaseElement.call(this);
    var DropdownMode = getDropdownModes();
    var KeyCode = getKeyCodes();
    options = options || {};
    this.element = options.element;

    //properties
    this.mode = options.mode || DropdownMode.SINGLE_SELECT;
    this.filterEnabled = options.filter || false;
    this.searchEnabled = options.search || false;
    this.avatarEnabled = options.avatar || false;
    this.dataProp = options.dataProp || "id";
    this.labelProp = options.labelProp || "name";
    this.notFoundLabel = options.notFoundLabel || "Результатов не найдено";
    this.service = new VkDropdownService();
    this.selectedItems = [];
    this.initItems = options.items;
    this.items = options.items;

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
        item.collectionIndex = this.items.indexOf(item);
        this.selectedItems.push(item);
        this.filterItemsBySelected();
        if (this.mode === DropdownMode.SINGLE_SELECT) {
            this.detachEvents();
        } else {
            this.collection.render();
        }
        this.input.setSelectedItems(this.selectedItems);
        this.input.inputElement.value = "";
    };

    this.onRemove = function(id) {
        var removedItem = this.selectedItems.splice(
            this.selectedItems
                .map(
                    function(item) {
                        return item[this.dataProp];
                    }.bind(this)
                )
                .indexOf(id),
            1
        )[0];

        this.items.splice(removedItem.collectionIndex, 0, removedItem);
        this.collection.render();

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
        getWidth: this.input.getWidth.bind(this.input),
        notFoundLabel: this.notFoundLabel
    });

    var onInputClick = function(e) {
        if (this.filterEnabled) {
            this.items = this.initItems;
            this.filterItemsBySelected();
        }
        this.collection.appendDom();
        this.setCollectionItemsAndRender();
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
            case KeyCode.ALT: {
                break;
            }
            default: {
                this.items = this.initItems;
                if (this.filterEnabled) {
                    this.items = this.service.search(e.target.value, this.items);
                    this.filterItemsBySelected();
                    this.setCollectionItemsAndRender();
                }
                if (this.searchEnabled) {
                    this.service.fetchUsers(
                        e.target.value,
                        function(items) {
                            this.items = items;
                            this.setCollectionItemsAndRender();
                        }.bind(this)
                    );
                }

                break;
            }
        }
    };

    this.setCollectionItemsAndRender = function() {
        this.collection.setItems(this.items);
        this.collection.render();
    };

    this.filterItemsBySelected = function() {
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
    };

    this.attachEvents = function() {
        this.input.addEvent("blur", onInputBlur.bind(this), true);
        this.input.addEvent("click", onInputClick.bind(this), true);
        this.input.addEvent("focus", onInputClick.bind(this), true);
    };

    this.detachEvents = function() {
        this.input.removeEvent("blur");
        this.input.removeEvent("click");
        this.input.removeEvent("focus");
    };

    this.appendDom = function() {
        this.element.innerHTML = "";
        this.element.classList.add("vk-dropdown");
        this.input.appendDom();
        var debouncedInputKeyUp = this.helper.debounce(onInputKeyUp.bind(this));
        if (this.filterEnabled || this.searchEnabled) {
            this.input.addEvent("keyup", debouncedInputKeyUp, 300, this);
        } else {
            this.input.disable();
        }
        this.attachEvents();
    };

    this.appendDom();
}
