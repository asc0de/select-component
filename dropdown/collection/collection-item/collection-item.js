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
