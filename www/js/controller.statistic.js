'use strict';
angular.module('statistic.controllers', ['ui.bootstrap'])
    .controller('SalesStatistic', ['$scope', '$http', '$location', 'showAlert', 'renderSelect', '$filter', 'productService', '$timeout',
        function ($scope, $http) {

            $scope.init = function () {
                var initDate = new Date();
               $scope.totalCost = 0;
                $scope.loadUrl = config.base + '/StatisticController/Sales';
                var params = '';
                if($("input[name=from]").val()) {
                    params = '?from=' + $("input[name=from]").val();
                    if($("input[name=to]").val()) {
                        params += '&to=' + $("input[name=to]").val();
                    }
                }
                $http.get($scope.loadUrl + params)
                    .success(function(data){
                        $scope.statisticData = data.statisticData;
                        $scope.maxLength = data.maxLength;
                        $scope.totalAmount = data.totalAmount;
                        $scope.totalProfit = data.totalProfit;
                        $scope.totalDebit = data.totalDebit;
                        $scope.totalCash = data.totalCash;
                        $scope.from_date = data.from;
                        $scope.to_date = data.to;
                        $scope.totalDiscount = data.totalDiscount;
                        $scope.totalPromotionProductValue = callTotalPromotionValue();
                });
            };

            $scope.init();
            $scope.openFrom = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.fromOpened = true;
            };
            $scope.openTo = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.toOpened = true;
            };
            $scope.getFromDate = function() {
                return $("input[name=from]").val();
            };
            $scope.getToDate = function() {
                return $("input[name=to]").val();
            }
            function callTotalPromotionValue(){
                var amount = 0;
                $.each($scope.statisticData, function(index, value) {
                    $scope.totalCost += value.cost * 1;
                    if(value.promotion) {
                        amount += value.promotionCost / value.promotion.rate * value.promotion.quantity;
                    }
                });
                return Math.round(amount);
            }
        }])
    .controller('BillList', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
        $scope.init = function () {
            var params = '?product=' + $stateParams.product;
            params += '&price=' + $stateParams.price;
            params += '&from=' + $stateParams.from;
            params += '&to=' + $stateParams.to;
            $http({
                method: 'GET',
                url: config.base + '/StatisticController/getBillList'+params,
                reponseType: 'json'
            }).success(function (data, status) {
                $scope.bill = data.bill;
            }).error(function (data, status) {
                console.log(data);
            });
        };
        $scope.init();
    }])
    .controller('saleCommission', ['$scope', '$http', function( $scope, $http){
        $scope.init = function () {
            $scope.salesCommissions = [];
            $scope.salers = [];
            $scope.listProductType = [];
            $scope.chietKhauSi = 500;
            $scope.chietKhauLe = 1000;

            $http.get(config.base + '/StatisticController/getSaleCommissionMetaData')
                .success(function(data){
                    $scope.salers = data.salers;
                    $scope.listProductType = data.productType;
                    setTimeout(function (){
                        $(".selectpicker[name=category]").selectpicker({
                            selectedTextFormat: 'count',
                            countSelectedText: "{0}/{1} ngành hàng"
                        }).selectpicker('selectAll');
                    })
                });
        };

        $scope.loadData = function () {
            var params = '';
            if($("input[name=from]").val()) {
                params = '?from=' + $("input[name=from]").val();
                if($("input[name=to]").val()) {
                    params += '&to=' + $("input[name=to]").val();
                }
            }
            $http.get(config.base + '/StatisticController/getSalesCommissions' + params)
                .success(function(data){
                    $scope.salesCommissions = data;
                });
        };

        $scope.init();

        $scope.openFrom = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.fromOpened = true;
        };
        $scope.openTo = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.toOpened = true;
        };

        $scope.getFromDate = function() {
            return $("input[name=from]").val();
        };

        $scope.getToDate = function() {
            return $("input[name=to]").val();
        }

        $scope.calcTotalRevenue = function (id) {
            var total = 0;
            $.each($scope.salesCommissions, function ( index, product ){
                if ($scope.filterCategory(product) && product.commissions && product.commissions[id]) {
                    total += parseFloat(product.commissions[id].amount);
                }
            });

            return total;
        }

        $scope.calcTotalSaleCommission = function (id) {
            var total = 0;
            $.each($scope.salesCommissions, function ( index, product ){
                if ($scope.filterCategory(product) && product.commissions && product.commissions[id]) {
                    total += product.commissions[id].wholesale * $scope.chietKhauSi;
                    total += product.commissions[id].retail * $scope.chietKhauLe;
                }
            });

            return total;
        }

        $scope.filterCategory = function (item) {
            return ($scope.category.length == 0 || $scope.category.includes(item.product_type)) && ($scope.includeEmptyRow || item.commissions);
        }
    }])
    .controller('clientCommission', ['$scope', '$http', function( $scope, $http){
        $scope.init = function () {
            $scope.clientsCommissions = [];
            $scope.salers = [];
            $scope.listProductType = [];
            $scope.chietKhauSi = 500;
            $scope.chietKhauLe = 1000;
            $http.get(config.base + '/StatisticController/getSaleCommissionMetaData')
                .success(function(data){
                    $scope.listProductType = data.productType;
                });
        };

        $scope.openFrom = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.fromOpened = true;
        };
        $scope.openTo = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.toOpened = true;
        };

        $scope.getFromDate = function() {
            return $("input[name=from]").val();
        };

        $scope.getToDate = function() {
            return $("input[name=to]").val();
        }
        $scope.numberWithCommas = function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        $scope.loadData = function () {
            var params = '';
            if($("input[name=from]").val()) {
                params = '?from=' + $("input[name=from]").val();
                if($("input[name=to]").val()) {
                    params += '&to=' + $("input[name=to]").val();
                }
            }
            params += `&id_type_product=${$scope.category}`;
            var from_check = $("input[name=from]").val();
            var to_check = $("input[name=to]").val();
            console.log({from_check, to_check});
            console.log('type: ', $scope.category)
            if(!from_check || !to_check){
                alert('Vui lòng chọn ngày');
                return;
            }
            if($scope.category == undefined){
                alert('Vui lòng chọn loại sản phẩm');
                return;
            }
            $http.get(config.base + '/StatisticController/getClientsCommissions' + params)
                .success(function(data){
                    if(data.list_bill.length == 0){
                        $scope.clientsCommissions = [];
                        alert('Không tồn tại');
                        return;
                    }
                    $scope.clientsCommissions = data.list_bill;
                    $scope.to_date = data.to_date,
                    $scope.from_date = data.from_date,
                    $scope.id_type = data.id_type
                });
        };

        $scope.detailBill = function ($event) {
            let customer_id = $($event.currentTarget).attr('id');
            const data = {
                customer_id: customer_id,
                to_date: $scope.to_date,
                from_date: $scope.from_date,
                id_type: $scope.id_type
            }
            localStorage.setItem("input_get_list_bill", JSON.stringify(data));
        }

        $scope.init();

    }])
    .controller('listBillByCategory',  ['$scope', '$http', function ($scope, $http) {
        $scope.init = function () {
            //console.log('init8888: ');
            var inputGetBill = localStorage.getItem('input_get_list_bill');
            if(localStorage.getItem('input_get_list_bill') != null){
                $scope.data = JSON.parse(localStorage.getItem('input_get_list_bil'));
            }
            var params = JSON.parse(inputGetBill);
        
            
             $http.get(config.base + `/StatisticController/getListBillByTypeProduct?from=${params.from_date}&to=${params.to_date}&id_type_product=${params.id_type}&customer_id=${params.customer_id}`)
             .success(function(data){
                //  $scope.listProductType = data.productType;
                
                $scope.data = data.list_bill;
                if(data.list_bill.length > 0){
                    const result = [];
                    var lengthArr = data.list_bill.length;
                    for(let i = 0; i < lengthArr; i++){
                        data.list_bill[i].date_bill = $scope.formatDate(data.list_bill[i].date_bill);
                        result.push(data.list_bill[i].date_bill);
                    }
                    var map = {};
                    var count = result.map(function(val) {
                        return map[val] = (typeof map[val] === "undefined") ? 1 : map[val] + 1;
                    });

                    var newArray = result.map(function(val, index) {
                        return val + (map[val] != 1 ? ' (' + count[index] + ')' : '');
                    });
                    for(let i = 0; i < lengthArr; i++){
                        data.list_bill[i].date_string = newArray[i];
                    }
                    console.log(data.list_bill)
                    $scope.name = data.list_bill[0].name;
                    $scope.address = data.list_bill[0].address,
                    $scope.type_name = data.list_bill[0].name_type,
                    $scope.from_date = params.from_date.split(" ")[0];
                    $scope.to_date = params.to_date.split(" ")[0]
                }
             });
            
        };
        $scope.printDateValid = function(date, index, arr_bill){
            // //console.log('123123')
            // console.log({date, index, arr_bill})
            // let count = 0;
            // for(let i = 0; i < index; i++){
            //     console.log({date, dateInList: arr_bill[i].date_bill})
            //     if($scope.formatDate(arr_bill[i].date_bill) == date){
            //         console.log('date trung: ' .date);
            //         count++;
            //     }
            //    // console.log($scope.formatDate(arr_bill[i].date_bill))
            // }
            // //return 1;
            // if(count > 0){
            //     date += ` (${count + 1})`
            // }
           
            // return date;
            
        }
        $scope.numberWithCommas = function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
       
        $scope.formatDate = function(x){
            const today = new Date(x);
            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1; // Months start at 0!
            let dd = today.getDate();

            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            const formattedToday = dd + '/' + mm + '/' + yyyy;
            return formattedToday;
        }
        $scope.detailBillByDate = function($event){
            let date_search = $($event.currentTarget).attr('id');
            var inputGetBill = localStorage.getItem('input_get_list_bill');
            // if(localStorage.getItem('input_get_list_bill') != null){
            //     $scope.data = JSON.parse(localStorage.getItem('input_get_list_bil'));
            // }
            var params = JSON.parse(inputGetBill);
            params.date_search = date_search;
            console.log('params: ', params);
            localStorage.setItem("input_get_list_bill", JSON.stringify(params));
        }
        // $scope.openFrom = function ($event) {
        //     $event.preventDefault();
        //     $event.stopPropagation();
        //     $scope.fromOpened = true;
        // };
        // $scope.openTo = function ($event) {
        //     $event.preventDefault();
        //     $event.stopPropagation();
        //     $scope.toOpened = true;
        // };

        // $scope.getFromDate = function() {
        //     return $("input[name=from]").val();
        // };

        // $scope.getToDate = function() {
        //     return $("input[name=to]").val();
        // }
        // $scope.numberWithCommas = function(x) {
        //     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // }
        // $scope.loadData = function () {
        //     var params = '';
        //     if($("input[name=from]").val()) {
        //         params = '?from=' + $("input[name=from]").val();
        //         if($("input[name=to]").val()) {
        //             params += '&to=' + $("input[name=to]").val();
        //         }
        //     }
        //     params += `&id_type_product=${$scope.category}`;
        //     console.log('params: ', params);
        //     console.log('type: ', $scope.category)
        //     $http.get(config.base + '/StatisticController/getClientsCommissions' + params)
        //         .success(function(data){
        //             console.log('data: ', data);
        //             $scope.clientsCommissions = data;
        //         });
        // };

        // $scope.detailBill = function ($event) {
        //     console.log('customer id: ', $($event.currentTarget).attr('id'));
        //     // if (!confirm('b?n ch?c ch??'))
        //     //     return false;
        //     // $http({
        //     //     method: 'GET',
        //     //     url: config.base + '/products/deleteProduct?id=' + $($event.currentTarget).attr('id'),
        //     //     responseType: 'json'
        //     // }).success(function (data, status) {
        //     //     $scope.init();
        //     // }).error(function (data, status) {
        //     //     console.log(data);
        //     // });
        // }

        $scope.init();

    }])
    .controller('detailBillByDate',  ['$scope', '$http', function ($scope, $http) {
        $scope.init = function () {
            //console.log('init8888: ');
            var inputGetBill = localStorage.getItem('input_get_list_bill');
            if(localStorage.getItem('input_get_list_bill') != null){
                $scope.data = JSON.parse(localStorage.getItem('input_get_list_bil'));
            }
            var params = JSON.parse(inputGetBill);
            console.log('detail bill')
            
             $http.get(config.base + `/StatisticController/getBillDetailByDate?from=${params.from_date}&to=${params.to_date}&id_type_product=${params.id_type}&customer_id=${params.customer_id}&date_search=${params.date_search}`)
             .success(function(data){
                $scope.list_bill = data.list_bill;
                console.log('detail bill1: ', data.list_bill);
                // $scope.data = data.list_bill;
                if(data.list_bill.length > 0){
                    $scope.name = data.list_bill[0].name;
                    $scope.address = data.list_bill[0].address;
                    let total = 0;
                    let list_bill_temp = data.list_bill;
                    let length_list = list_bill_temp.length;
                    for(let i = 0; i < length_list; i++){
                        console.log(list_bill_temp[i].total)
                        total += Number(list_bill_temp[i].total);
                    }
                    $scope.total_list = total;
                }
             });
            
        };
        
        $scope.numberWithCommas = function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        $scope.formatDate = function(x){
            const today = new Date(x);
            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1; // Months start at 0!
            let dd = today.getDate();

            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            const formattedToday = dd + '/' + mm + '/' + yyyy;
            return formattedToday;
        }
        // $scope.openFrom = function ($event) {
        //     $event.preventDefault();
        //     $event.stopPropagation();
        //     $scope.fromOpened = true;
        // };
        // $scope.openTo = function ($event) {
        //     $event.preventDefault();
        //     $event.stopPropagation();
        //     $scope.toOpened = true;
        // };

        // $scope.getFromDate = function() {
        //     return $("input[name=from]").val();
        // };

        // $scope.getToDate = function() {
        //     return $("input[name=to]").val();
        // }
        // $scope.numberWithCommas = function(x) {
        //     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // }
        // $scope.loadData = function () {
        //     var params = '';
        //     if($("input[name=from]").val()) {
        //         params = '?from=' + $("input[name=from]").val();
        //         if($("input[name=to]").val()) {
        //             params += '&to=' + $("input[name=to]").val();
        //         }
        //     }
        //     params += `&id_type_product=${$scope.category}`;
        //     console.log('params: ', params);
        //     console.log('type: ', $scope.category)
        //     $http.get(config.base + '/StatisticController/getClientsCommissions' + params)
        //         .success(function(data){
        //             console.log('data: ', data);
        //             $scope.clientsCommissions = data;
        //         });
        // };

        // $scope.detailBill = function ($event) {
        //     console.log('customer id: ', $($event.currentTarget).attr('id'));
        //     // if (!confirm('b?n ch?c ch??'))
        //     //     return false;
        //     // $http({
        //     //     method: 'GET',
        //     //     url: config.base + '/products/deleteProduct?id=' + $($event.currentTarget).attr('id'),
        //     //     responseType: 'json'
        //     // }).success(function (data, status) {
        //     //     $scope.init();
        //     // }).error(function (data, status) {
        //     //     console.log(data);
        //     // });
        // }

        $scope.init();

    }])
    .controller('SaleCommissionDetail', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
        $scope.init = function () {
            var params = '?product=' + $stateParams.product;
            params += '&from=' + $stateParams.from;
            params += '&saler=' + $stateParams.saler;
            params += '&to=' + $stateParams.to;
            params += '&type=' + $stateParams.type;
            $http({
                method: 'GET',
                url: config.base + '/StatisticController/getSaleCommissionDetail'+params,
                reponseType: 'json'
            }).success(function (data, status) {
                $scope.bill = data.bill;
            }).error(function (data, status) {
                console.log(data);
            });
        };
        $scope.init();
    }])
;