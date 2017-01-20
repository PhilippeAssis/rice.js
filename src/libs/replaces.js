String.prototype.replaceRecursive = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;

    if (Array.isArray(search)) {
        for (var key in search) {
            target = target.replaceRecursive(search[key], replacement);
        }

        return target;
    }
    else if (typeof search == 'object') {
        for (var key in search) {
            target = target.replaceRecursive(key, search[key]);
        }

        return target;
    }
    else {
        return target.replaceRecursive(key, search[key]);
    }
};

String.prototype.replaceVar = function(search, replacement, suffix) {
    var target = this;

    if (!suffix) {
        suffix = "%";
    }

    if (Array.isArray(search)) {
        for (var key in search) {
            target = target.replaceAll(suffix + search[key] + suffix, replacement);
        }

        return target;
    }
    else if (typeof search == 'object') {
        for (var key in search) {
            target = target.replaceAll(suffix + key + suffix, search[key]);
        }

        return target;
    }
    else {
        return target.replaceAll(suffix + key + suffix, search[key]);
    }
}
