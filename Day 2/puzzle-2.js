console.log('The anwser is ', 
    require("fs")
    .readFileSync('./data-1.txt', { encoding: 'utf-8' })
    .split('\n')
    .map(game => Object.assign({}, { 
        id: parseInt(game.substring(5, game.indexOf(":"))), 
        rounds: game.substring(game.indexOf(":") + 1, game.length)
                    .trim()
                    .split(';')
                    .map(r => r.split(',').map( (set) => Object.assign( {}, { 
                        amount: parseInt(set.trim().split(' ')[0]), 
                        colour: set.trim().split(' ')[1] 
                    } ) ) )  
    }))
    .map( game => Object.assign( game, { red:0, green:0, blue:0 }) )
    .map( game => {
            game.rounds.forEach(round => round.forEach(set => game[set.colour] = set.amount > game[set.colour] ? set.amount : game[set.colour] ) )
            return game;
        }
    )
    .reduce((acc, val) => acc + (val.red * val.green * val.blue), 0)
);
