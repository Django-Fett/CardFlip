(function() {
    const DECK_SIZE = 24;
    const DECK_SPRITE_SRC =
        'https://openclipart.org/image/2400px/svg_to_png/171444/oxygen-white.png&disposition=attachment';

    // Generates html with markup for DECK_SIZE cards
    var buildDeck = function() {
        var i, k, l;
        var deck;
        var cards = '';

        var cardId; // cardId selected to insert into DOM
        var cardRegistry = {}; // Registry object of format {cardId: numberOfOccurrences, ...}
        var availableCardIds = []; // List of available cards to use, based on id

        // Generate list of available card ids [0, DECK-SIZE/2)
        for (i = 0, k = Math.floor(DECK_SIZE / 2); i < k; i++) {
            availableCardIds[i] = i;
        }

        // For each card slot available, place a card
        for (i = 0, k = DECK_SIZE; i < k; i++) {

            // While there's still a list of available cards to place
            while (availableCardIds.length > 0) {
                // Grab available card index
                l = getRandomNumber(0, availableCardIds.length - 1);

                // Retrieve the card id we can use
                cardId = availableCardIds[l];

                // Store the times this id has been used
                if (cardRegistry[cardId] == undefined) {
                    cardRegistry[cardId] = 1; // init for cardId
                } else {
                    cardRegistry[cardId]++;

                    // cardId has been used before, so remove the id from the list of available card ids
                    availableCardIds.splice(l, 1);
                }

                // Available card id was found, so let's stop looking
                break;
            }

            // Create card with cardId
            cards += `<div class="card item-${cardId}" data-card-id='${cardId}'"></div>`;
        }

        deck = `<div class="deck">${cards}</div>`;
        return deck;
    };

    // Decided not to use jQuery to add/remove classes, so I create a toggle function
    var toggleClass = function(element, className) {
        var classPresentIdx;
        var targetClasses = element.className.split(' ');
        classPresentIdx = targetClasses.indexOf(className);

        if (classPresentIdx > -1) {
            targetClasses.splice(classPresentIdx, 1);
        } else {
            targetClasses.push(className);
        }

        element.className = targetClasses.join(' ');
    };

    // Returns a number in rang [min, max]
    var getRandomNumber = function(min, max) {
        var ret = Math.floor(Math.random() * (max - min + 1)) + min;
        return ret;
    };

    var init = function() {
        var pageBody;
        var deck;
        var clickedItems = [];
        var clickHandler;

        var cardRegistry = {};

        deck = buildDeck();

        pageBody = document.getElementById('body-wrapper');

        // Add event delegation to body wrapper to trap for all click events
        pageBody.onclick = clickHandler = function(e) {
            var debounce = false;

            clickHandler = function(e) {
                var _target, targetClasses, unClickedItem;

                if (!debounce) { // Restrict number of clicks
                    debounce = true;

                    _target = e.target;
                    targetClasses = _target.className.split(' ');

                    // If card was clicked and it wasn't matched already...
                    if (
                        targetClasses.indexOf('card') > -1 &&
                        targetClasses.indexOf('matched') == -1
                    ) {
                        // Flip card and keep track of it
                        toggleClass(_target, 'selected');
                        clickedItems.push(_target);

                        // If this is the second card selected, see if it matches former
                        if (clickedItems.length == 2) {
                            setTimeout(function() {
                                // If cards flipped match, hide them
                                if (
                                    clickedItems[0].getAttribute('data-card-id') ==
                                    clickedItems[1].getAttribute('data-card-id') &&
                                    clickedItems[0] !== clickedItems[1]) {
                                    clickedItems.map(function(ele) {
                                        toggleClass(ele, 'matched');
                                    });
                                }

                                // Turn cards over regardless of match
                                while ((unClickedItem = clickedItems.pop())) {
                                    toggleClass(unClickedItem, 'selected');
                                }

                                debounce = false;
                            }, 800);

                            return;
                        }
                    }
                }

                debounce = false;
            };

            clickHandler(e);
        };

        pageBody.innerHTML = deck;
    };

    init();
})();