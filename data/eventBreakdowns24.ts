const basePath = './frc_data/events_2024.csv'

const year = '2024'
const events = ['oktu', 'mndu2', 'paca', 'utwv', 'tuis', 'brbr', 'mxmo', 'casj', 'caph', 'mose', 'qcmo']

// const events = ['joh', 'cur', 'arc', 'mil', 'new']


const teamLimit = 10

let csv = "team,auto_leave_points,auto_notes,amp_notes,speaker_notes,amplified_notes,endgame_park_points,endgame_harmony_points,endgame_trap_points,rank\n"

for (const event of events){

    const re = await fetch(`https://api.statbotics.io/v3/team_events?event=${year + event}&metric=rank&ascending=true&limit=${teamLimit}`);

    const response: any = await re.json();

    // const path = `${basePath + year + event}.csv`

    for (const team of response) {
        const teamNm = team.team;
        const aut_leave = team.epa.breakdown.auto_leave_points.mean;
        const a_n = team.epa.breakdown.auto_notes.mean;
        const amp_notes = team.epa.breakdown.amp_notes.mean;
        const spk_notes = team.epa.breakdown.speaker_notes.mean;
        const amplif_notes = team.epa.breakdown.amplified_notes.mean;
        const eg_p_points = team.epa.breakdown.endgame_park_points.mean;
        const eg_har_pts = team.epa.breakdown.endgame_harmony_points.mean;
        const eg_trap_pts = team.epa.breakdown.endgame_trap_points.mean;
        const rank = team.record.qual.rank
        csv += `${teamNm},${aut_leave},${a_n},${amp_notes},${spk_notes},${amplif_notes},${eg_p_points},${eg_har_pts},${eg_trap_pts},${rank}\n`

    }

}

await Bun.write(basePath, csv)

/*
    Target Data?
        auto_leave_points,
        auto_notes,
                        teleop_notes,
        amp_notes,
        speaker_notes,
        amplified_notes,
        endgame_park_points,
                        endgame_on_stage_points,
        endgame_harmony_points,
        endgame_trap_points,
                        endgame_spotlight_points,

*/

/*
    ALL DATA:
        "total_points"
        "auto_points"
        "teleop_points"
        "endgame_points"
        "melody_rp"
        "harmony_rp"
        "tiebreaker_points"
        "auto_leave_points"
        "auto_notes"
        "auto_note_points"
        "teleop_notes"
        "teleop_note_points"
        "amp_notes"
        "amp_points"
        "speaker_notes"
        "speaker_points"
        "amplified_notes"
        "total_notes"
        "total_note_points"
        "endgame_park_points"
        "endgame_on_stage_points"
        "endgame_harmony_points"
        "endgame_trap_points"
        "endgame_spotlight_points"

*/
