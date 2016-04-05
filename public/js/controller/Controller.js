/**
 * Created by Grigor on 11/24/15.
 */
/**
 * Created by Grigor on 11/24/15.
 */



(function(){
    angular
        .module('controllers',[])
        .controller('AboutController', [
            '$mdSidenav', '$mdBottomSheet', '$log', '$q','$scope','$rootScope','userService','$timeout','$mdDialog',
            AboutController
        ])
        .controller('DashboardController', [
            '$mdSidenav', '$mdBottomSheet', '$log', '$q','$scope','$rootScope','userService','$mdDialog','$timeout',
            DashboardController
        ])
        .controller('HeaderController', [
             '$mdSidenav', '$mdBottomSheet', '$log', '$q','$scope','$rootScope','$location',
            HeaderController
        ]);

    function HeaderController( $mdSidenav, $mdBottomSheet, $log, $q,$scope,$rootScope,$location){
        $scope.toggleHash =  function(hash) {
            $location.path(hash);
        };
        $rootScope.isActive = function (hash) {
            return hash == $location.path()
        };
    }
    function AboutController(  $mdSidenav, $mdBottomSheet, $log, $q,$scope,$rootScope,$userService,$timeout,$mdDialog) {
        $rootScope.title = "Active customer";

        var millisToMinutes = function (millis) {
            var minutes = Math.floor(millis / 60000);
            var hour = minutes/60;
            return minutes
        };

        $scope.selected = [];

        $scope.options = {
            rowSelection: false,
            multiSelect: false,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: false,
            pageSelect: false
        };


        $scope.query = {
            order: 'hash',
            limit: 50,
            page: 1
        };

        $scope.logItem = function (item) {
            console.log(item.name, 'was selected');
        };

        $scope.logOrder = function (order) {
            console.log('order: ', order);
        };

        $scope.logPagination = function (page, limit) {
            console.log('page: ', page);
            console.log('limit: ', limit);
        };

        var updateCurrentList = function () {
            $userService.getNotFinishedCustomers().then(function (result) {
                result=result.map(function (item) {
                    var start = new Date(item.started_at);
                    var now = new Date();
                    var realPrice = (millisToMinutes( now - start)*10);
                    item['price'] = realPrice < 300 ? 300 : parseInt( realPrice);
                    item.started_at = item.started_at.replace(/GMT(.*)/g,"");
                    return item;
                });
                $scope.desserts= {
                    count : result.length,
                    data  : result
                };
            });
        };
        updateCurrentList();
        setInterval(updateCurrentList,5000);
        $scope.addUser= function (ev) {
            if(!$scope.hash || $scope.hash.trim() == ''){
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('body')))
                        .clickOutsideToClose(true)
                        .title('Validation Error')
                        .textContent('Pleade specifiy hash for adding new customer')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Got it!')
                        .targetEvent(ev)
                );
                return;
            }
            $userService.addActiveCustomer($scope.hash).then(function (re) {
                $scope.hash = '';
                updateCurrentList();
            })
        };
        $scope.removeActiveUser= function (h) {
            var hash =h;
            $userService.getCustomerByHash(hash).then(function (customer) {
                var start = new Date(customer.started_at);
                customer.finished_at = new Date();
                var realPrice = (millisToMinutes( customer.finished_at - start)*10);
                customer.price  = realPrice < 300 ? 300 : realPrice.toFixed(2);
                $userService.removeActiveCustomer(customer).then(function (res) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Active user has been removed')
                            .textContent('Price is '+customer.price + 'AMD')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Got it!')
                    );
                    updateCurrentList();
                })
            })
        };
        $scope.getNotFinishedList= function () {
            $userService.getNotFinishedCustomers().then(function (result) {
                console.log(result);
            })
        }



    }
    function DashboardController(  $mdSidenav, $mdBottomSheet, $log, $q,$scope,$rootScope,$userService,$mdDialog,$timeout) {

        var millisToMinutes = function (millis) {
            var minutes = Math.floor(millis / 60000);
            var hour = minutes/60;
            return minutes
        };
        $rootScope.title = "Customers history";
        $scope.selected = [];

        $scope.options = {
            rowSelection: false,
            multiSelect: false,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: false,
            pageSelect: false
        };


        $scope.query = {
            order: 'hash',
            limit: 50,
            page: 1
        };

        $scope.logItem = function (item) {
            console.log(item.name, 'was selected');
        };

        $scope.logOrder = function (order) {
            console.log('order: ', order);
        };

        $scope.logPagination = function (page, limit) {
            console.log('page: ', page);
            console.log('limit: ', limit);
        };


        var updateCurrentList = function () {
            $userService.getFinishedCustomers().then(function (result) {
                var totalPrice = 0;
                result=result.map(function (item) {
                    totalPrice=+item.price;
                    item['started_at'] = item.started_at.replace(/GMT(.*)/g,"");
                    item['finished_at'] = item.finished_at.replace(/GMT(.*)/g,"");
                    return item;
                });
                $scope.totalPrice = totalPrice;
                $scope.desserts= {
                    count : result.length,
                    data  : result
                };
            });
        };
        updateCurrentList();

        $scope.clearHistory = function () {
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete your customer history?')
                .ok('Please do it!')
                .cancel('I changed my mind');
            $mdDialog.show(confirm).then(function() {
                $userService.clearCustomersHistory().then(function (res) {
                    updateCurrentList();
                }).catch(function (e) {
                    console.error(e)
                });
            }, function() {
            });
        };

    }

})();

