const activeClocks = game.user.data.flags["challenge-tracker"];
const clockData = await tfu.data.get("Clocks") || {};

const choice = await tfu.dialog.choice("Which Clocks?", {
    Job:{
        type:"button"
    },
    Project:{
        type:"button"
    },
    World:{
        type:"button"
    },
    Other:{
        type:"button"
    }/*,
    All:{
        type:"button"
    }*/
});

const clockType = choice.button;

clockData[clockType] = clockData[clockType] || {};

for (const [id,clock] of Object.entries(activeClocks)) {
    console.log(clock);
    if (clock.title.includes(`${clockType}:`)) {
        console.log(true);
        ChallengeTracker.closeById(id);
        ChallengeTracker.deleteById(id);
        const [category, title] = clock.title.split(": ");
        clockData[category][title] = {...clock, id:undefined}
    }
}

tfu.data.record(clockData, true, "Clocks");