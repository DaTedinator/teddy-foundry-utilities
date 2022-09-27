const clockData = await tfu.data.get("Clocks")

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

console.log(clockData)

if (clockType === "All") {
    console.log("Not doing that yet, sorry")
} else {
    for (const [title,clock] of Object.entries(clockData[clockType])) {
        console.log(clock)
        ChallengeTracker.open({...clock, id:undefined, persist:true});
    }
}

clockData[clockType] = {};

tfu.data.record(clockData, true, "Clocks");