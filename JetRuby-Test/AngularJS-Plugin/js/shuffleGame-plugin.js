(function() {
'use strict';

angular
    .module('game-module',[])
    .provider('$game', function(){
    	// Default Options
		var scope = this;
		scope.defaults = {
			colors: [
				{id: 1, color: "#fc3f1d"},
	            {id: 2, color: "#49b3db"},
	            {id: 3, color: "#f9a634"},
	            {id: 4, color: "#178300"},
	            {id: 5, color: "#db49d3"},
	            {id: 6, color: "#ffde1d"},
	            {id: 7, color: "#00ffe2"},
	            {id: 8, color: "#b9b9b9"}
			]
		};
		// setOptions function to set new options
		this.setOptions = function(options) {
		    if (!angular.isObject(options)) throw new Error("Options must be an object");
		    scope.defaults = angular.extend({}, scope.defaults, options);
		};
		// Provider get methode
		this.$get = function() {
		return this;
		};
    })
    .directive('gameBoard', function () {
	    return {
	      templateUrl: 'game-markup.html',
	      scope: true,
	      controller: function ($scope, $timeout, $game) {
			$scope.cards = [];
			$scope.firstSelectIndex = -1;
			$scope.matchedCounter = 0;
			$scope.active = true;
			$scope.showModal = false;

			$scope.init = function(){
				$scope.repeatColors($game.defaults.colors);
				$scope.shuffleCards();
				$scope.firstSelectIndex = -1;
				$scope.matchedCounter = 0;
				$scope.active = true;
				$scope.showModal = false;	
			}
			$scope.repeatColors = function(cards){
				$scope.cards = [];
				cards.concat(cards).map(function(item) {
					$scope.cards.push(angular.merge({status: ''}, item));
				})
			}
			$scope.shuffleCards = function(){
				$scope.cards.sort(function(){return 0.5 - Math.random()});
			}
			
			$scope.setStatus = function(index, status){
				$scope.cards[index].status = status;
			}
			$scope.cardClickEvent = function(index){
				var cardStatus = $scope.cards[index].status;
				if( $scope.active && cardStatus != 'selected' && cardStatus!= 'matched'){
					switch( $scope.firstSelectIndex ) {
                        case -1:
                            $scope.setStatus(index, 'selected');
							$scope.firstSelectIndex = index;
                            break;
                        default:
                            $scope.checkMatched(index);
                    }
				}
			}
			$scope.checkMatched = function(index){
				if( $scope.cards[index].id == $scope.cards[$scope.firstSelectIndex].id ){
					$scope.setStatus(index, 'matched');
					$scope.setStatus($scope.firstSelectIndex, 'matched');
					$scope.firstSelectIndex = -1;
					$scope.matchedCounter++;
					if( $scope.matchedCounter == $scope.cards.length/2 ) $timeout( function(){$scope.showModal = true;}, 1000);
				}else{
					$scope.setStatus(index, 'selected');
					$scope.active = false;
					$timeout( function(){
			            $scope.setStatus(index, '');
						$scope.setStatus($scope.firstSelectIndex, '');
						$scope.active = true;
						$scope.firstSelectIndex = -1;
			        }, 500 );
				}
			}
	      }
	    }
  	});



// notification Template
angular.module("game-module").run(["$templateCache", function($templateCache){
	$templateCache.put("game-markup.html",
		"<div class='boxes' ng-init='init()'>\
  				<div class='box {{card.status}}' ng-repeat='card in cards track by $index' ng-click='cardClickEvent($index)'>\
  					<div class='inner'>\
  						<div class='cover'></div>\
  						<div class='behind'>\
  							<div class='color' ng-style=\"{'background-color': card.color }\"></div>\
  						</div>\
  					</div>\
  				</div>\
  			</div>\
			<div class='modal' ng-show='showModal'>\
				<div class='modal-body'>\
					<p>Congratulations</p>\
					<p>You Win</p>\
					<button type='button' ng-click='init()'>Play Again</button>\
				</div>\
			</div>"
	);
}]);


})();