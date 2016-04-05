(function(){
    'use strict';

    angular.module('users',[])
         .service('userService', ['$q','$http', UserService])
         .service('pageService', PageService);

    /**
    * Users DataService
    * Uses embedded, hard-coded data model; acts asynchronously to simulate
    * remote data service call(s).
    *
    * @returns {{loadAll: Function}}
    * @constructor
    */
    function UserService($q,$http){
        var mydb = openDatabase("costumer", "0.1", "A Database of Customer", 2048 * 2048);
            mydb.transaction(function (t) {
              t.executeSql("CREATE TABLE IF NOT EXISTS customer ( hash TEXT, price TEXT,started_at TIMESTAMP default CURRENT_TIMESTAMP, finished_at TIMESTAMP)");
            });
            //mydb.transaction(function (t) {
            //  t.executeSql("DROP TABLE customer");
            //});
        return {
            clearCustomersHistory : function () {
                return $q(function (resolve, reject) {
                    try{
                        mydb.transaction(function (t) {
                            t.executeSql("DELETE FROM customer WHERE customer.finished_at IS NOT NULL",[], function (transaction, results) {
                                resolve(results)
                            });
                        });
                    }catch (e){
                        reject(e);
                    }
                })
            },
            getCustomers : function() {
                return $q(function (resolve, reject) {
                    try {
                        mydb.transaction(function (t) {
                            t.executeSql("SELECT * FROM customer", [], function (transaction, results) {
                                var list = [];
                                console.log(transaction);
                                console.log(results);
                                for (var i = 0; i < results.rows.length; i++) {
                                    // in case when need some mod...;
                                    list.push(results.rows.item(i));
                                }
                                resolve(list);
                            });
                        });
                    }catch (e){
                        reject(e);
                    }

                });
            },
            getNotFinishedCustomers : function() {
                //  var deferred = $q.defer();
                return $q(function (resolve, reject) {
                        mydb.transaction(function (t) {
                            t.executeSql("SELECT * FROM customer WHERE customer.finished_at IS NULL", [], function (transaction, results) {
                                var list = [];
                                for (var i = 0; i < results.rows.length; i++) {
                                    // in case when need some mod...;
                                    list.push(results.rows.item(i));
                                }
                                resolve(list);
                            });
                        });
                });
            },
            getFinishedCustomers : function() {
                //  var deferred = $q.defer();
                return $q(function (resolve, reject) {
                        mydb.transaction(function (t) {
                            t.executeSql("SELECT * FROM customer WHERE customer.finished_at IS NOT NULL", [], function (transaction, results) {
                                var list = [];
                                for (var i = 0; i < results.rows.length; i++) {
                                    // in case when need some mod...;
                                    list.push(results.rows.item(i));
                                }
                                resolve(list);
                            });
                        });
                });
            },
            getCustomerByHash : function(hash) {
                return $q(function (resolve, reject) {
                    try {
                        mydb.transaction(function (t) {
                            t.executeSql("SELECT * FROM customer WHERE customer.hash = (?)", [hash], function (transaction, results) {
                                var list = [];
                                console.log(results);
                                for (var i = 0; i < results.rows.length; i++) {
                                    list.push(results.rows.item(i));
                                }
                                if(list.length!=0){
                                    resolve(list[0]);
                                }else{
                                    reject('error');
                                }
                            });
                        });
                    }catch (e){
                        reject(e);
                    }

                });
            },

            addActiveCustomer : function (hash) {
                return $q(function (resolve, reject) {
                    try {
                        mydb.transaction(function (t) {
                            t.executeSql("INSERT INTO customer (hash,started_at) VALUES (?,?)", [hash,new Date()], function (transaction,result) {
                                resolve(result);
                            });
                        })
                    }catch (e){
                        reject(e);
                    }
                })
            },

            removeActiveCustomer : function (data) {
                return $q(function (resolve, reject) {
                    try{
                        mydb.transaction(function (t) {
                            t.executeSql("UPDATE customer SET finished_at=(?), price=(?) WHERE hash=(?)", [data.finished_at,data.price,data.hash], function (tr,res) {
                                resolve(res)
                            });
                        })
                    }catch(e){
                        reject(e);
                    }

                });

            }


        };
    }
    function PageService(){
        this.title = "default";
        //this.greet = null;
        //
        //this.greetTo = function(name) {
        //    this.greet = "Hello " + name;
        //}
        //this.getTitle = function() {
        //    return (this.title) ? this.title : "defaur";
        //};
        //this.setTitle = function(title) {
        //    return this.title = title;
        //};
    // Promise-based API
    return {
        getTitle : function() {
            return (this.title) ;
        },
        setTitle : function(title) {
            return this.title = title;
        }
    };
  }

})();
