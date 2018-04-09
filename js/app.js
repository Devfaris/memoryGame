const symbol = ['bicycle', 'leaf','cube', 'anchor', 'paper-plane-o','bolt', 'bomb', 'diamond'];
const symbols = symbol.concat(symbol);
let	delay = 300;
let	currentTimer;
let	second = 0;
const game = {
	match: 0,
	moves: 0,
	opened: []
}
// Game interface classes
game.ui = {};
game.ui.movesClass = $('.moves');
game.ui.rating = $('.fa-star');
game.ui.timer = $('.timer');
game.ui.deck = $('.deck');
game.ui.scorePanel = $('#scorePanel');
game.ui.restart = $('.restart');
const	totalCard = symbols.length /2;
const	stars3 = 10;
const	stars2 = 16;
const	stars1 = 20;
function shuffle(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}
// Initial Game
function startTheGame(){
  let cards = shuffle(symbols);
  game.ui.deck.empty();
  game.match = 0;
  game.moves = 0;
  game.ui.movesClass.text('0');
  for(let i = 0; i < cards.length; i++){
    game.ui.deck.append($('<li class="card"><i class="fa fa-'+ cards[i] +'"></i></li>'));
    addCardListener();
    resetTimer(currentTimer);
    second = 0;
    game.ui.timer.text(`${second}`);
    initTime();
  }
}
// Set Rating and final Score
function setRating(moves) {
	let rating = 3;
	if (game.moves > stars3 && game.moves < stars2) {
		game.ui.rating.eq(2).removeClass('fa-star').addClass('fa-star-o');
		rating = 2;
	} else if (game.moves > stars2 && game.moves < stars1) {
		game.ui.rating.eq(1).removeClass('fa-star').addClass('fa-star-o');
		rating = 1;
	} else if (game.moves > stars1) {
		game.ui.rating.eq(0).removeClass('fa-star').addClass('fa-star-o');
		rating = 0;
	}
	return { score: rating };
};

// End Game
function gameOver(moves,score){
	swal({
		className: 'finishButton',
		closeOnEsc: false,
		closeOnClickOutside: false,
		title: 'Congratulations! You Won the game!',
		text: 'you make ' + game.moves + ' Moves and ' + score + ' Stars in ' + second + ' Seconds.\n keep playing!',
		icon: 'success',
		button: 'Play again!'
	}).then(function (isConfirm) {
		if (isConfirm) {
			game.ui.rating.removeClass('fa-star-o').addClass('fa-star');
			startTheGame();
		}
	})
}

// Restart Game
game.ui.restart.bind('click', function (confirmed){
  if (confirmed) {
		game.opened.length = 0;
    game.ui.rating.removeClass('fa-star-o').addClass('fa-star');
    startTheGame();
  }
});

let addCardListener = function () {
	// Card flip
	game.ui.deck.find('.card').bind('click', function () {
		let $this = $(this)
		if ($this.hasClass('show') || $this.hasClass('match')){
			 return true;
		 }
		let card = $this.context.innerHTML;
		$this.addClass('open show');
		game.opened.push(card);
		// Compare with opened card
		if (game.opened.length > 1) {
			if (card === game.opened[0]) {
				game.ui.deck.find('.open').addClass('bounceIn match');
				setTimeout(function () {
					game.ui.deck.find('.match').removeClass('flipInY open show');
				}, delay);
				game.match++;
			} else {
				game.ui.deck.find('.open').addClass('flipInY notmatch');
				setTimeout(function () {
					game.ui.deck.find('.open').removeClass('notmatch');
				}, delay );
				setTimeout(function () {
					game.ui.deck.find('.open').removeClass('open show');
				}, delay);
			}
			game.opened = [];
			game.moves++;
			setRating(game.moves);
			game.ui.movesClass.html(game.moves);
		}

		// End Game if match all cards
		if (totalCard === game.match) {
			setRating(game.moves);
			let score = setRating(game.moves).score;
			setTimeout(function () {
				gameOver(game.moves, score);
			}, 500);
		}
	});
};
function initTime() {
	currentTimer = setInterval(function () {
		game.ui.timer.text(`${second}`)
		second = second + 1
	}, 1000);
}
function resetTimer(timer) {
	if (timer) {
		clearInterval(timer);
	}
}
startTheGame();
