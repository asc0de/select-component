function VkDropdownService() {
    BaseService.call(this);
    var LanguageType = getLanguageTypes();
    this.languageHelper = new LanguageHelper();

    this.fetchUsers = function(searchString, onFetch) {
        this.get("users?search=" + searchString, onFetch);
    };

    this.search = function(searchString, items, onFetch) {
        items = items || [];
        searchString = searchString.toLowerCase();
        if (!items.length) return items;

        return items.filter(
            function(item) {
                var name = item.name.toLowerCase();
                var conditionStrings = [];
                var ruToEnKeyboard = this.languageHelper.transform("ru", "en", LanguageType.KEYBOARD, searchString);
                var enToRuKeyboard = this.languageHelper.transform("en", "ru", LanguageType.KEYBOARD, searchString);
                var enToRuPronounce = this.languageHelper.transform("en", "ru", LanguageType.PRONOUNCE, searchString);
                var ruToEnPronounce = this.languageHelper.transform("ru", "en", LanguageType.PRONOUNCE, searchString);
                if (ruToEnKeyboard !== null) {
                    conditionStrings.push(ruToEnKeyboard);
                    conditionStrings.push(this.languageHelper.transform("en", "ru", LanguageType.PRONOUNCE, ruToEnKeyboard));
                }
                if (enToRuKeyboard !== null) conditionStrings.push(enToRuKeyboard);
                if (enToRuPronounce !== null) conditionStrings.push(enToRuPronounce);
                if (ruToEnPronounce !== null) conditionStrings.push(ruToEnPronounce);
                conditionStrings.push(searchString);

                return conditionStrings.reduce(function(result, conditionString) {
                    if (conditionString !== null) {
                        result = result || name.indexOf(conditionString) != -1;
                    }
                    return result;
                }, false);
            }.bind(this)
        );
    };
}
