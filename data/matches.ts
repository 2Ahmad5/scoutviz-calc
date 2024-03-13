const basePath = './frc_data/hopper_qual_data.csv'
// const basePath = './frc_data/all_qual_data.csv'

const year = '2023'
const events = ['hop']
// const events = ['joh', 'cur', 'arc', 'mil', 'new']

let csv = "red_1,red_2,red_3,blue_1,blue_2,blue_3,win\n";

for (const event of events) {

    const re = await fetch(`https://api.statbotics.io/v3/matches?event=${year + event}`);

    const response:any = await re.json();
    
    for (const event of response){
        const red1 = event.alliances.red.team_keys[0];
        const red2 = event.alliances.red.team_keys[1];
        const red3 = event.alliances.red.team_keys[2];
        const blue1 = event.alliances.blue.team_keys[0];
        const blue2 = event.alliances.blue.team_keys[1];
        const blue3 = event.alliances.blue.team_keys[2];
        const win = event.result.winner
        csv += `${red1},${red2},${red3},${blue1},${blue2},${blue3},${win}\n`
    }

}
await Bun.write(basePath, csv)
