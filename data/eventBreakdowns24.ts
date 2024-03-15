const basePath = './frc_data/events_2024.csv'

const year = '2024'
const events = ['oktu', 'mndu2', 'paca', 'utwv', 'tuis', 'brbr', 'mxmo', 'casj', 'caph', 'mose', 'qcmo']

// const events = ['joh', 'cur', 'arc', 'mil', 'new']


const teamLimit = 10

// let csv = "team,auto_leave_points,auto_notes,amp_notes,speaker_notes,amplified_notes,endgame_park_points,endgame_harmony_points,endgame_trap_points,rank\n"

let csv = `team,norm_auto_leave_points,norm_auto_note_points,norm_speaker_amplified_points,norm_speaker_unamplified_points,norm_amp_points,norm_endgame_park_points,endgame_trap_points,rank\n`
let team_ls: any[] = []
let aut_leave_ls: number[] = []
let aut_note_pts_ls: number[] = []
let spk_mplif_tele_pts_ls: number[] = []
let spk_unmpl_tele_pts_ls: number[] = []
let amp_pts_ls: number[] = []
let eg_p_points_ls: number[] = []
let eg_trap_pts_ls: number[] = []
let rank_ls: any[] = []


for (const event of events) {

    const re = await fetch(`https://api.statbotics.io/v3/team_events?event=${year + event}&metric=rank&ascending=true&limit=${teamLimit}`);

    const response: any = await re.json();

    // const path = `${basePath + year + event}.csv`
    

    for (const team of response) {
        const spk_notes = parseFloat(team.epa.breakdown.speaker_notes.mean);
        const amplif_notes = parseFloat(team.epa.breakdown.amplified_notes.mean);
        const tele_notes = parseFloat(team.epa.breakdown.teleop_notes.mean);
        const ratio_spk_notes = spk_notes / (amplif_notes + spk_notes);

        team_ls.push(team.team);
        
        aut_leave_ls.push(team.epa.breakdown.auto_leave_points.mean);
        aut_note_pts_ls.push(team.epa.breakdown.auto_note_points.mean);
        spk_mplif_tele_pts_ls.push((amplif_notes * 5));
        spk_unmpl_tele_pts_ls.push((ratio_spk_notes * (tele_notes - amplif_notes) * 2));
        amp_pts_ls.push(team.epa.breakdown.amp_points.mean);
        eg_p_points_ls.push(team.epa.breakdown.endgame_park_points.mean);
        eg_trap_pts_ls.push(team.epa.breakdown.endgame_trap_points.mean);
        
        rank_ls.push(team.record.qual.rank)
    }
}

let all: number[][] = [aut_leave_ls, aut_note_pts_ls, spk_mplif_tele_pts_ls, spk_unmpl_tele_pts_ls, amp_pts_ls, eg_p_points_ls, eg_trap_pts_ls]


for (const category of all) {
    const max:number = Math.max(...category);
    for (let number = 0; number < category.length; number++) {
        category[number] = category[number] / max;
    }
}

for (let index = 0; index < team_ls.length; index++) {
    csv += `${team_ls[index]},${all[0][index]},${all[1][index]},${all[2][index]},${all[3][index]},${all[4][index]},${all[5][index]},${all[6][index]},${rank_ls[index]}\n`
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
