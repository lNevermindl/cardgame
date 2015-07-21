;(function(){

//basic functions
var get = function(id) {
		return document.getElementById(id);
	};

	//cross-browser events
	addEvent = function(element, event, handler) {

		if(window.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if(window.attachEvent) {
            element.attachEvent(event, handler);
        }
	},

	removeEvent = function(element, event, handler) {
		if(window.addEventListener) {
            element.removeEventListener(event, handler, false);
        } else if(window.attachEvent) {
            element.detachEvent(event, handler);
        }
	};

//global variables
var	scale, turn, timer, count,
	timeLimit = 30;
	deckSize = 10,
	playerHealth = 30,
	startingCards = 4,
	collection = [
		{name: "test1", pow: 1, el: "water"},
		{name: "test2", pow: 2, el: "fire"},
		{name: "test3", pow: 3, el: "nature"},
		{name: "test4", pow: 4, el: "water"},
		{name: "test5", pow: 5, el: "fire"},
		{name: "test6", pow: 6, el: "nature"},
		{name: "test7", pow: 7, el: "water"},
		{name: "test8", pow: 8, el: "fire"},
		{name: "test9", pow: 9, el: "nature"},
		{name: "test10", pow: 10, el: "water"}
	];

//card constructor
var Card = function(cardObj) {
	this.name = cardObj.name;
	this.pow = cardObj.pow;
	this.el = cardObj.el;
}

//deck constructor
var Deck = function() {
	this.cards = [];

	for(var i = 0; i < deckSize; i++) {
		this.cards[i] = new Card(collection[(Math.floor(Math.random()*collection.length))]);
	}
}

Deck.prototype.drawCards = function(n, turn) {

	var card = document.createElement("div");

	if(turn) {
		get("p-hand").appendChild(card);
	} else {
		get("ai-hand").appendChild(card);
	}

	card.className = "card";
}

//player object
var player = {
	makeMove: function() {

		//move();
	}
};

//ai object
var ai = {
	makeMove: function() {

		//move();
	}
};

//main logic
var init = function() {
		//show starting screen
		console.log("Initializing...");

		removeEvent(document, "click", init);
		get("message").style.display = "none"
		get("board").style.display = "none"

		fitScale();
		addEvent(window, "resize", fitScale);


		get("starting-screen").style.display = "block"
		addEvent(get("start-button"), "click", start);
		console.log("Game initialized");
	},

	start = function() {
		//show game interface
		get("starting-screen").style.display = "none"
		get("board").style.display = "block"

		//launch game
		turn = Math.round(Math.random());
		console.log(turn);
		console.log(!!turn);

		player.health = playerHealth;
		ai.health = playerHealth;

		player.deck = new Deck();
		ai.deck = new Deck();

		if(turn) {
			player.deck.drawCards(startingCards, turn);
			ai.deck.drawCards(startingCards + 1);
		} else {
			player.deck.drawCards(startingCards + 1, turn);
			ai.deck.drawCards(startingCards);
		}

		timer = setInterval(function() {
			count++;
			if(count >= timeLimit){
				move();
			}
			console.log(count);
		}, 1000);

		move();
	},

	move = function() {
		//game turn
		count = 0;

		if(turn) {
			player.deck.drawCards(1, turn);
			player.makeMove();
		} else {
			ai.deck.drawCards(1, turn);
			ai.makeMove();
		}

		turn = !turn;
		console.log(turn);

		//end game
		if(player.health <= 0) {
			end("You lose!/nClick to continue.");
		} else if(ai.health <= 0) {
			end("You win!/nClick to continue.");
		}
	},

	end = function(message) {
		//show message
		clearInterval(timer);
		get("message").innerHTML = message;
		get("message").style.display = "block";
		document.addEvent("click", init());
	};

//additional functions
var fitScale = function() {
	scale = window.innerWidth;
	document.body.style.fontSize = scale * 0.02 + "px";
	get("wrapper").style.width = scale * 0.98 + "px";
	get("wrapper").style.height = scale * 0.46 + "px";
	get("wrapper").style.marginTop = (window.innerHeight - scale * 0.46) / 2 + "px";
	console.log("resized");
}

//run
addEvent(window, "load", init);

})();