// Read the file
const rawdata = require( 'fs' ).readFileSync( './data.txt', { encoding : 'utf-8' } ).split('\n');

// The first line contains the initial seeds
let seeds = rawdata.shift().split(':')[1].trim().split(' ');


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
let smallest = Infinity;
for ( let seedIdx = 0; seedIdx < seeds.length; seedIdx +=2 ) {
    for ( let seed = parseInt( seeds[seedIdx] ); seed < parseInt( seeds[seedIdx] ) + parseInt( seeds[seedIdx + 1] ); seed++ ) {
        let initial = seed;
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
        if( parseInt(initial) < smallest ) smallest = initial;
    }
};

console.log('The anwser is :', smallest );
