import { utilities as tfu } from "../utilities.mjs";
import { data } from "../data.mjs";
import { npc } from "../npc.mjs";
import { pronoun } from "../pronoun.mjs";
import { rollResults, heistDeck } from "./bitd_data.mjs"

const npcVitalDetails = [
    "Age",
    "Gender",
    "Sexuality",
    "Hair",
    "Facial Hair",
    "Heritage",
    "Tycherosi Tell",
    "Skin",
    "Clothing",
    "First Look",
]

const npcTables = {
    "Name": ["Given Name", "Surname"],
    "Role":"Profession",
    "Age":true,
    "Gender":true,
    "Sexuality":true,
    "Hair": ["Hair", "Hair Color"],
    "Facial Hair": {
        "odds": .35,
        "conditions": {
            "Gender": {
                "not": "Woman"
            }
        }
    },
    "Heritage":true,
    "Tycherosi Tell": {
        "table": "Demon Feature",
        "conditions": {
            "Heritage": {
                "is":"Tycheros"
            }
        }
    },
    "Skin":true,
    "Clothing": true,
    "First Look":true,
    "Goal":"Character Goal",
    "Background":"Profession",
    "Trait":true,
    "Revealed Aspect":true,
    "Preferred Method":true
}

function pickOptions(optionList="rewards", totalValue=2, maxOverflow=1) {
    const optionObject = typeof optionList === "string" ? rollResults[optionList] : undefined;

    if (totalValue === 0) return false;

    if (optionList === undefined) {
        console.log("Error! pickOutcomes doesn't have a key!")
        return undefined;
    }

    const optionArray = [];
    let objectHasBaseAndRewardCategories = !!optionObject.base;
    
    for (let i = 0; i < totalValue;) {
        let options = optionObject;
        if (objectHasBaseAndRewardCategories) {
            options = optionArray.length === 0 ? options.base : tfu.getRandomElement(options);
        }

        const pick = tfu.weightedSelect(options);

        if (pick.unique) {
            delete optionObject[pick.key];
        }

        if (pick.value > totalValue + maxOverflow) {
            delete optionObject[pick.key];
        } else {
            optionArray.push(pick);
            i += pick.value;
        }

        if (Object.keys(options).length === 0) {
            console.log("pickOptions ran out of options to pick!");
            break;
        }
    }

    const textArray = [`<h3>${tfu.makePretty(optionList)}</h3>`];

    if (optionArray.length <= 0) {
        switch (optionList) {
            case "rewards":
                textArray.push("<p>Unfortunately, not much good happens.</p>");
                break;
            case "penalties":
                textArray.push("<p>Luckily, not much bad happens.</p>");
                break;
            case "chaos":
                textArray.push("<p>Oddly, not much happens.</p>");
                break;
        }
    } else {
        textArray.push("<ul>");
        for (const option of optionArray) {
            textArray.push(`\t<li>${option.text}</li>`);
        }
        textArray.push("</ul>");
    }

    return textArray.join("\n");
}

function interpretRollResult(position, effect, result) {
    let rewardValue = 0, penaltyValue = 0;
    let chaosValue = Math.random() > 0.75 ? 1 : 0;
    let rewardOverflow = 1, penaltyOverflow = 1, flukeOverflow = 0;

    switch (effect) {
        case "Extreme":
            rewardValue++;
        case "Great":
            rewardValue++;
        case "Standard":
            rewardValue++;
        case "Limited":
            rewardValue++;
        case "Zero":
            break;
    }

    switch (position) {
        case "Desperate":
            penaltyValue++;
        case "Risky":
            penaltyValue++;
        case "Controlled":
            penaltyValue++;
            break;
    }

    switch (result) {
        case "Critical":
            rewardValue++;
            rewardOverflow++;
        case "Success":
            penaltyValue = 0;
            break;
        case "Partial":
            let reduction = tfu.getRandomInt(Math.min(rewardValue, penaltyValue))
            rewardValue -= reduction;
            penaltyValue -= reduction;
            break;
        case "Failure":
            rewardValue = 0;
            if (position === "Desperate") penaltyOverflow++;
            break;
    }

    const rewards = pickOptions("rewards", rewardValue, 1), 
          penalties = pickOptions("penalties", penaltyValue, 1), 
          chaos = pickOptions("chaos", chaosValue, 0);

    const textArray = ["<br>"];
    if (!!rewards) textArray.push(rewards);
    if (!!penalties) textArray.push(penalties);
    if (!!chaos) textArray.push(chaos);

    const text = textArray.join("\n");

    return text;
}

function editRoll(message, html, data) {
    let content = message.content;
    
    const position = content.split(" | ")[0].split("\n").slice(-1)[0].trim();
    if (!["Controlled","Risky","Desperate"].includes(position)) return;
    const effect = content.split(" | ")[1].split("\n")[0];
    const result = tfu.lazyTitleCase(content.split("class=\"die ")[1].split("\"")[0].split("-")[0])

    const newContent = [
        content.split("<p>")[0],
        content.split("</p>")[1].split("</ol>")[0],
        "</ol>",
        interpretRollResult(position, effect, result)
    ];

    message.update({content:newContent.join("\n")});
}

