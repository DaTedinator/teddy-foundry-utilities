import { utilities as tfu } from "./utilities.mjs";

export const dialog = {
    /**
     * Makes a dialog with different choices
     * @param {string} title - The title of the dialog box.
     * @param {object} choices
     * @returns {object} The returned values keyed to their names.
     */
    async choice(title, choices={}) {
        const dialogData = {};

        dialogData.title = tfu.lazyTitleCase(title);
        dialogData.buttons = {};

        const namesToReturn = {},
              content = [];

        for (const [name, data] of Object.entries(choices)) {
            let html = undefined;

            switch(data.type.toLowerCase()) {
                case "heading":
                    html = this.makeHeading(tfu.makePretty(name), data.headingLevel);
                    break;
                case "text":
                case "number":
                    html = this.makeInput(name, data);
                    break;
                case "dropdown":
                case "radio":
                    html = this.makeSelection(name, data);
                    break;
                case "button":
                    dialogData.buttons[name] = {};
                    break;
                case "displaytext":
                    html = this.makeP(name, data.content, data);
                    break;
                default:
                    break;
            }

            if (html !== undefined) {
                content.push(html);
                if (data.type.toLowerCase() !== "heading" && data.type.toLowerCase() !== "displaytext") namesToReturn[name] = data.type.toLowerCase();
            }
        }

        const callback = (html) => {
            const returnObj = {};

            for (const [name,type] of Object.entries(namesToReturn)) {
                returnObj[name] = html.find(`[name="${name}"]${type === "radio" ? ":checked" : ""}`).val();
            }

            return returnObj;
        }

        for (const buttonName in dialogData.buttons) {
            const data = choices[buttonName];
            const button = {};

            button.icon = data.icon;
            button.label = data.label || tfu.lazyTitleCase(tfu.splitCamelCase(buttonName)); 
            button.callback = (html) => {
                let returnObj = callback(html);

                returnObj.button = buttonName;

                return returnObj;
            }
            dialogData.buttons[buttonName] = button;
        }

        if (Object.entries(dialogData.buttons).length === 0) {
            dialogData.buttons.ok = {
                icon: '<i class="fas fa-check"></i>',
                label: 'Ok',
                callback: callback
            }
        }

        dialogData.buttons.cancel = {
            icon: '<i class="fas fa-times"></i>',
            label: 'Cancel'
        }

        dialogData.default = Object.keys(dialogData.buttons)[0];

        dialogData.content = content.join("<br>\n");

        return Dialog.wait(dialogData);
    },

    /**
     * Creates an HTML input tag with the given attributes.
     * @param {string} tag - The type of tag to make
     * @param {object} attributes - Attributes for the input tag.
     * @returns {[string, string?]} An array containing the completed tag and accompanying closing tag, if necessary.
     */
    makeHtmlTag(tag, attributes={}, close=true) {

        const tags = [ [`<${tag}`] ];

        for (const [key, value] of Object.entries(attributes)) {
            tags[0].push(`${key}="${value}"`)
        }

        tags[0].push(">"); 

        tags[0] = tags[0].join(" ");

        if (close) tags[1] = `</${tag}>`

        return tags;
    },

    /**
     * Returns an html heading of the given level, with the given text.
     * @param {string} text 
     * @param {number} level 
     * @returns {string}
     */
    makeHeading(text, level) {
        return `<h${level}>${text}</h${level}>`;
    },

    /**
     * Makes an HTML p tag with the given text
     * @param {string} name name of the tag
     * @param {string} content content of the tag
     * @param {object} attributes additional attributes for the tag
     * @returns {string} the complete tag
     */
    makeP(name, content, attributes={}) {
        attributes.name = name;

        let hn = false;
        if (attributes.headingLevel != undefined) {
            hn = attributes.headingLevel;
            delete attributes.headingLevel;
        }

        if (attributes.content != undefined) {
            delete attributes.content;
        }

        let tags = this.makeHtmlTag("p", attributes);
        let htmlString = `${tags[0]}${content}${tags[1]}`;

        if (hn === 0) {
            htmlString = `<label><strong>${tfu.makePretty(name)}</strong> ${htmlString}</label>`
        } else if (hn > 0) {
            htmlString = `<h${hn}>${tfu.makePretty(name)}</h${hn}>\n${htmlString}`
        }

        return htmlString;
    },

    /**
     * Makes an HTML input tag with the given name
     * @param {string} name name of the tag
     * @param {object} attributes additional attributes
     * @returns {string} the complete tag
     */
    makeInput(name, attributes={}) {
        attributes.name = name;

        let hn = false;
        if (attributes.headingLevel != undefined) {
            hn = attributes.headingLevel;
            delete attributes.headingLevel;
        }

        if (attributes.style == undefined) {
            attributes.style = attributes.type == "number" ? "width:4em" : "width:auto";
        }

        let htmlString = this.makeHtmlTag("input", attributes, false)[0];

        if (hn === 0) {
            htmlString = `<label><strong>${tfu.makePretty(name)}</strong> ${htmlString}</label>`
        } else if (hn > 0) {
            htmlString = `<h${hn}>${tfu.makePretty(name)}</h${hn}>\n${htmlString}`
        }

        return htmlString;
    },

    /**
     * Makes an HTML select tag or radio buttons with the given name
     * @param {string} name name of the selection
     * @param {object} data the data. Important elements are data.type (either select or radio) and data.options (either an array or an object of the selections and their values)
     * @returns {string} the complete html code
     */
    makeSelection(name, data) {
        let first = true;

        if (data.type.toLowerCase() == "dropdown") data.type = "select"; //I want to be able to use dropdown

        if (data.type.toLowerCase() !== "select" && data.type.toLowerCase() !== "radio") {
            console.log("makeSelection can only handle selects or radios atm.")
            return "false";
        }

        if (Array.isArray(data.options)) {
            let newOptions = {};

            for (const option of data.options) {
                newOptions[option] = option;
            }

            data.options = newOptions;
        } else if (typeof data.options !== "object") {
            console.log("Options isn't an array or an object!")
            return "false";
        }

        let optionHtml = [];

        for(const [option, value] of Object.entries(data.options)) {
            let html = ``;

            if (data.type.toLowerCase() === "select") {
                html = `<option value="${value}" ${first ? " selected" : ''}>${tfu.makePretty(option)}</option>`
            } else {
                html = `<label><input type="radio" name="${name}" value="${value}" ${first ? " checked" : ''}> ${tfu.makePretty(option)}</label><br>`;
            }

            optionHtml.push(html);
            first = false;
        }

        let htmlString = optionHtml.join("\n");

        if (data.type.toLowerCase() === "select") {
            htmlString = `<select name="${name}">\n${htmlString}\n</select><br>`
        }

        if (data.headingLevel === 0) {
            htmlString = `<label><strong>${tfu.makePretty(name)}</strong> ${htmlString}</label>`
        } else if (data.headingLevel > 0) {
            htmlString = `<h${data.headingLevel}>${tfu.makePretty(name)}</h${data.headingLevel}>\n${htmlString}`
        }

        return htmlString;
    }/*,

    makeRadioButtons(name, options, div=true, other=false, otherLabel="Other"){
        let returnArray = div ? [`<h2>${name.toUpperCase()}</h2>`] : [`<h3>${name.toUpperCase()}</h3>`];

        let first = true;

        if (Array.isArray(options)) {
            for (const option of options) {
                returnArray.push(`<input type="radio" id="${option}" name="${name}" value="${option}" ${first ? " checked" : ''}>`);
                returnArray.push(`<label for="${option}">${option}</label><br>`)
                first = false;
            }
        } else if (typeof options === "object") {
            for (const option in options) {
                returnArray.push(`<input type="radio" id="${options[option]}" name="${name}" value="${option}" ${first ? " checked" : ''}>`);
                returnArray.push(`<label for="${options[option]}">${options[option]}</label><br>`)
                first = false;
            }
        } else {
            console.log("Options isn't an array or an object!")
            return "false";
        }

        if (other) {
            returnArray.push(`<input type="radio" id="other" name="${name}" value="other"">`);
            returnArray.push(`<label for="other"><input type="text" name="${name}_other" id="${name}_other"  style="width:80%"></label><br>`)
        }

        if (div) {
            returnArray.unshift("\n\n<div>");
            returnArray.push("</div>\n\n");
        }

        return returnArray.join("\n")
    },

    makeDropdown(id, options, div=true) {
        let returnArray = div ? [`<h2>${id.toUpperCase()}</h2>`] : [`<h3>${id.toUpperCase()}</h3>`];

        returnArray.push(`<select id="${id}">`)

        let first = true;

        if (Array.isArray(options)) {
            for (const option of options) {
                returnArray.push(`<option value="${option}"${first ? ' selected="selected"' : ''}>${option}</option>`);
                first = false;
            }
        } else if (typeof options === "object") {
            for (const option in options) {
                returnArray.push(`<option value="${options[option]}"${first ? ' selected="selected"' : ''}>${option}</option>`);
                first = false;
            }
        } else {
            console.log("Options isn't an array or an object!")
            return "false";
        }

        returnArray.push("</select>");

        if (div) {
            returnArray.unshift("\n\n<div>");
            returnArray.push("</div>\n\n");
        }

        return returnArray.join("\n")
    },

    makeTextInput(id, defaultText="", div=true) {
        let returnArray = div ? [`<h2>${id.toUpperCase()}</h2>`] : [`<h3>${id.toUpperCase()}</h3>`];
        
        returnArray.push(`<input type="text" id="${id}" name="${id}" style="width:80%" value="${defaultText}">`);

        if (div) {
            returnArray.unshift("\n\n<div>");
            returnArray.push("</div>\n\n");
        }

        return returnArray.join("\n")
    },

    makeNumInput(id, min, max, defaultValue, div=true) {
        let returnArray = div ? [`<h2>${id.toUpperCase()}</h2>`] : [`<h3>${id.toUpperCase()}</h3>`];
        
        returnArray.push(`<input type="number" id="${id}" name="${id}" min="${min}" max="${max}" style="width:20%" value="${defaultValue}">`);

        if (div) {
            returnArray.unshift("\n\n<div>");
            returnArray.push("</div>\n\n");
        }

        return returnArray.join("\n")
    }*/
}