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
