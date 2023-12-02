// Flexing with a one-liner
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
        .filter(game => game.rounds.every(round => round.every(set => set.amount <= { 'red': 12, 'green': 13, 'blue': 14 }[set.colour] ) ) )
        .reduce((acc, val) => acc + val.id, 0)
);