// Map to lookup hand types based on the regexp match lengths
const typeOrderMap = {
    '1_2_0' : {
        type : 'One Pair',
        typeOrder : 1,
    },
    '2_2_2': {
        type : 'Two Pairs',
        typeOrder : 2,
    },
    '1_3_0': {
        type : 'Three of a Kind',
        typeOrder : 3,
    },
    '1_4_0': {
        type : 'Four of a Kind',
        typeOrder : 5,
    },
    '1_5_0': {
        type : 'Five of a Kind',
        typeOrder : 6,
    },
    '2_3_2': {
        type : 'Full House',
        typeOrder : 4,
    },
    '2_2_3': {
        type : 'Full House',
        typeOrder : 4,
    },   
    '0_0_0' : {
        type : 'High Card',
        typeOrder : 0,
    }
}

// Read data and map into object
let hands = require( 'fs' ).readFileSync( './data.txt', { encoding : 'utf-8' } )
    .split('\n')
    .map( h => Object.assign( {}, {  
        orgCards: h.split(' ')[0], 
        // Replacements so the order can be determined with simple sorts and compares
        cards: h.replaceAll('A','E').replaceAll('K','D').replaceAll('Q','C').replaceAll('J','B').replaceAll('T','A').split(' ')[0], 
        sortedCards: h.replaceAll('A','E').replaceAll('K','D').replaceAll('Q','C').replaceAll('J','B').replaceAll('T','A').split(' ')[0].split('').sort().join(''), 
        bid: parseInt(h.split(' ')[1]), 
        type: '',
        typeOrder : 0
    } ) )
;

// Determin the type for each hand
hands.forEach( hand => {
    let ofKindMatch = hand.sortedCards.match( /(.)\1{1,4}/gi );
    const typeKey = ofKindMatch ? `${ofKindMatch.length}_${ofKindMatch.length == 1 ? `${ofKindMatch[0].length}_0` : `${ofKindMatch[0].length}_${ofKindMatch[1].length}`}` : '0_0_0';
    hand.type = typeOrderMap[typeKey].type;
    hand.typeOrder = typeOrderMap[typeKey].typeOrder;
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