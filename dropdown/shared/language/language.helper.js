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
