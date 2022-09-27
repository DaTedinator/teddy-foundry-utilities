//import { utilities as tfu } from "./utilities.mjs";

export const hooks = {
    editRoll(message, html, data) {
        let positionAndEffect = html.find(".chat-label-small.label-stripe-chat-small")[0];

        if(positionAndEffect == undefined) return;

        const [position, effect] = positionAndEffect.innerText.trim().split(" | ");
        let result = "Error";
        
        switch(true) {
            case (html.find(".die.failure")[0] != undefined):
                result = "Failure";
                break;
            case (html.find(".die.partial-success")[0] != undefined):
                result = "Partial";
                break;
            case (html.find(".die.success")[0] != undefined):
                result = "Success";
                break;
            case (html.find(".die.critical-success")[0] != undefined):
                result = "Critical";
                break;
        }

        html.find("p").replaceWith(`<p>${interpretRollResult(position, effect, result)}</p>`);
    }
}