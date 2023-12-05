// Read the file
const rawdata = require( 'fs' ).readFileSync( './test-data.txt', { encoding : 'utf-8' } ).split('\n');

// The first line contains the initial seeds
const seeds = rawdata.shift().split(':')[1].trim().split(' ');

// Now parse the maps into maps object
let maps = {};
let currentMap = '';
rawdata.forEach( ( line, idx ) => {
    if( idx == 0 ) return;
    if( line == '' ) return;

    if( line.endsWith( ' map:') ) {
        currentMap = line.split(' ')[0];
        maps[currentMap] = [];
    }
    else {
        const ranges = line.split(' ');
        maps[currentMap].push( {
            destinationRangeStart : parseInt( ranges[0] ),
            sourceRangeStart : parseInt( ranges[1] ),
            rangeLength : parseInt( ranges[2] )
        } )
    }
} );

//Find the distances
const distances = [];
seeds.forEach( ( seed ) => {
    let initial = parseInt(seed);
    [ 
    'seed-to-soil', 
    'soil-to-fertilizer', 
    'fertilizer-to-water', 
    'water-to-light', 
    'light-to-temperature', 
    'temperature-to-humidity', 
    'humidity-to-location'
    ].forEach( map => { 
        maps[ `${map}` ].every( m => { 
            if( initial >= parseInt(m.sourceRangeStart) && initial <= parseInt(m.sourceRangeStart) + parseInt(m.rangeLength) ) {
                initial += parseInt(m.destinationRangeStart) - parseInt(m.sourceRangeStart);
                return false;
            }
            return true;
        });

    });
    distances.push( parseInt(initial) );
});

console.log('The anwser is :', Math.min(...distances) );
