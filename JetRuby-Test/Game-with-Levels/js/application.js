var app = angular.module('shuffleGame', []);
app.controller("shuffleController", function ($scope, $timeout) {
	$scope.Dimension = 4; // Default 4 X 4
	$scope.cards = [];
	$scope.firstSelectIndex = -1;
	$scope.matchedCounter = 0;
	$scope.active = true;
	$scope.showModal = false;

	$scope.init = function(){
		$scope.repeatColors($scope.Dimension);
		$scope.shuffleCards();
		$scope.firstSelectIndex = -1;
		$scope.matchedCounter = 0;
		$scope.active = true;
		$scope.showModal = false;	
	}
	$scope.repeatColors = function(dimension){
		$scope.cards = [];
		for (var i = 0; i < Math.pow(dimension, 2)/2; i++) {
			$scope.cards.push({value: i, status: ''}, {value: i, status: ''});
		}
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
		if( $scope.cards[index].value == $scope.cards[$scope.firstSelectIndex].value ){
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
	$scope.changeLevel = function(level){
		$scope.Dimension = parseInt(level);
		$scope.init();
	}

});

