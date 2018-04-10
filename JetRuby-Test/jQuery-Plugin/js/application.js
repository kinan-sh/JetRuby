(function( $ ) {

    // Plugin definition.
    $.fn.memoryGame = function( options ) {
        // Default Options
        var defaults = {
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
        // Merge with Passed Options
        var settings = $.extend( {}, defaults, options );
        // Create Game Board for all Matched Elements
        return this.each(function() {
            var gameWrapper = $(this);
            var cardsElements = [];
            var game = {
                cards: [],
                init: function(){
                    this.repeatColors(settings.colors);
                    this.launch();
                },
                launch: function(){
                    this.shuffleCards();
                    this.appendHTML();
                    this.bindEvents();
                    this.firstSelectIndex = -1;
                    this.matchedCounter = 0;
                    this.active = true;
                },
                repeatColors: function(cards){
                    this.cards = [];
                    this.cards = $.merge(cards, cards);
                },
                shuffleCards: function(){
                    this.cards.sort(function(){return 0.5 - Math.random()});
                },
                appendHTML: function(){
                    var HTML = "<div class='boxes'>";
                    HTML += this.cards.reduce(function (accumulator, currentValue, currentIndex) {
                        return accumulator += "<div class='box' index='"+currentIndex+"'>\
                                            <div class='inner'>\
                                                <div class='cover'></div>\
                                                <div class='behind'>\
                                                    <div class='color' style='background-color:"+currentValue.color+";'></div>\
                                                </div>\
                                            </div>\
                                        </div>"
                    },'');
                    HTML += "</div>";
                    HTML += "<div class='modal'>\
                                <div class='modal-body'>\
                                    <p>Congratulations</p>\
                                    <p>You Win</p>\
                                    <button type='button'>Play Again</button>\
                                </div>\
                            </div>";
                   gameWrapper.html(HTML); 
                },
                bindEvents: function(){
                  cardsElements = gameWrapper.find('.box');
                  cardsElements.attr('status','');
                  cardsElements.on("click", this.cardClickEvent);
                  gameWrapper.find('.modal button').on("click", function(){
                    game.hideModal();
                    game.launch();
                  });
                },
                cardClickEvent: function(){
                    var card = $(this);
                    var cardStatus = card.attr('status');
                    var index      = card.attr('index');
                    if( game.active && cardStatus != 'selected' && cardStatus!= 'matched'){
                        switch( game.firstSelectIndex ) {
                            case -1:
                                card.attr('status', 'selected');
                                game.firstSelectIndex = index;
                                break;
                            default:
                                game.checkMatched( card, $(cardsElements[game.firstSelectIndex]) );
                        }
                    }
                },
                checkMatched: function(currentCard, prevCard){
                    if( this.cards[currentCard.attr('index')].id == this.cards[prevCard.attr('index')].id ){
                        currentCard.attr('status', 'matched');
                        prevCard.attr('status', 'matched');
                        this.firstSelectIndex = -1;
                        this.matchedCounter++;
                        if( this.matchedCounter == this.cards.length/2 ) 
                            setTimeout( function(){game.showModal();}, 1000);
                    }else{
                        currentCard.attr('status', 'selected');
                        this.active = false;
                        setTimeout( function(){
                            currentCard.attr('status', '');
                            $(cardsElements[game.firstSelectIndex]).attr('status', '');
                            game.active = true;
                            game.firstSelectIndex = -1;
                        }, 500 );
                    }
                },
                showModal: function(){
                    gameWrapper.find('.modal').show();
                },
                hideModal: function(){
                    gameWrapper.find('.modal').hide();
                }

            };

            game.init();
        });
    };
 
})( jQuery );