async function generateJob(jobStructure, maxTier=100, minTier=-1, maxLoops=20) {
    for (let i = 1; i <= maxLoops; i++) {
        const d = {...jobStructure};
        
        const factions = await data.get("Factions");

        for (const key in d) {
            if (typeof d[key] === "string") {
                d[key] = await tfu.rollTableNamed(d[key]);
            } else if (d[key] === null) {
                delete d[key];
            }
        }

        d.active = false;
        d.time = tfu.getRandomInt(10,1),
        d.length = tfu.getRandomElement([1,1,1,1,1,1,1,1,2,3])
        d.important = !!d.faction1 ? ((Math.random() > 0.8) ? true : false) : false;
        if (d.connection === "Doskvol Notable") d.notable = `${await tfu.rollTableNamed("Doskvol Notable"," ")}`
        const tierFactionName = d.faction1 || d.faction2 || false;
        const tierFaction = factions.find(faction => {
            return (faction.name.includes(tierFactionName) || tierFactionName.includes(faction.name))
        });
        d.tier = !!tierFaction ? tierFaction.tierSort : tfu.getRandomInt(4);
        d.tier += tfu.getRandomInt(1,-1);
        if (d.tier > 6) d.tier = i === maxLoops ? maxTier : 6;
        if (d.tier < 0) d.tier = i === maxLoops ? minTier : 0;
        if (d.tier > maxTier || d.tier < minTier) continue;
        d.length 
        d.name = `${d.work} for ${d.client} (Tier ${d.tier}, ${d.lengthText})`;
        //Rewards
        d.coin = (d.tier * 2) + tfu.getRandomInt(2,-2);
        d.bonusReward = Math.random() > 0.7 ? true : false;
        if (d.bonusReward) {
            d.bonusReward = tfu.getRandomElement([
                "Turf",
                "Turf",
                "Turf",
                "a Rare Item",
                "a High-Quality Item",
                "Unusual"
            ]);
            if (d.bonusReward === "Unusual") {
                d.bonusReward = tfu.getRandomElement([
                    "Formulas, Plans, or Rituals",
                    "6 Ticks on a Long-Term Project",
                    "a Particularly Useful Contact",
                    "Extra Faction Rep",
                    "Crew Upgrade(s)",
                    "A Bonus Crew Ability"
                ]);
            }

            d.coin -= d.tier;
            d.coin -= tfu.getRandomInt(2,0);
        }
        if (d.coin < 1) d.coin = 2;

        return d;
    }
    console.log(`Something has gone horribly wrong with generateJob; check your maxTier and minTier!`)
    return false;
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
    `The job is Tier <strong>${d.tier}</strong>, and pays <strong>${d.coin} coin</strong>` +
    (!!d.bonusReward ? `; plus, it offers <strong>${d.bonusReward}</strong>. ` : `. `) + 
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

    return await journal.createEmbeddedDocuments("JournalEntryPage",[{
        name:d.name, 
        type:"text", 
        text:{
            content: jobDesc
        }
    }])[0];
}

async function generateJobJournal(jobDataArray, journal) {
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
        await generateJobPage(job, journal);
    }
}

async function generateJobs(journalOrJournalName, jobStructure, jobsToMake=1, timeToAdvance=0, maxTier=100, minTier=-1) {
    const journalName = typeof journalOrJournalName === "string" ? journalOrJournalName : journalOrJournalName.name;
    const journal = typeof journalOrJournalName === "object" ? journalOrJournalName : await tfu.GuaranteedGetThingOfTypeByKeys("journals",{name:journalName});

    let jobDataArray = await data.get(journalName);
    if (jobDataArray === undefined || Array.isArray(jobDataArray) === false) jobDataArray = [];

    let jobsToRemove = [];

    for (let i = 0; i < jobDataArray.length; i++) {
        const job = jobDataArray[i];
        job.time -= timeToAdvance;

        if (job.time < 1) {
            jobsToRemove.push(i)
            //jobDataArray.splice(i,1);
        };

        let content = false;
        if (job.important) {
            if (job.time == 1) {
                content = `Almost out of time to complete ${job.name} for ${job.faction1}!`;
            } else if (job.time < 1) {
                content = `${job.name} expired! ${job.faction1} may be unhappy!`;
            }
        }
    }

    jobsToRemove = new Set(jobsToRemove);

    jobDataArray = jobDataArray.filter((value, i) => !jobsToRemove.has(i));

    for (let i = 0; i < jobsToMake; i++) {
        jobDataArray.push(await generateJob(jobStructure, maxTier, minTier));
    }
    await data.record(jobDataArray, true, journalName);

    await generateJobJournal(jobDataArray, journal);
}

