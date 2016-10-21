var app = angular.module('petApp', []);
app.controller('petCtrl', function($scope, $http,$window) {
getPet();
getUser()

function getPet(){
    $http.get('/pet')
    .then(function(res){          
        if(res.data.success)  $scope.pets=$scope.petsList=res.data.pet;
        else console.log(res);});
    }

function getUser(){
    $http.get('/users')
    .then(function(res){
        console.log(res)          
        if(res.data.success) {
            $scope.user=res.data.usr;
            if(res.data.usr.pet.length>0){
                $scope.pets=res.data.usr.pet;
                 $scope.pets=$scope.pets.map(function(p,i){                     
                    p.name=$scope.petsList[i]['name'];
                    return p;
                })
            }
        } 
        else console.log(res);});
}

$scope.buy = function () {
    var buy = $scope.petsList;
    buy = buy.map(function (i) {
        var obj = { id: i['_id'], item: i['item'] || 0 };
        return obj;
    })

    if (buy.filter(function (i) { return i['item'] > 0 }).length > 0) {
        $http.post('/buy',buy)
            .then(function (res) {
                console.log(res);
                if(!res.data.err){
                   $window.location.href ='/pet-selection';
                }
            }
        );
    }
    }
});