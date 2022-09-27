const allClocks = game.user.data.flags["challenge-tracker"];

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
    },
    All:{
        type:"button"
    }
});

const clockType = choice.button;

if (clockType === "All") {
    for (const [id,clock] of Object.entries(allClocks)) {
        ChallengeTracker.open(clock);
    }
} else {
    for (const [id,clock] of Object.entries(allClocks)) {
        if(clock.title.includes(`${clockType}:`)) ChallengeTracker.open(clock);
    }
}