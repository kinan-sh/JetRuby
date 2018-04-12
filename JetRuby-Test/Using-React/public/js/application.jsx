var ShuffleGame = React.createClass({
  getDefaultProps: function () {
    return {
      colors: [
    		    {id: 0, color: "#fc3f1d"},
            {id: 1, color: "#49b3db"},
            {id: 2, color: "#f9a634"},
            {id: 3, color: "#178300"},
            {id: 4, color: "#db49d3"},
            {id: 5, color: "#ffde1d"},
            {id: 6, color: "#00ffe2"},
            {id: 7, color: "#b9b9b9"}
          ],
          firstSelectIndex: -1,
          matchedCounter: 0,
          active: true,
          showModal: false
    };
  },
  getInitialState: function () {
    return {
        colors: this.shuffleCards(this.repeatColors()),
        firstSelectIndex: this.props.firstSelectIndex,
        matchedCounter: this.props.matchedCounter,
        active: this.props.active,
        showModal: false
    };
  },
  restart: function(){
    this.setState({
      colors: this.shuffleCards(this.state.colors.map(x=>{x.status=''; return x;})),
      firstSelectIndex: -1,
      matchedCounter: 0,
      active: true,
      showModal: false
    });
  },
  repeatColors: function(){
		return this.props.colors.concat(this.props.colors).map(function(item,index) {
      return {id: index, color: item.color, status: ''};
		});
	},
  shuffleCards: function(cards){
		return cards.sort(function(){return 0.5 - Math.random()})
	},
  changeOneStatus: function(index, status){
    this.state.colors[index].status = status;
    return this.state.colors;
	},
  changeTwoStatus: function(firstIndex, secondIndex ,status){
    this.state.colors[firstIndex].status = status;
    this.state.colors[secondIndex].status = status;
    return this.state.colors;
	},
  cardClickEvent: function(index, cardStatus){
    if( this.state.active && cardStatus != 'selected' && cardStatus!= 'matched'){
			switch( this.state.firstSelectIndex ) {
                case -1:
                    this.setState({colors: this.changeOneStatus(index, 'selected'), firstSelectIndex: index});
                    break;
                default:
                    this.checkMatched(index);
            }
		}
	},
  checkMatched: function(index){
    if( this.state.colors[index].color == this.state.colors[this.state.firstSelectIndex].color ){
      this.setState({
        colors: this.changeTwoStatus(index, this.state.firstSelectIndex, 'matched'),
        firstSelectIndex: -1,
        matchedCounter: ++this.state.matchedCounter
      });
			if( this.state.matchedCounter == this.state.colors.length/2 ) setTimeout( function(){this.setState({showModal: true});}.bind(this), 500);
		}else{
      this.setState({colors: this.changeOneStatus(index, 'selected'), active: false});
			setTimeout( function(){
              this.setState({
                colors: this.changeTwoStatus(index, this.state.firstSelectIndex, ''),
                firstSelectIndex: -1,
                active: true
              });
            }.bind(this), 500 );
		}
	},
  render: function () {
    var cards = this.state.colors;
    const cardsElements = cards.map((card, index) =>
      <div className={"box "+card.status} key={card.id} onClick={()=>this.cardClickEvent(index, card.status)}>
        <div className="inner">
          <div className="cover"></div>
          <div className="behind">
            <div className="color" style={{backgroundColor: card.color}}></div>
          </div>
        </div>
      </div>
    );
    return (
      <div className="game">
        <div className="boxes">
          {cardsElements}
        </div>
        { this.state.showModal ? <Modal playAgainEvent={this.restart} /> : null }
      </div>
    );
  }
});

var Modal = React.createClass({
  render: function () {
    return(
      <div className="modal">
        <div className="modal-body">
          <p>Congratulations</p>
          <p>You Win</p>
          <button type="button" onClick={this.props.playAgainEvent}>Play Again</button>
        </div>
      </div>
    );
  }
});


ReactDOM.render(
  <ShuffleGame />,
  document.getElementById('app')
);
