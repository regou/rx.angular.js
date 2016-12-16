  function noop () { }

  Rx.Observable.prototype.sub4ever = function($scope, onNext, onError, onComplete){
    onNext = angular.isFunction(onNext) ? onNext : noop;
    onError = angular.isFunction(onError) ? onError : noop;
    onComplete = angular.isFunction(onComplete) ? onComplete : noop;

    var destroy$ = Rx.Observable.fromScopeEvent('$destroy');

    var subscription = this
      .takeUntil(destroy$)
      .catch(function (error,output$) {
        ($scope.$$phase || $scope.$root.$$phase) ?
          onError(error) :
          $scope.$apply(function () { onError(error); });
        return output$;
      })
      .subscribe(function (data) {
          ($scope.$$phase || $scope.$root.$$phase) ?
            onNext(data) :
            $scope.$apply(function () { onNext(data); });
        },function (err) {
          console.warn('onLethalError:');
          console.error(err);
        },
        function (){
          ($scope.$$phase || $scope.$root.$$phase) ?
            onComplete() :
            $scope.$apply(function () { onComplete(); });
        }
      );

    return subscription;
  };
