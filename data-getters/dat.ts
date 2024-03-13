const basePath = './frc_data/data.csv'

const year = '2023'
// const events = ['utwv', 'okok', 'flor', 'wimi', 'caav', 'tuis2', 'mokc', 'ilpe', 'dal', 'arc', 'mil', 'joh', 'new', 'cur', 'hop']

const events = ['joh', 'cur', 'arc', 'mil', 'new']


const teamLimit = 10

let csv = "team,auto_charge_station_points,auto_grid_points,cube_points,cone_points,endgame_charge_station_points,rank\n"


for (const event of events){

    const re = await fetch(`https://api.statbotics.io/v3/team_events?event=${year + event}&metric=rank&ascending=true&limit=${teamLimit}`);

    const response = await re.json();

    // const path = `${basePath + year + event}.csv`

    //@ts-ignore
    for (const team of response) {
        const teamNm = team.team;
        const a_c_s_p = team.epa.breakdown.auto_charge_station_points.mean;
        const a_g_p = team.epa.breakdown.auto_grid_points.mean;
        const c_p = team.epa.breakdown.cube_points.mean;
        const co_p = team.epa.breakdown.cone_points.mean;
        const e_c_s_p = team.epa.breakdown.endgame_charge_station_points.mean;
        const rank = team.record.qual.rank
        csv += `${teamNm},${a_c_s_p},${a_g_p},${c_p},${co_p},${e_c_s_p},${rank}\n`

    }

}

await Bun.write(basePath, csv)