async function generateNPC(predeterminedDetails={}, vitalDetails=undefined, tables=undefined) {
    vitalDetails = vitalDetails || npcVitalDetails;
    tables = tables || npcTables;

    let folder = "Generated NPCs"
    
    let npcDetails = await npc.generateDetails(tables, predeterminedDetails);
    
    return npc.makeNPC(`${folder}##${npcDetails.Name}`, npcDetails, vitalDetails, generateBiography(npcDetails));
}

function generateBiography(d={}, plaintext=true) {
    const p = pronoun.getPronouns(d.Gender);
    
    const vowels = ["a","e","i","o","u"];

    let description = [];

    description.push(`${d.Name} is ${vowels.includes(d["First Look"][0].toLowerCase()) ? "an" : "a"} ${d["First Look"].toLowerCase()} ${d.Role.toLowerCase()} from ${d.Heritage}.`);

    description.push(`${p.They} ${p.they == "they" ? "want" : "wants"} to ${d.Goal.toLowerCase()}, and ${p.they == "they" ? "are" : "is"} likely to use ${d["Preferred Method"].toLowerCase()} to achieve it. While in typical situations ${p.they} can be ${d.Trait.toLowerCase()}, under pressure ${p.they} ${p.they == "they" ? "are" : "is"} revealed to be ${d["Revealed Aspect"].toLowerCase()}.`);

    if (plaintext) return description.join("\n\n");
    return "<p>" + description.join("</p>\n\n<p>") + "</p>";
}

async function generateClockActor(name, size=4, type="job", subtype="good", startFull=false) {
    if (name === "") name = "Clock";

    size = parseInt(size);

    if (![4,6,8,10,12].includes(size)) {
        console.log(`ERROR: generateClock was passed an incorrect size (${size}).`)
        size = 4;
    }
    const progress = startFull ? size : 0;

    let color = "yellow",
        folder = "Other";

    switch(type) {
        case "job":
            switch (subtype) {
                case "good":
                    color = "blue";
                    break;
                case "bad":
                    color = "red";
                    break;
                case "neutral":
                    color = "yellow";
                    break;
                default:
                    color = "green";
                    break;
            }
            folder = "Job"
            break;
        case "long-term project":
            color = "green";
            folder = "Projects"
            break;
        default:
            break;
    }

    const clockActor = await Actor.create({
        name: ["Clocks",folder,name].join("##"),
        type: "\uD83D\uDD5B clock",
        img: `systems/scum-and-villainy/themes/${color}/${size}clock_${progress}.webp`,
        token: {
            name: name,
            img: `systems/scum-and-villainy/themes/${color}/${size}clock_${progress}.webp`,
            scale: 1,
            disposition: 0,
            displayName: 50,
            actorLink: true,
            flags: {
                "teddy-foundry-utilities": {
                    "clockType": type,
                    "clockSubtype": subtype,
                    "startedFull": startFull
                }
            }
        },
            flags: {
                "scum-and-villainy": {
                    "clocks": {
                    "progress": progress,
                    "size": size,
                    "theme": color
                },
                "teddy-foundry-utilities": {
                    "clockType": type,
                    "clockSubtype": subtype,
                    "startedFull": startFull
                }
            }
        },
    });

    tfu.organize("actors","##");

    return clockActor;
}

async function generateClockToken(clockActor, clockZones={}) {
    const scene = canvas.scene,
          sceneName = scene.name;
          sceneWidth = Math.floor(scene.width*(1+scene.padding)),
          sceneHeight = Math.floor(scene.height*(1+scene.padding)),
          sceneCenterX = Math.floor(sceneWidth/2 - scene.grid.size/2),
          sceneCenterY = Math.floor(sceneHeight/2 - scene.grid.size/2);

    const sceneTokens = scene.tokens.contents,
          clockTokens = sceneTokens.filter(token.getFlag("teddy-foundry-utilities",clockType) !== undefined);

    const clockType = clockActor.getFlag("teddy-foundry-utilities","clockType"),
          clockSubtype = clockActor.getFlag("teddy-foundry-utilities","clockSubtype") || "Default",
          clockFullType = `${clockType} / ${clockSubtype}`;
    
    if (clockZones[clockFullType] === undefined) {
        await canvas.scene.createEmbeddedDocuments("Token",[await clockActor.getTokenData({x:sceneCenterX,y:sceneCenterY})]) 
    } else {
        let clockX = 0,
            clockY = 0;
    }
}

export const fitd = {
    npcTables:npcTables,
    npcVitalDetails:npcVitalDetails,
    rollResults:rollResults,
    heistDeck:heistDeck,

    pickOptions:pickOptions,
    interpretRollResult:interpretRollResult,
    editRoll:editRoll,
    generateBiography:generateBiography,
    generateJob:generateJob,
    generateJobPage:generateJobPage,
    generateJobJournal:generateJobJournal,
    generateJobs:generateJobs,
    generateNPC:generateNPC,
    generateClockActor:generateClockActor,
    generateClockToken:generateClockToken
}