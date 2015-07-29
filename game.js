;(function(){

//global variables
var	scale, turn, timer, count,
	timeLimit = 20;
	deckSize = 20,
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

				img.src = "images/" + cardObj.el + "Elemental.png";
				el.src = "images/" + cardObj.el + ".png";
				name.innerHTML = cardObj.name;
				pow.innerHTML = cardObj.pow;

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
					addEvent(mask, "mouseout", zoom);
				} else {
					get("ai-hand").appendChild(card);
				}

				card.el = cardObj.el;
				card.pow = pow;
				card.mask = mask;
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

		this.deck.inHand.forEach(function(card) {
			addEvent(card.mask, "mousedown", drag);
		});

		this.deck.onTable.forEach(function(card) {
			addEvent(card.mask, "mousedown", attack);
		});

		addEvent(get("next-turn"), "click", move);

	},

};

//ai object
var ai = {
	makeMove: function() {

		setTimeout(function() {

			for (i = 0; i < (Math.random()*2); i++) {

				if (ai.deck.inHand.length > 0 && ai.deck.onTable.length < 4) {

					var card = ai.deck.inHand.splice(0, 1)[0];

					get("ai-zone").appendChild(card);
					ai.deck.onTable.push(card);

				} else {
					console.log("Can't put more than 4 cards on the table");
				}

			}

			move();

		}, 1000);
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

		blockPlayer();
		count = 0;

		if (turn) {
			player.deck.drawCards(1, turn);
			player.makeMove();
			get("tip").childNodes[0].innerHTML = "Your turn";
		} else {
			ai.deck.drawCards(1, turn);
			ai.makeMove();
			get("tip").childNodes[0].innerHTML = "AI turn";
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
		var card = e.target.parentNode;
		console.log(card.className);
		if (card.className == "card card-zoomed" && e.type == "mouseout") {
			card.className = "card";
		} else if (card.className == "card" && e.type == "mouseover") {
			card.className += " card-zoomed";
		}
	},

	//checks if pointer is over the target
	checkOver = function(e, target) {
		var checkX = e.clientX > target.offsetLeft && e.clientX < target.offsetLeft + parseInt(getComputedStyle(target).width),
			checkY = e.clientY > target.offsetTop && e.clientY < target.offsetTop + parseInt(getComputedStyle(target).height);
		return checkX && checkY;
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

			drop = function(e) {

				console.log("drop started");

				if (player.deck.onTable.length < 4 && checkOver(e, get("table")) && !turn) {
					get("p-zone").appendChild(card);
					removeEvent(card.mask, "mousedown", drag);
					player.deck.onTable.push(player.deck.inHand.splice(player.deck.inHand.indexOf(card), 1)[0]);
				} else {
					get("p-hand").appendChild(card);
					addEvent(card.mask, "mouseover", zoom);
					addEvent(card.mask, "mouseout", zoom);
					console.log("Can't put more than cards on the table right now");
				}

				card.style.height = "";
				card.style.width = "";
				card.style.position = "";
				card.style.fontSize = "";
				card.style.transition = "";

				removeEvent(document, "mousemove", moveCard);
				removeEvent(document, "mouseup", drop);
				
			};

		if (card.className == "card card-zoomed") {

			initHeight = parseInt(getComputedStyle(card).height);
			initWidth = parseInt(getComputedStyle(card).width);

			removeEvent(card.mask, "mouseover", zoom);
			removeEvent(card.mask, "mouseout", zoom);
			
			card.style.transition = "0s";
			card.className = "card";
			card.style.height =	initHeight + "px";
			card.style.width =	initWidth + "px";
			card.style.fontSize = "2em";
			moveCard(e);
			console.log(getComputedStyle(card).height);

			card.style.position = "absolute";

			addEvent(document, "mousemove", moveCard);
			addEvent(document, "mouseup", drop);
		}
	},

	attack = function() {

	}

	blockPlayer = function() {

		player.deck.inHand.forEach(function(card) {
			removeEvent(card, "mousedown", drag);
		});

		player.deck.onTable.forEach(function(card) {
			removeEvent(card, "mousedown", attack);
		});

		var event = document.createEvent('Event');
		event.initEvent('mouseup', true, true);
		document.dispatchEvent(event);
		removeEvent(get("next-turn"), "click", move);
	};

//run
addEvent(window, "load", init);
addEvent(window, "click", prevent);
addEvent(window, "mousedown", prevent);
addEvent(window, "mouseup", prevent);
//addEvent(window, "contextmenu", prevent);

})();