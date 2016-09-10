'use strict';
(function () {
    angular.module('esencia').controller('adminCtrl', adminCtrl);
    adminCtrl.$inject = ['$http'];
    function adminCtrl($http) {
        var vm = this;
        vm.options = [];
        vm.add = addItem;
        vm.delete = deleteItem;
        vm.get = getItem;

        getAll().then(function (res) {
            vm.options = res.data.rows;
            console.log(res.data);
        }, function (err) {
            console.log(err);
        });

        function getItem(idx) {
            get(vm.options[idx].id).then(
                function (res) {
                    console.log(res);
                    vm.options[idx].answer = res.data.text;
                }, function (err) {

                });
        }

        function deleteItem(idx) {
            var toBeDeleted = vm.options[idx];
            // delete from db
            var rev = toBeDeleted.rev ? toBeDeleted.rev : toBeDeleted.value.rev;
            destroy(toBeDeleted.id, rev).then(
                function (res) {
                    console.log(res);
                    vm.options.splice(idx, 1);
                }, function (err) {
                    console.log(err);
                });
        }
        function addItem() {
            add(vm.newItem.id, vm.newItem.answer).then(
                function (res) {
                    console.log(res);
                    vm.newItem.rev = res.data.rev;
                    vm.options.push(vm.newItem);
                    vm.newItem = {};
                }, function (err) {
                    console.log(err);
                }
            );
        }

        function add(id, text) {
            return $http.post('/api/answers', {
                id: id,
                text: text
            });
        }
        function get(id) {
            return $http.get('/api/answers/' + id);
        }
        function getAll() {
            return $http.get('/api/answers');
        }
        function destroy(id, rev) {
            return $http.delete('/api/answers/' + id + '/' + rev);
        }

    }
})();
