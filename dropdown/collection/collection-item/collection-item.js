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
