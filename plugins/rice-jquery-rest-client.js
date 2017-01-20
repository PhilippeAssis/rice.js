 if ($.RestClient) {
  
     Rice.add("RestPreload", function(datas, callback, index) {
            var index = index || 0,
                item = datas[index]

            if (!Rice.global('finishLoadItens')) {
                Rice.global('finishLoadItens', [])
            }

            var finishLoadItens = Rice.global('finishLoadItens')

            if (item) {
                var limitTime = setTimeout(function() {
                    Rice.preloader(datas, callback, ++index);
                }, Rice.getConfig("preloader.limitTime"))

                Rice.rest()[item.controller].read(item.action).data(item.data).then(function(result) {
                    clearTimeout(limitTime)

                    if (result) {
                        Rice.global(item.global, result);
                        finishLoadItens.push(item)
                        Rice.global('finishLoadItens', finishLoadItens)
                        if (item.callback) {
                            item.callback(result)
                        }
                    }

                    Rice.preloader(datas, callback, ++index);
                })
            }
            else if (callback) {
                callback(Rice.global('finishLoadItens'))
            }
        })
     
     

     Rice.addContructor(function() {
         var rest = new $.RestClient(Rice.getConfig("rest.host"), Rice.getConfig("rest.options") || {})
         
         if (Rice.getConfig("rest.config")) {
             for (var key in Rice.getConfig("rest.config")) {
                 rest.add(key, Rice.getConfig("rest.config")[key])
             }
         }
         
         this.add('rest', rest);
     })
 }
 