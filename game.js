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
	startingCards = 3,
	collection = [
		{name: "water-1", pow: 1, el: "water"},
		{name: "water-2", pow: 2, el: "water"},
		{name: "water-3", pow: 3, el: "water"},
		{name: "water-4", pow: 4, el: "water"},
		{name: "fire-1", pow: 1, el: "fire"},
		{name: "fire-2", pow: 2, el: "fire"},
		{name: "fire-3", pow: 3, el: "fire"},
		{name: "fire-4", pow: 4, el: "fire"},
		{name: "nature-1", pow: 1, el: "nature"},
		{name: "nature-2", pow: 2, el: "nature"},
		{name: "nature-3", pow: 3, el: "nature"},
		{name: "nature-4", pow: 4, el: "nature"}
	];

//card constructor
var Card = function(cardData) {
	this.name = cardData.name;
	this.pow = cardData.pow;
	this.el = cardData.el;
}

//deck constructor
var Deck = function() {
	this.cards = [];

	for(var i = 0; i < deckSize; i++) {
		this.cards[i] = new Card(collection[(Math.floor(Math.random()*collection.length))]);
	}
}

Deck.prototype.drawCards = function(n, turn) {

	for(var i = 0; i < n; i++) {

		var cardObj = this.cards.splice(0, 1)[0];

		if(cardObj) {

			var card = document.createElement("div"),
				name = document.createElement("div"),
				pow = document.createElement("div"),
				img = document.createElement("img");

				img.src = "Placeholder.jpg";
				name.innerHTML = cardObj.name;
				pow.innerHTML = cardObj.pow;

			if(turn) {
				get("p-hand").appendChild(card);
			} else {
				get("ai-hand").appendChild(card);
			}

			card.className = "card";
			card.appendChild(img);
			card.appendChild(name);
			card.appendChild(pow);

		} else {
			console.log("Out of cards!");
		}
	}
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
		console.log("Turn: " + turn);

		player.health = playerHealth;
		ai.health = playerHealth;

		player.deck = new Deck();
		ai.deck = new Deck();

		if(turn) {
			player.deck.drawCards(startingCards, turn);
			ai.deck.drawCards(startingCards + 1, !turn);
		} else {
			player.deck.drawCards(startingCards + 1, !turn);
			ai.deck.drawCards(startingCards, turn);
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

		console.log("Next turn: " + turn);

		count = 0;

		if(turn) {
			player.deck.drawCards(1, turn);
			player.makeMove();
		} else {
			ai.deck.drawCards(1, turn);
			ai.makeMove();
		}

		turn = !turn;

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