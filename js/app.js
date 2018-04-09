let symbols = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'],
	$timer = $('.timer'),
	$deck = $('.deck'),
	$scorePanel = $('#score-panel'),
	$moves = $('.moves'),
	$rating = $('.fa-star'),
	$restart = $('.restart'),
	delay = 300,
	currentTimer,
	second = 0,
	opened = [],
	match = 0,
	moves = 0,
	totalCard = symbols.length / 2,
	stars3 = 10,
	stars2 = 16,
	stars1 = 20;

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
  $deck.empty();
  match = 0;
  moves = 0;
  $moves.text('0');
  for(let i = 0; i < cards.length; i++){
    $deck.append($('<li class="card"><i class="fa fa-'+ cards[i] +'"></i></li>'));
    addCardListener();
    resetTimer(currentTimer);
    second = 0;
    $timer.text(`${second}`);
    initTime();
  }
}


// Set Rating and final Score
function setRating(moves) {
	let rating = 3;
	if (moves > stars3 && moves < stars2) {
		$rating.eq(2).removeClass('fa-star').addClass('fa-star-o');
		rating = 2;
	} else if (moves > stars2 && moves < stars1) {
		$rating.eq(1).removeClass('fa-star').addClass('fa-star-o');
		rating = 1;
	} else if (moves > stars1) {
		$rating.eq(0).removeClass('fa-star').addClass('fa-star-o');
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
		text: 'you make ' + moves + ' Moves and ' + score + ' Stars in ' + second + ' Seconds.\n keep playing!',
		icon: 'success',
		button: 'Play again!'
	}).then(function (isConfirm) {
		if (isConfirm) {
			$rating.removeClass('fa-star-o').addClass('fa-star');
			startTheGame();
		}
	})
}

// Restart Game
$restart.bind('click', function (confirmed){
  if (confirmed) {
    $rating.removeClass('fa-star-o').addClass('fa-star');
    startTheGame();
  }
});

let addCardListener = function () {
	// Card flip
	$deck.find('.card').bind('click', function () {
		let $this = $(this)
		if ($this.hasClass('show') || $this.hasClass('match')){
			 return true;
		 }
		let card = $this.context.innerHTML;
		$this.addClass('open show');
		opened.push(card);
		// Compare with opened card
		if (opened.length > 1) {
			if (card === opened[0]) {
				$deck.find('.open').addClass('bounceIn match');
				setTimeout(function () {
					$deck.find('.match').removeClass('flipInY open show');
				}, delay);
				match++;
			} else {
				$deck.find('.open').addClass('flipInY notmatch');
				setTimeout(function () {
					$deck.find('.open').removeClass('notmatch');
				}, delay );
				setTimeout(function () {
					$deck.find('.open').removeClass('open show');
				}, delay);
			}
			opened = [];
			moves++;
			setRating(moves);
			$moves.html(moves);
		}

		// End Game if match all cards
		if (totalCard === match) {
			setRating(moves);
			let score = setRating(moves).score;
			setTimeout(function () {
				gameOver(moves, score);
			}, 500);
		}
	});
};

function initTime() {
	currentTimer = setInterval(function () {
		$timer.text(`${second}`)
		second = second + 1
	}, 1000);
}

function resetTimer(timer) {
	if (timer) {
		clearInterval(timer);
	}
}

startTheGame();
