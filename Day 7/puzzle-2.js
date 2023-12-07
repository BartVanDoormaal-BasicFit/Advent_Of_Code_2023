// Map to lookup hand types based on the regexp match lengths
const typeMap = {
    '1_2_0' : 'One Pair',
    '2_2_2' : 'Two Pairs',
    '1_3_0' : 'Three of a Kind',
    '1_4_0' : 'Four of a Kind',
    '1_5_0' : 'Five of a Kind',
    '2_3_2' : 'Full House',
    '2_2_3' : 'Full House',   
    '0_0_0' : 'High Card'
}
// Map to lookup ordering based on the hand types
const typeOrderMap = {
    'One Pair' : 1,
    'Two Pairs' : 2,
    'Three of a Kind' : 3,
    'Four of a Kind' : 5,
    'Five of a Kind' : 6,
    'Full House' : 4,
    'High Card' : 0
}

// Read data and map into object
let hands = require( 'fs' ).readFileSync( './data.txt', { encoding : 'utf-8' } )
    .split('\n')
    .map( h => Object.assign( {}, {  
        orgCards: h.split(' ')[0], 
        // Replacements so the order can be determined with simple sorts and compares
        cards: h.replaceAll('A','D').replaceAll('T','A').replaceAll('Q','B').replaceAll('K','C').replaceAll('J','0').split(' ')[0], 
        sortedCards: h.replaceAll('A','D').replaceAll('T','A').replaceAll('Q','B').replaceAll('K','C').replaceAll('J','0').split(' ')[0].split('').sort().join(''), 
        bid: parseInt(h.split(' ')[1]), 
        type: '',
        typeOrder : 0
    } ) )
;

// Determin the type for each hand
hands.forEach( hand => {
    //Get the inital type of hand
    let ofKindMatch = hand.sortedCards.match( /(.)\1{1,4}/gi );
    const typeKey = ofKindMatch ? `${ofKindMatch.length}_${ofKindMatch.length == 1 ? `${ofKindMatch[0].length}_0` : `${ofKindMatch[0].length}_${ofKindMatch[1].length}`}` : '0_0_0';
    hand.type = typeMap[typeKey];
    hand.ofKindMatch = ofKindMatch;

    // If no repeating characters, check for a single joker and exit
    if( !ofKindMatch ) {
        if( hand.sortedCards.substring( 0, 1 ) == "0" ) hand.type = 'One Pair';
        hand.typeOrder = typeOrderMap[hand.type];
        return;
    }

    // Check for multiple Jokers
    if( ofKindMatch.length == 1 && ofKindMatch[0] == '00000' ) hand.type = 'Five of a Kind';    // 5 jokers is five of a kind
    if( ofKindMatch.length == 1 && ofKindMatch[0] == '0000'  ) hand.type = 'Five of a Kind';    // 4 jokers also is five of a kind
    
    if( ofKindMatch.length == 1 && ofKindMatch[0] == '000' ) hand.type = 'Four of a Kind';  // 3 jokers and two distinct chars is four of a kind
    if( ofKindMatch.length == 2 && ofKindMatch[0] == '000' ) hand.type = 'Five of a Kind';  // 3 jokers and two other identical chars is five of a kind
    
    if( ofKindMatch.length == 2 && ofKindMatch[0] == '00' && ofKindMatch[1].length == 2 ) hand.type = 'Four of a Kind'; // 2 jokers and 2 identical is four of a kind
    if( ofKindMatch.length == 2 && ofKindMatch[0] == '00' && ofKindMatch[1].length == 3 ) hand.type = 'Five of a Kind'; // 2 jokers and 3 identical is five of a kind
    
    if( ofKindMatch.length == 1 && ofKindMatch[0] == '00' ) hand.type = 'Three of a Kind'; // 2 jokers and 3 distinct chars is three of a kind

    // Check for 1 Joker
    if( (hand.sortedCards.substring( 0, 1 ) == "0" && hand.sortedCards.substring( 1, 2 ) != "0") ) {
        if( ofKindMatch.length == 1 && ofKindMatch[0].length == 2 ) hand.type = 'Three of a Kind'; // 1 joker and 2 other identical chars is three of a kind
        if( ofKindMatch.length == 1 && ofKindMatch[0].length == 3 ) hand.type = 'Four of a Kind';  // 1 joker and 3 other identical chars is four of a kind
        if( ofKindMatch.length == 1 && ofKindMatch[0].length == 4 ) hand.type = 'Five of a Kind';  // 1 joker and 4 other identical chars is five of a kind
        if( ofKindMatch.length == 2                               ) hand.type = 'Full House';      // 1 joker and 2 sets of 2 other identical chars is a full house
    }
    
    // Set inital order based on type
    hand.typeOrder = typeOrderMap[hand.type];
});

// Sort hands based on type and on cards within the same type
hands = hands.sort( (a,b)  => {
    return a.typeOrder > b.typeOrder ? 1  :  // Sort based on type
           a.typeOrder < b.typeOrder ? -1 :  // Sort based on type
           a.cards > b.cards ? 1 :           // Sort based on card
           a.cards < b.cards ? -1 :          // Sort based on card
           0                                 // No sort needed
});

// Calculate the anwser
let anwser = 0;
hands.forEach( (hand,idx) => anwser += hand.bid * (idx+1) );
console.log('The anwser is :', anwser );
