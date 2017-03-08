
# `rx.angular.js` - Reactive Extensions Bindings for AngularJS

This library serves as a bridge between the [ReactiveX for JavaScript (RxJS5)](https://github.com/ReactiveX/rxjs) and [AngularJS](http://angularjs.org/).

With this library, you will be able to do such things as easily watch values as they change, as observable sequences such as:

```js
angular.module('example', ['rx'])
  .controller('AppCtrl', function($scope, observeOnScope) {

    // Listen for changes on the name
    observeOnScope($scope, 'name').subscribe(function(change) {
      $scope.observedChange = change;
      $scope.newValue = change.newValue;
      $scope.oldValue = change.oldValue;
    });
  });
```

And with your HTML markup you can use it like this:
```html
<div class="container" ng-app="example" ng-controller="AppCtrl">
  <h2>Reactive Angular</h2>
  <ul class="list-unstyled">
    <li>observedChange {{observedChange}}</li>
    <li>newValue: {{newValue}}</li>
    <li>oldValue: {{oldValue}}</li>
  </ul>  

  <input type="text" ng-model="name" />
</div>
```
Another example is where we can create an Observable sequence from such things ng-click expressions where we can search Wikipedia:

```js
angular.module('example', ['rx'])
  .controller('AppCtrl', function($scope, $http, rx) {

    function searchWikipedia (term) {
      return rx.Observable
        .fromPromise($http({
          url: "http://en.wikipedia.org/w/api.php?&callback=JSON_CALLBACK",
          method: "jsonp",
          params: {
            action: "opensearch",
            search: term,
            format: "json"
          }
        }))
        .map(function(response){ return response.data[1]; });             
    }

    $scope.search = '';
    $scope.results = [];

    /*
      Creates a "click" function which is an observable sequence instead of just a function.
    */
    $scope.$createObservableFunction('click')
      .map(function () { return $scope.search; })
      .flatMapLatest(searchWikipedia)
      .subscribe(function(results) {
        $scope.results = results;
      });
      
      
    /*
      Creates a Hot Observable combine with sub4ever : Able to never end even Errors occurred.
    */
    function onNext(searchStr){
      console.log(searchStr);
    }
    $scope.$toObservableHot('search')
			.map((o)=>o.newValue)
			.sub4ever($scope,onNext,function(err){ //You can use sub4ever instead of subscribe
        //When an Error occurred, catch error here, and skip onNext
       })
      
      
  });
```

And the HTML markup you can simply just use a ng-click directive much as you have before, but now it is an Observable sequence.
```html
<div class="container" ng-app="example" ng-controller="AppCtrl">

  <input type="text" ng-model="search">
  <button ng-click="click()">Search</button>

  <ul>
    <li ng-repeat="result in results">{{result}}</li>
  </ul>

</div>
```
This only scratches the surface of what is possible when you combine the two libraries together.

## Community Examples ##

There are a growing number of community samples using RxJS and Angular.js, including:
- [ninya.io](http://www.ninya.io/) - [Code](https://github.com/ninya-io/ninya.io)


## Getting Started

There are a number of ways to get started with RxJS.

### Download the Source
```bash
$ git clone https://github.com/regou/rx.angular.js
$ cd ./rx.angular.js
```
### Installing with [NPM](https://npmjs.org/)
```bash
npm install regou/rx.angular.js
```

