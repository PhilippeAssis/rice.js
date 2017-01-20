if (typeof Vue != "undefined") {
    Rice.prototype.vue = function(name, options) {
        if (options) {
            var vue = new Vue(options)
            this.global('Vue_' + name, vue);
        }
        else {
            return this.global('Vue_' + name);
        }
    }
}
