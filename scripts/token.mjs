//import { utilities as tfu } from "./utilities.mjs";
import { zone as zoneUtils } from "./zone.mjs";
import { scene as sceneUtils } from "./scene.mjs";

export const token = {
    async spawnTokenOfActorObject(actorObject, scene=undefined, changes={}) {
        scene = sceneUtils.getScene(scene);
        return scene.createEmbeddedDocuments("Token",[await actorObject.getTokenData(changes)])
    },

    async spawnPrototypeToken(actor, scene=undefined, changes={}) {
        switch(typeof actor) {
            case "object":
                if (actor.prototypeToken === undefined) {
                    console.log("Error: spawnToken wasn't passed an actor object.")
                    return false;
                }
                break;
            case "string":
                actor = game.actors.contents.find(actorObj => {
                    if (actor === actorObj.id || actor === actorObj.name) return true;
                    return false;
                });
                if (actor.prototypeToken === undefined) {
                    console.log("Error: spawnToken wasn't passed a valid actor name or id.")
                    return false;
                }
                break;
            default:
                break;
        }

        return this.spawnTokenOfActorObject(actor, scene, changes);
    },

    async spawnPrototypeTokenInZone(actor, zoneName, scene=undefined, changes={}) {
        scene = sceneUtils.getScene(scene);

        const zone = scene.drawings.contents.find(drawing => drawing.text === `ZONE: ${zoneName}`)
        
        if (zone === undefined) {
            console.log(`ERROR: spawnPrototypeTokenInZone couldn't find a zone named ${zoneName}.`);
            return false;
        }

        const zoneData = zone.getFlag("teddy-foundry-utilities","zoneData");

        if (zoneData === undefined) zoneData = await zoneUtils.initializeZone(zone);

        const slot = zoneUtils.getNextEmptyZoneSlot(zoneData);

        if (slot === null) {
            console.log(`ERROR: spawnPrototypeTokenInZone couldn't find an empty slot in ${zoneName}.`)
            return false;
        }

        const token = this.spawnPrototypeToken(actor, scene, changes);

        zoneData.slots[slot.x][slot.y].occupant = token;
    }
}