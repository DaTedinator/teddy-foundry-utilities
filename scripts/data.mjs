import { utilities as tfu } from "./utilities.mjs";

export const data = {
    async get(pageName) {
        const journal = await tfu.GuaranteedGetThingOfTypeByKeys("journal",{name:"_teddy_data"});

        const page = journal.pages.contents.find(page => page.name == pageName);

        if (page === undefined) {
            return undefined;
        }

        const jsonString = page.text.content;

        const data = JSON.parse(jsonString);

        return data;
    },

    async record(data, replace=true, pageName=undefined) {
        const journal = await tfu.GuaranteedGetThingOfTypeByKeys("journal",{name:"_teddy_data"});

        pageName = pageName || data.name;

        if (pageName === undefined) {
            console.log("Error! tfu.data.record needs a name, either in the data or passed as an argument!");
            return false;
        }

        let page = journal.pages.contents.find(page => page.name == pageName) || (await journal.createEmbeddedDocuments("JournalEntryPage",[{name:pageName,type:"text",text:{content:""}}]))[0];

        let curContent = page.text.content,
            newContent = JSON.stringify(data);

        if (!replace && !!curContent && curContent) {
            newContent = JSON.stringify({
                ...JSON.parse(curContent),
                ...data
            })
        }
        page.update({text:{content:newContent}});

        return true;
    },

    async delete(pageName) {
        const journal = await tfu.GuaranteedGetThingOfTypeByKeys("journal",{name:"_teddy_data"});

        const page = journal.pages.contents.find(page => page.name == pageName);

        page.delete();

        return true;
    }
}