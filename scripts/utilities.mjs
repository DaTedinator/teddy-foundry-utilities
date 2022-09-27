export const utilities = {
    //#region searching

    /**
     * Gets all things of the given type that match the given keys.
     * 
     * @param {string} type - journals, actors, items, tables, or folders
     * @param {object} keys - key-value pairs to search for
     * 
     * @returns {[object]} - the found objects
     */
     getThingsOfTypeByKeys(type, keys={}) {
        // Type checking
        if (typeof type !== "string") {
            console.log(`${type} is not a string for getThingsOfTypeByKeys!`);
            return undefined;
        }

        //Clean up type, so we can accept stuff like "Actor" instead of only "actors"
        type = type[type.length-1] == "s" ? type.toLowerCase() : type.toLowerCase() + "s";

        switch (type) {
            default:
                console.log(`${type} is not a valid type for getThingsOfTypeByKeys!`);
                return undefined;
            case "journals":
                type = "journal";
                break;
            case "rolltables":
                type = "tables"
                break;
            case "actors":
            case "items":
            case "tables":
            case "folders":
            case "scenes":
                break;
        }

        //If the folder key is set to an id, get the actual folder it refers to.
        if (keys.folder !== undefined && typeof keys.folder === "string") {
            keys.folder = Folder.get(keys.folder);
        }

        const thingArray = game[type].contents.filter(thing => {
            for (const key in keys) {
                if (typeof keys[key] === "object") {
                    for (const subkey in keys[key]) {
                        if (thing[key][subkey] != keys[key][subkey]) return false;
                    }
                } else if (thing[key] != keys[key]) {
                    return false;
                }
            }
            return true;
        });
        
        return thingArray;
    },

    /**
     * Gets the first thing that matches the given keys.
     * 
     * @param {string} type - journals, actors, items, tables, or folders
     * @param {object} keys - key-value pairs to search for
     * 
     * @returns {object} - the found object, or null if such an object doesn't exist
     */
     getThingOfTypeByKeys(type, keys={}) {
        return this.getThingsOfTypeByKeys(type,keys)[0] || null;
    },

    /**
     * Gets the first thing that matches the given keys, or creates it if it doesn't exist.
     * 
     * @param {string} type - journals, actors, items, tables, or folders
     * @param {object} keys - key-value pairs to search for
     * 
     * @returns {object} - the found object
     */
    async GuaranteedGetThingOfTypeByKeys(type, keys={}) {
        let returnValue = this.getThingOfTypeByKeys(type, keys);

        if (returnValue !== null) return returnValue;

        // Type checking
        if (typeof type !== "string") {
            console.log(`${type} is not a string for GuaranteedGetThingOfTypeByKeys!`);
            return undefined;
        }

        type = type.toLowerCase();

        switch (type) {
            default:
                console.log(`${type} is not a valid type for GuaranteedGetThingOfTypeByKeys!`);
                return undefined;
            case "journals":
            case "journal":
                return await JournalEntry.create(keys);
            case "actors":
            case "actor":
                return await Actor.create(keys);
            case "items":
            case "item":
                return await Item.create(keys);
            case "tables":
            case "table":
                return await RollTable.create(keys);
            case "folders":
            case "folder":
                return await Folder.create(keys);
        }
    },

    /**
     * Gets all scene things of the given type that match the given keys.
     * 
     * @param {string} type - drawings, lights, notes, sounds, tiles, or tokens
     * @param {object} keys - key-value pairs to search for
     * @param {string} sceneName - The name of the scene the thing is on; uses the current scene if undefined
     * 
     * @returns {[object]} - the found objects
     */
     getSceneThingsOfTypeByKeys(type, keys={}, sceneName=undefined) {
        // Type checking
        if (typeof type !== "string") {
            console.log(`${type} is not a string for getSceneThingsOfTypeByKeys!`);
            return undefined;
        }

        //Clean up type, so we can accept stuff like "Actor" instead of only "actors"
        type = type[type.length-1] == "s" ? type.toLowerCase() : type.toLowerCase() + "s";

        switch (type) {
            default:
                console.log(`${type} is not a valid type for getSceneThingsOfTypeByKeys!`);
                return undefined;
            case "drawings":
            case "lights":
            case "notes":
            case "sounds": 
            case "tiles":
            case "tokens":
                break;
        }

        const scene = !!sceneName ? this.getThingOfTypeByKeys("scenes", {name:sceneName}) || canvas.scene : canvas.scene;

        if (scene === undefined) return null;

        const thingArray = scene.drawings.contents.filter(thing => {
            for (const key in keys) {
                if (typeof keys[key] === "object") {
                    for (const subkey in keys[key]) {
                        if (thing[key][subkey] != keys[key][subkey]) return false;
                    }
                } else if (thing[key] != keys[key]) {
                    return false;
                }
            }
            return true;
        });
        
        return thingArray;
    },

    /**
     * Gets the first thing that matches the given keys.
     * 
     * @param {string} type - drawings, lights, notes, sounds, tiles, or tokens
     * @param {object} keys - key-value pairs to search for
     * 
     * @returns {object} - the found object, or null if such an object doesn't exist
     */
     getSceneThingOfTypeByKeys(type, keys={}) {
        return this.getSceneThingsOfTypeByKeys(type,keys)[0] || null;
    },

    //#endregion

    //#region organization

    /**
     * Grabs everything of a given type and divides them into folders based on the split given.
     * 
     * For example, something named "Equipment / Weapons / Longsword", given a split of " / ", 
     * would become "Longsword" in the "Weapons" subfolder of the Equipment folder.
     * (Folders that don't exist will be created.)
     * 
     * @param {string} type - items, actors, tables, or journal
     * @param {string} split - the string the elements to organize should be split by
     * @param {number} maxDepth - the maximum depth a folder can have. 3 is the max foundry can handle by default, don't raise this unless you're using Moar Folders or something.
     * @returns {Boolean} true if it succeeded, false if it didn't.
     */
    async organize(type, split=" / ", maxDepth = 3) {
        if (typeof type !== "string") {
            console.log(`${type} isn't a string for organize`);
            return false;
        }

        const mapToOrganize = game[type];

        //Error Checking
        if (mapToOrganize === undefined) {
            console.log(`game[${type}] is undefined!`)
            return false;
        }
        if ((mapToOrganize instanceof Map) !== true) {
            console.log(`game[${type}] is not a map!`)
            return false;
        }
        if (mapToOrganize.contents.length == 0) {
            console.log(`game[${type}] has no contents to organize!`)
            return false;
        }
        if (mapToOrganize.contents[0].folder === undefined) {
            console.log(`game[${type}]'s contents don't have a 'folder' property!'`)
            return false;
        }

        let folderType;

        switch(type) {
            case "items":
                folderType = "Item";
                break;
            case "actors":
                folderType = "Actor";
                break;
            case "tables":
                folderType = "RollTable";
                break;
            case "journal":
                folderType = "JournalEntry";
                break;
            default:
                console.log(`the organize function isn't designed to handle ${type}`)
                return false;
        }

        for (const thing of mapToOrganize.contents) {
            const folderNames = thing.name.split(split),
                  folderArray = [];
            
            if (!!(thing.folder)) {
                for (let i = 1; i < thing.folder.depth; i++) {
                    folderArray.push(null) //Just need dummy data to fill out the array to the expected number of entries.
                }
                folderArray.push(thing.folder);
            }

            if (folderNames.length < 2) continue;

            for (let i = !!(thing.folder) ? thing.folder.depth : 0; folderNames.length > 1 && i < maxDepth; i++) {
                const curFolderName = folderNames.shift(),
                      parentFolder = folderArray[i-1],
                      parentId = !!parentFolder ? parentFolder.id : null;

                const curFolder = !!parentId ? await this.GuaranteedGetThingOfTypeByKeys("folders",{name:curFolderName,type:folderType,folder:parentId}) : await this.GuaranteedGetThingOfTypeByKeys("folders",{name:curFolderName,type:folderType});

                folderArray.push(curFolder);
            }

            const newName = folderNames.join(split),
                  folder = folderArray.pop(),
                  folderId = !!folder ? folder.id : null;

            thing.update({name:newName,folder:folderId});
        }

        return true;
    },

    /**
     * Deletes all folders of a given type and renames the things inside the folders to organize them instead.
     * 
     * For example, an actor named "Steve" in the "NPC" folder, given a split of " / ", would become "NPC / Steve"
     * in no folder.
     * 
     * @param {string} type - items, actors, tables, or journal
     * @param {string} split - the string the elements to unorganize should be split by
     * @returns {Boolean} true if it succeeded, false if it didn't.
     */
    unorganize(type, split=" / ") {
        if (typeof type !== "string") {
            console.log(`${type} isn't a string for organize`);
            return false;
        }


        const mapToUnorganize = game[type];

        //Error Checking
        if (mapToUnorganize === undefined) {
            console.log(`game[${type}] is undefined!`)
            return false;
        }
        if ((mapToUnorganize instanceof Map) !== true) {
            console.log(`game[${type}] is not a map!`)
            return false;
        }
        if (mapToUnorganize.contents.length == 0) {
            console.log(`game[${type}] has no contents to organize!`)
            return false;
        }
        if (mapToUnorganize.contents[0].folder === undefined) {
            console.log(`game[${type}]'s contents don't have a 'folder' property!'`)
            return false;
        }

        let folderType;

        switch(type) {
            case "items":
                folderType = "Item";
                break;
            case "actors":
                folderType = "Actor";
                break;
            case "tables":
                folderType = "RollTable";
                break;
            case "journal":
                folderType = "JournalEntry";
                break;
            default:
                console.log(`the organize function isn't designed to handle ${type}`)
                return false;
        }
        
        for (const thing of mapToUnorganize.contents) {
            const thingArray = [thing],
                  newNameArray = [];
            
            for (const element of thingArray) {
                newNameArray.unshift(element.name);
                if (!!element.folder) {
                    thingArray.push(element.folder);
                }
            }

            const newName = newNameArray.join(split);
            
            if (newName !== thing.name) thing.update({name:newName,folder:null}); //I don't need to do folder:null here (folder.delete doesn't delete items) but it makes me feel better. Feels safer. idk
        }
        
        const folderArray = game.folders.contents.filter(folder => folder.type === folderType)

        for (const folder of folderArray) {
            folder.delete();
        }

        return true;
    },

    //#endregion

    //#region tables
    
    /**
     * Finds a RollTable in the game and returns the result without rolling it in chat.
     * 
     * @param {string} name - Name of table to roll
     * @param {string} joinText - if result is an array, join them all with this.
     * @returns {string} result rolled from table
     */
    async rollTableNamed(name, joinText = ", ") {
        let table = this.getThingOfTypeByKeys("table", {'name':name});
        if (table === null) console.log(`rollTableNamed: ${name} returns null`);
        let draw = await table.roll(),
            resultArray = draw.results,
            results = "";

        for (let result of resultArray) {
            if (results.length > 0 && result.text.length > 0) results += joinText;
            results += result.text;
        }

        return results;
    },

    //#endregion

    //#region Journals

    /**
     * Just a lazy helper function to make a journal with pages all at once, rather than having to make the journal then createEmbeddedDocuments like a plebian
     * @param {string} title - the name of the journal
     * @param  {...object} pages - the pages of the journal
     * @returns {object} the journal entry
     */
    async makeJournalWithPages(title, ...pages) {
        let entry = await JournalEntry.create({name:title});
        await entry.createEmbeddedDocuments("JournalEntryPage",pages);

        return entry;
    },

    //#endregion

    //#region minor utilities

    /**
     * 
     * @param {object} array array (or object)
     * @returns {*} random element from the array
     */
    getRandomElement (array) {
        if (Array.isArray(array)) return array[Math.floor((Math.random()*array.length))];
        if (typeof array === "object") {
            const keys = Object.keys(array);
            return array[keys[ keys.length * Math.random() << 0]];
        }
        console.log("GetRandomElement can only handle arrays and objects!");
        return undefined;
    },

    /**
     * 
     * @param {number} max - highest possible number
     * @param {number} min - lowest possible number; defaults to 0
     * @returns {number} number between max and min
     */
    getRandomInt(max, min=0) {
        return Math.floor((Math.random() * (max - min)) + min);
    },

    /**
     * Randomly rounds a float up or down, with the odds determined by the fractional part.
     * @param {number} float 
     * @returns {number} integer
     */
    randomRound(float) {
        if (float % 1 === 0) return float;

        return Math.floor(float) + (Math.random() < float % 1)
    },

    /**
     * @param {Array} array
     * @returns {Array} array with all duplicate values removed.
     */
    removeDuplicates(array) {
        return [...new Set(array)];
    },

    /**
     * Not technically title case, just capitalizes the first letter of each word.
     * Preserves existing capitalizations; call toLowerCase() first as a workaround.
     * 
     * credit to Tom Kay on stackoverflow
     * 
     * @param {string} string - String to be converted to title case 
     * @returns {string} input string in title case
     */
    lazyTitleCase(string) {
        return string.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() });
    },

    /**
     * Inserts a space whenever there's a lowercase letter followed immediately by a capital letter.
     * Does some simple checking for acronyms and such.
     * 
     * credit to Joseph Garrone on stackoverflow
     * 
     * @param {string} string - String to be split before capital letters 
     * @returns {string} input string split at capitals
     */
    splitCamelCase(string) {
        string = string.replace(/([a-z])([A-Z])/g, '$1 $2');
        string = string.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        return string;
    },

    /**
     * Just combines splitCamelCase and lazyTitleCase to basically turn var names into proper headings.
     * @param {string} string 
     * @returns {string} the string, but prettier
     */
    makePretty(string) {
        return this.lazyTitleCase(this.splitCamelCase(string));
    },

    /**
     * Gets all of the keys and subkeys in an object and its subobjects, with no duplicates.
     * @param {object} object 
     * @returns {array} array of all keys in object, with no duplicates
     */
    getAllKeys(object) {
        let keys = [];

        for (const key in object) {
            keys.push(key);

            if (typeof object[key] === "object") {
                const subkeys = this.getAllKeys(object[key]);
                keys.concat(subkeys)
            }
        }

        return [...new Set(keys)];
    },

    getReadableTime(timeInMinutes) {
        const convert = {
            years:525600,
            months:43800,
            weeks:10080,
            days:1440,
            hours:60
        }

        const years = Math.floor(timeInMinutes / convert.years);
        timeInMinutes -= years*convert.years;

        const months = Math.floor(timeInMinutes / convert.months);
        timeInMinutes -= months*convert.months;

        const weeks = Math.floor(timeInMinutes / convert.weeks);
        timeInMinutes -= weeks*convert.weeks;
        
        const days = Math.floor(timeInMinutes / convert.days);
        timeInMinutes -= days*convert.days;
        
        const hours = Math.floor(timeInMinutes / convert.hours);
        timeInMinutes -= hours*convert.hours;
        
        const text = {
            years: (years>0 ? `${years} year${years>1 ? `s` : ``}` : null),
            months: (months>0 ? `${months} month${months>1 ? `s` : ``}` : null),
            weeks: (weeks>0 ? `${weeks} week${weeks>1 ? `s` : ``}` : null),
            days: (days>0 ? `${days} day${days>1 ? `s` : ``}` : null),
            hours: (hours>0 ? `${hours} hour${hours>1 ? `s` : ``}` : null),
            minutes: (timeInMinutes>0 ? `${timeInMinutes} minute${timeInMinutes>1 ? `s` : ``}` : null)
        }

        let returnArray = [];

        for (const time in text) {
            if (text[time] !== null) {
                returnArray.push(text[time]);
            } else if (returnArray.length > 0) {
                return returnArray.join(", ");
            }

            if (returnArray.length > 1) return returnArray.join(", ");
        }

        if (returnArray.length > 0) return returnArray.join(", ");
        else return `${timeInMinutes} minute${timeInMinutes>1 ? `s` : ``}`
    },

    weightedSelect(options, weightKey="weight") {
        const optionsType = Array.isArray(options) ? "array" : typeof options;

        if (optionsType === "object") {
            const array = [];
            for (const [key, value] of Object.entries(options)) {
                value.key = key; //Just in case we want it.
                array.push(value);
            }
            options = array;
        } else if (optionsType !== "array") {
            console.log(`weightedSelect can only handle arrays and objects! This is a ${optionsType}:`);
            console.log(options);
            return false;
        }

        let i;
        const weights = [];
    
        for (i = 0; i < options.length; i++) {
            weights[i] = options[i][weightKey] + (weights[i - 1] || 0);
        }
        
        const random = Math.random() * weights[weights.length - 1];
        
        for (i = 0; i < weights.length; i++) {
            if (weights[i] > random) {
                break;
            }
        }
        
        return options[i]//.item;
    }

    //#endregion
}