// "test.coisa.toda",10

/**
 * Localiza/criar chaves em um objeto, lendo uma rota (em string) separada por pontos.
 * Ler: ({"test": {"ok": "no"}}).mapping("test.ok") // no
 * Escreve: ({"test": {"ok": "yes"}}).mapping("test.ok", false) // yes
 */
Object.prototype.mapping = function(item, value) {
    if (typeof item == "string") {
        var item = item.split(".")
        var _this = this;

        if (!value) {
            for (let i = 0; i < item.length; i++) {
                _this = _this[item[i]]
            }
        }
        else {
            item.reverse();
            var result = {
                [item[0]] : value
            };

            for (let i = 1; i < (item.length - 1); i++) {
                result = {
                    [item[i]] : result
                }
            }
            
            _this[item[(item.length - 1)]] = result;
        }
        
        return _this;
    }

    return this;
}