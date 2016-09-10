'use strict';
(function () {
    angular.module('esencia').controller('defaultCtrl', defaultCtrl);
    defaultCtrl.$inject = ['$http','$timeout'];
    function defaultCtrl($http, $timeout) {
        var vm = this;
        var defaultResponse='¡Hola! Soy Esencia, y estoy para responder sus dudas sobre Esencial Costa Rica. Puedo responderle sobre la historia, descripción, usos, licencimiento y estructura organizacional de la marca país.';
        vm.options = [];
        vm.sending = 0;
        vm.response = defaultResponse;
        vm.bannerImages = [
            '/images/banner/imagen-1.png',
            '/images/banner/imagen-2.png',
            '/images/banner/imagen-3.png',
            '/images/banner/imagen-4.png',
            '/images/banner/imagen-5.png',
            '/images/banner/imagen-6.png'
        ];

        vm.classify = classifyText;
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

        function classifyText() {
            vm.sending = 1;
            classify(vm.text).then(
                function (res) {
                    //console.log(res);
                    console.log(res.data);
                    if (res.data.classes[0].confidence < 0.49) {
                        // not so sure
                        vm.response = 'Disculpe. No entendí su pregunta ¿Podría redactarla distinto? Si es una pregunta muy específica, puedo sugerirle escribir a uno de nuestros asesores al correo marcapais@procomer.com﻿';
                        vm.responseConfidence = 0;
                    } else {
                        // quite sure
                        get(res.data.top_class).then(function (res2) {
                            //console.log(res2);

                            vm.response = res2.data.text;
                            var confidence = Math.ceil(res.data.classes[0].confidence * 100);
                            console.log(confidence);
                            vm.responseConfidence = confidence;
                            $timeout(function(){
                                vm.response=defaultResponse;
                            }, 60000);
                        }, function (err) {
                            //console.log('respuesta no encontrada');
                            vm.response = 'No tengo la información para contestar esa pregunta. Si es una pregunta muy específica, puedo sugerirle escribir a uno de nuestros asesores al correo marcapais@procomer.com';
                            vm.sending = 2;
                            vm.text = '';
                        })
                    }

                    vm.sending = 0;
                    vm.text = '';

                },
                function (res) {
                    //console.log(res);
                    vm.sending = 2;
                    vm.text = '';
                }
            );
        }
        function classify(text) {
            return $http.get('/api/classify/' + text);
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
