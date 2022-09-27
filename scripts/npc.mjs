import { utilities as tfu } from "./utilities.mjs";
import { pronoun } from "./pronoun.mjs";

export const npc = {
    async makeNPC (name, detailArray, vitalDetails=undefined, biography=undefined, type="npc") {
        if (vitalDetails === undefined) {
            vitalDetails = [
                "Full Name",
                "Role",
                "Age",
                "Gender",
                "Sexuality",
                "Hair",
                "Facial Hair"
            ];
        }

        switch (type) {
            case "npc": {
                return await Actor.create({
                    name:name,
                    type:"npc",
                    system:{
                        description_short: detailArray.Role || detailArray.role || "",
                        description: this.makeVitals(detailArray, vitalDetails, true),
                        notes:biography || "",
        
                        associated_class: detailArray.class || "",
                        associated_crew_type: detailArray.crew || "",
                        associated_faction: detailArray.faction || ""
                    }
                })
            }
            case "journal": {
                return await tfu.makeJournalWithPages(
                    name, 
                    {
                        name:"Vitals", 
                        type:"text", 
                        text:{
                            content: this.makeVitals(detailArray, vitalDetails)
                        }
                    }, 
                    {
                        name:"Biography", 
                        type:"text", 
                        text:{
                            content: biography || ""
                        }
                    },
                    {
                        name:"Portrait", 
                        type:"image"
                    }
                )
            }
            default: { //"JournalPage"
                const journal = await tfu.GuaranteedGetThingOfTypeByKeys("journals", {name:type});
                await journal.createEmbeddedDocuments("JournalEntryPage",[{
                    name: name, 
                    type: "text", 
                    text:{
                        content: (this.makeVitals(detailArray, vitalDetails) + (biography || ""))
                    }
                }])

                return journal;
            }
        }
    },

    async generateDetails(tables={}, presetDetails={}) {
        tables = {...tables};
        const details = {...presetDetails};
        let [loopCount, maxLoops] = [0, 100];

        while (Object.keys(tables).length > 0 && loopCount < maxLoops) {
            loopCount++;

            for (const [detail, options] of Object.entries(tables)) {
                
                let table = this.prereqCheck(detail, options, details);

                switch (table) {
                    default:
                        if (Array.isArray(table)) {
                            let result = [];
                            for (const subtable of table) {
                                result.push(await tfu.rollTableNamed(subtable, " "))
                            }
                            details[detail] = result.join(" ");
                        } else if (typeof table === "string") {
                            details[detail] = await tfu.rollTableNamed(table, " ");
                        } else {
                            console.log(`Something has gone horribly wrong! ${table} isn't a valid table for ${detail}!`);
                            delete tables[detail];
                        }
                    case false:
                        delete tables[detail];
                        break;
                    case undefined:
                        break;
                }
            }
        }

        return details;
    },

    prereqCheck(detail, options, details) {
        //If the detail already exists, it's been predetermined; we don't want this random one.
        if (details[detail] !== undefined) return false;

        //Details that are just named after their table with no other requirements are set to true
        if (options === true) return detail;

        //Details that just have a set table (or tables) to roll with no other requirements are set to the table name
        if (typeof options === "string" || Array.isArray(options)) return options;

        const odds = options.odds || 1,
              conditions = options.conditions;
        
        //If there's a table name listed, use that, otherwise the detail name
        let table = options.table || detail; 

        if (!!conditions) { //If we have conditions

            //If we haven't determined all of the required details, skip it for now.
            //There's definitely a better way of doing this that doesn't require full loops
            const nondetails = [
                "or",
                "and",
                "is",
                "not",
                "above",
                "below"
            ];

            let prereqs = tfu.getAllKeys(conditions).filter(key => {return !(nondetails.includes(key))});
            for (const prereq of prereqs) {
                if (details[prereq] === undefined) return undefined;
            }

            for (const [detail, condition] of Object.entries(conditions)) {
                if (this.conditionCheck(detail, condition, details) === false) return false;
            }
        }

        return Math.random() > odds ? false : table; //Random chance against the odds that we skip this attribute.
    },

    /**
     * Checks a detail against the given condition
     * 
     * @param {string} detail - the name of a detail to check the value of
     * @param {object} condition - an object with the comparisons
     * @param {object} details  - an object with all currently determined details
     * @returns {Boolean} true if the detail passes, false if it fails.
     */
    conditionCheck(detail, condition, details) {
        let pass;

        switch(detail) {
            case "or":
                pass = false;
                for (const [detail, condition] of Object.entries(condition)) {
                    pass = pass || this.conditionCheck(detail, condition, details);
                }
                break;
            case "and":
                pass = true;
                for (const [detail, condition] of Object.entries(condition)) {
                    pass = pass && this.conditionCheck(detail, condition, details);
                }
                break;
            default:
                pass = true;
                for (const [comparison, value] of Object.entries(condition)) {
                    switch(comparison) {
                        case "is":
                            pass = pass && details[detail] == value;
                            break;
                        case "not":
                            pass = pass && details[detail] != value;
                            break;
                        case "above":
                            pass = pass && details[detail] > value;
                            break;
                        case "below":
                            pass = pass && details[detail] < value;
                            break;
                    }
                }
        }

        return pass;
    },

    /**
     * Takes a list of key-value pairs and turns them into a pretty list of details.
     * ##TODO: some organization?
     * @param {object} details 
     * @returns {string} - html
     */
    makeVitals(details={}, vitalDetails=[], plaintext=false) {
        let html = [`<div style="margin:20px">`,`<p>`];
        let vitals = [];

        function makePrettyStrong(text, bool) {
            if (!bool) return `<strong>${tfu.makePretty(text)}</strong>`
            return `${tfu.makePretty(text)}`
        } 

        if (vitalDetails.length > 0) {
            for (const vital of vitalDetails) {
                if (!!details[vital]) {
                    vitals.push(`${makePrettyStrong(vital, plaintext)}: ${details[vital]}`)
                }
            }
        } else {
            for (const [detail, value] of Object.entries(details)) {
                vitals.push(`${makePrettyStrong(detail)}: ${value}`)
            }
        }

        vitals = plaintext ? vitals.join(`\n`) : vitals.join(`<br>\n`);
        html.push(vitals);
        html.push(`</p>`);
        html.push(`</div>`);

        if (plaintext) return vitals;
        return html.join("\n");
    },

    makeBiography(d={}, name=undefined) {
        const p = pronoun.getPronouns(d.Gender);
        name = !name ? d.Name || d.name : name;
        
        const vowels = ["a","e","i","o","u"];

        let description = [];

        description.push(`${name} is ${vowels.includes(d.firstlook[0].toLowerCase()) ? "an" : "a"} ${d.firstlook.toLowerCase()} ${d.role.toLowerCase()}.`);

        description.push(`${p.They} ${p.they == "they" ? "want" : "wants"} to ${d.goals.toLowerCase()}.`);

        return "<p>" + description.join("</p>\n\n<p>") + "</p>";
    }
}