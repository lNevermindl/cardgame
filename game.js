;(function(){

//basic functions
var get = function(id) {
		return document.getElementById(id);
	};

	//cross-browser events
	addEvent = function(element, event, handler) {

		if (window.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (window.attachEvent) {
            element.attachEvent(event, handler);
        }
	},

	removeEvent = function(element, event, handler) {
		if (window.addEventListener) {
            element.removeEventListener(event, handler, false);
        } else if (window.attachEvent) {
            element.detachEvent(event, handler);
        }
	},

	prevent = function(e) {
		event.preventDefault ? event.preventDefault() : (event.returnValue = false);
	};

//global variables
var	scale, turn, timer, count,
	timeLimit = 20;
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
	this.inHand = [];
	this.onTable = [];

	for (var i = 0; i < deckSize; i++) {
		this.cards[i] = new Card(collection[(Math.floor(Math.random()*collection.length))]);
	}
}

Deck.prototype.drawCards = function(n, turn) {

	for (var i = 0; i < n; i++) {

		if (this.inHand.length < 8) {

			var cardObj = this.cards.splice(0, 1)[0];

			if (cardObj) {

				var card = document.createElement("div"),
					img = document.createElement("img"),
					name = document.createElement("div"),
					pow = document.createElement("div"),
					el = document.createElement("img"),
					mask = document.createElement("div");

				img.src = "Placeholder.jpg";
				name.innerHTML = cardObj.name;
				pow.innerHTML = cardObj.pow;

				switch (cardObj.el) {
					case "water":
						el.src = "Placeholder.jpg";
						break;
					case "fire":
						el.src = "Placeholder.jpg";
						break;
					case "nature":
						el.src = "Placeholder.jpg";
						break;
				}

				card.appendChild(img);
				card.appendChild(name);
				card.appendChild(el);
				card.appendChild(pow);
				card.appendChild(mask);
				card.className = "card";
				mask.className = "mask";

				if (turn) {
					get("p-hand").appendChild(card);
					addEvent(mask, "mouseover", zoom);
				} else {
					get("ai-hand").appendChild(card);
				}

				card.el = cardObj.el;
				card.pow = pow;
				card.mask = mask
				this.inHand.push(card);

			} else {
				console.log("Out of cards!");
			}

		} else {
			console.log("Can't hold more than 8 cards in hand!");
		};
	}
}

//player object
var player = {
	makeMove: function() {

		for (var i = 0; i < this.deck.inHand.length; i++) {
			addEvent(this.deck.inHand[i], "mousedown", drag);
		}

		addEvent(get("next-turn"), "click", move);

	}
};

//ai object
var ai = {
	makeMove: function() {

		setTimeout(function() {

			get("ai-zone").appendChild(ai.deck.inHand.splice(0, 1)[0]);
			move();

		}, 500);
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

		addEvent(get("tip"), "click", function() {turn = true; move(); console.log("now it's your turn")});

		//launch game
		turn = Math.round(Math.random());
		console.log("Turn: " + turn);

		player.health = playerHealth;
		ai.health = playerHealth;

		player.deck = new Deck();
		ai.deck = new Deck();

		if (turn) {
			player.deck.drawCards(startingCards, turn);
			ai.deck.drawCards(startingCards + 1, !turn);
		} else {
			player.deck.drawCards(startingCards + 1, !turn);
			ai.deck.drawCards(startingCards, turn);
		}

		timer = setInterval(function() {
			count++;
			if (count >= timeLimit){
				move();
			}
			console.log(count);
		}, 1000);

		move();
	},

	move = function() {
		//game turn

		console.log("Next turn: " + turn);
		removeEvent(get("next-turn"), "click", move);
		count = 0;

		if (turn) {
			player.deck.drawCards(1, turn);
			player.makeMove();
		} else {
			ai.deck.drawCards(1, turn);
			ai.makeMove();
		}

		turn = !turn;

		//end game
		if (player.health <= 0) {
			end("You lose!/nClick to continue.");
		} else if (ai.health <= 0) {
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
	},

	zoom = function(e) {
		e.target.parentNode.className += " card-zoomed";
		addEvent(e.target, "mouseout", function(e) {e.target.parentNode.className = "card"});
	},

	drag = function(e) {

		console.log("drag started");

		var card = e.target.parentNode,
			initHeight,
			initWidth;

		var moveCard = function(e) {

			console.log("moveCard started");

			card.style.top = e.clientY - initHeight/2 + "px";
			card.style.left = e.clientX - initWidth/2 + "px";

			},

			drop = function() {

				console.log("drop started");

				get("p-zone").appendChild(card);
				card.style.height = "";
				card.style.width = "";
				card.style.position = "";
				card.style.fontSize = "";

				removeEvent(document, "mousemove", moveCard);
				removeEvent(document, "mouseup", drop);
				removeEvent(card, "mousedown", drag);
			};

		initHeight = parseInt(getComputedStyle(card).height);
		initWidth = parseInt(getComputedStyle(card).width);

		removeEvent(e.target, "mouseover", zoom);
		removeEvent(e.target, "mouseout", function(e) {e.target.parentNode.className = "card"});
		
		card.className = "card";
		card.style.height =	initHeight + "px";
		card.style.width =	initWidth + "px";
		card.style.fontSize = "2em";
		moveCard(e);
		console.log(getComputedStyle(card).height);

		card.style.position = "absolute";
		card.style.transition = "0s";

		addEvent(document, "mousemove", moveCard);
		addEvent(document, "mouseup", drop);
	};

//run
addEvent(window, "load", init);
addEvent(window, "click", prevent);
addEvent(window, "mousedown", prevent);
addEvent(window, "mouseup", prevent);
//addEvent(window, "contextmenu", prevent);

})();