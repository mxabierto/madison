angular.module('madisonApp.resources', [])
  .factory("Doc", function ($resource) {
    return $resource("/api/docs/:id", null, {
        query   : {
            method  : 'GET',
            isArray : false
        }
    });
  });