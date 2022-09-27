let jobData = await tfu.data.get("Jobs");
let jobNames = [];

for (const job of jobData) {
    jobNames.push(job.name);
}

let jobName = (await tfu.dialog.choice("Activate Job", {
    "Choose a Job": {
        type:"heading",
        headingLevel:2
    },
    job: {
        type:"dropdown",
        options: jobNames
    }
})).job;

const jobIndex = jobData.findIndex(job => job.name === jobName);

jobData[jobIndex].active = true;

tfu.data.record(jobData, true, "Jobs");