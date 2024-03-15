const normalized = true;
const year = '2024'
// const events = ['oktu', 'mndu2', 'paca', 'utwv', 'tuis', 'brbr', 'mxmo', 'casj', 'caph', 'mose', 'qcmo'];
// const events = ['tuis2', 'cave', 'nysu', 'ndgf', 'arli', 'tnkn'];
const events = ['bcvi']

const teamLimit = 100

const basePath = `./frc_data/2024/casf_${normalized ? "norm_" : ""}test_2024.csv`

let csv = "";

if (normalized) {
    csv = `team,norm_auto_leave_points,norm_auto_note_points,norm_speaker_amplified_points,norm_speaker_unamplified_points,norm_amp_points,norm_endgame_park_points,endgame_trap_points,rank\n`

} else {
    csv = `team,auto_leave_points,auto_note_points,speaker_amplified_points,speaker_unamplified_points,amp_points,endgame_park_points,endgame_trap_points,rank\n`
}

var team_ls: any[] = []
var aut_leave_ls: number[] = []
var aut_note_pts_ls: number[] = []
var spk_mplif_tele_pts_ls: number[] = []
var spk_unmpl_tele_pts_ls: number[] = []
var amp_pts_ls: number[] = []
var eg_p_points_ls: number[] = []
var eg_trap_pts_ls: number[] = []
var rank_ls: any[] = []



for (const event of events) {

    const re = await fetch(`https://api.statbotics.io/v3/team_events?event=${year + event}&metric=rank&ascending=true&limit=${teamLimit}`);

    const response: any = await re.json();    

    for (const team of response) {
        const spk_notes = parseFloat(team.epa.breakdown.speaker_notes.mean);
        const amplif_notes = parseFloat(team.epa.breakdown.amplified_notes.mean);
        const tele_notes = parseFloat(team.epa.breakdown.teleop_notes.mean);
        const ratio_spk_notes = spk_notes / (amplif_notes + spk_notes);

        if(normalized) {
            team_ls.push(team.team);
            aut_leave_ls.push(team.epa.breakdown.auto_leave_points.mean);
            aut_note_pts_ls.push(team.epa.breakdown.auto_note_points.mean);
            spk_mplif_tele_pts_ls.push((amplif_notes * 5));
            spk_unmpl_tele_pts_ls.push((ratio_spk_notes * (tele_notes - amplif_notes) * 2));
            amp_pts_ls.push(team.epa.breakdown.amp_points.mean);
            eg_p_points_ls.push(team.epa.breakdown.endgame_park_points.mean);
            eg_trap_pts_ls.push(team.epa.breakdown.endgame_trap_points.mean);
            rank_ls.push(team.record.qual.rank)
        } else {
            const team_name = team.team;
            const aut_leave = team.epa.breakdown.auto_leave_points.mean;
            const aut_note_pts = team.epa.breakdown.auto_note_points.mean;
            const spk_mplif_tele_pts = (amplif_notes * 5);
            const spk_unmpl_tele_pts = (ratio_spk_notes * (tele_notes - amplif_notes) * 2);
            const amp_pts = team.epa.breakdown.amp_points.mean;
            const eg_p_points = team.epa.breakdown.endgame_park_points.mean;
            const eg_trap_pts = team.epa.breakdown.endgame_trap_points.mean;
            const rank = team.record.qual.rank;

            csv += `${team_name},${aut_leave},${aut_note_pts},${spk_mplif_tele_pts},${spk_unmpl_tele_pts},${amp_pts},${eg_p_points},${eg_trap_pts},${rank}\n`
        }
    }
}


if (normalized) {
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
