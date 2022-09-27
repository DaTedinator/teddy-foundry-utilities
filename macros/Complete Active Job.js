const jobData = await tfu.data.get("Jobs");
const journalName = "Jobs"
const journal = await tfu.GuaranteedGetThingOfTypeByKeys("journals",{name:journalName});

for (let i = 0; i < jobData.length; i++) {
    const job = jobData[i];

    if (job.active) {
        jobData.splice(i,1)
    }
}

generateJobJournal(jobData, journal);

function generateJobJournal(jobDataArray, journal) {
    for (const page of journal.pages.contents) {
        page.delete();
    }

    jobDataArray.sort((a,b) => {
        if (
            typeof a !== "object" || 
            typeof b !== "object" || 
            typeof a.time !== "number" || 
            typeof b.time !== "number"
        ) {
            return 0;
        }

        return a.time - b.time;
    })

    for (const job of jobDataArray) {
        generateJobPage(job, journal);
    }
}

async function generateJobPage(d, journal) {
    const vowels = [
        "a","e","i","o","u",
        "A","E","I","O","U"
    ]

    let jobDesc = `<p>` + 
    `The job is to <strong>${d.work}</strong> ${vowels.includes(d.target[0]) ? "an" : "a"} <strong>${d.target}</strong>` + 
    (!!d.backupWork ? ` but you could <strong>${d.backupWork}</strong> them as an alternative. ` : `. `) +
    (!!d.twist ? `Complicating this is the fact that <strong>${d.twist}</strong>. ` : ``) +
    `The client is ${vowels.includes(d.client[0]) ? "an" : "a"} <strong>${d.client}</strong>` + 
    (!!d.faction1 ? ` with <strong>${d.faction1}</strong>. ` : `. `) +
    `The job is in <strong>${d.district}</strong>` + 
    (!!d.location ? ` and is located at ${vowels.includes(d.location[0]) ? "an" : "a"} <strong>${d.location}</strong>. ` : `. `) +
    (!!d.notable ? `You got the job through <strong>${d.notable}</strong>. ` : ``) +
    ((!d.notable && !!d.connection) ? `You got the job through ${vowels.includes(d.connection[0]) ? "an" : "a"} <strong>${d.connection}</strong>. ` : ``) +
    (!!d.faction2 ? `Doing the job is likely to make <strong>${d.faction2}</strong> unhappy. ` : ``) +
    (!!d.faction3 ? `<strong>${d.faction3}</strong> is likely to make an appearance, to unknown ends. ` : ``) +
    `</p>\n<p>` +
    `The job expires in <strong>${d.time} Job${d.time > 1 ? "s" : ""}</strong>.` +
    `</p>`

    const jobPage = await journal.createEmbeddedDocuments("JournalEntryPage",[{
        name:d.name, 
        type:"text", 
        text:{
            content: jobDesc
        }
    }])[0];

    console.log(jobPage);
}