function VkDropdownService() {
    this.search = function(searchString, items) {
        items = items || [];
        if (!items.length) return items;
        return items.filter(function(item) {
            return item.name.toLowerCase().indexOf(searchString.toLowerCase()) != -1;
        });
    };
}
