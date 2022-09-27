const choices = await tfu.dialog.choice("", {
    "How many jobs should be generated?": {
        type:"number",
        headingLevel:2,
        value:1
    },
    "Advance Time By": {
        type:"number",
        headinglevel:3,
        value:0
    },
    "Tier Limits": {
        type:"heading",
        headingLevel:2
    },
    maxTier: {
        type:"number",
        headingLevel:0,
        value:5
    },
    minTier: {
        type:"number",
        headingLevel:0,
        value:0
    }
})

const jobsToMake = choices["How many jobs should be generated?"],
      advance = choices["Advance Time By"],
      maxTier = choices.maxTier,
      minTier = choices.minTier;

const journalName = "Jobs";

const jobStructure = {
    client:"Client/Target",
    target:"Client/Target",
    twist:((Math.random() > 0.7) ? "Twist or Complication" : null),
    work:"Work",
    backupWork:((Math.random() > 0.6) ? "Work" : null),
    connection:((Math.random() > 0.3) ? "Connection" : null),
    district:"District",
    location:((Math.random() > 0.6) ? "Location Type" : null),
    faction1:((Math.random() > 0.1) ? "Faction" : null),
    faction2:((Math.random() > 0.4) ? "Faction" : null),
    faction3:((Math.random() > 0.7) ? "Faction" : null),
    length:tfu.getRandomInt(3,1)
}

console.log(jobStructure);

await tfu.fitd.generateJobs(journalName, jobStructure, jobsToMake, advance, maxTier, minTier);