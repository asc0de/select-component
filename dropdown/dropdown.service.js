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
