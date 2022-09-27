import { utilities as tfu } from "../utilities.mjs";
import { data } from "../data.mjs";
import { npc } from "../npc.mjs";
import { pronoun } from "../pronoun.mjs";
//import { rollResults, heistDeck } from "./bitd_data.mjs"

function getShipByName(shipName) {
    const ship = tfu.getThingOfTypeByKeys("actors",{name:shipName});
    if (ship.type === "ship") return undefined;
    return ship;
}

/**
 * Gets a ship's current location.
 * 
 * @param {string} shipName The name of the ship
 * 
 * @returns {[object]} - An object with the name of the ship's location, and its planet image
 */
function getShipLocation(shipObject) {
    const locationData = shipObject.getFlag("teddy-foundry-utilities","locationData") || {name:"Deep Space", image:"modules/teddy-foundry-utilities/styles/assets/transparent.png", description:"Deep in the black."};

    return locationData;
}

/**
 * Changes a ship's location
 * 
 * @param {string} shipName - The name of the ship to move
 * @param {string} newLocationName - The name of the planet/place to move the ship to
 * @param {string} sceneName - The scene on which this should all happen
 * 
 * @returns {Boolean} true if successful, false otherwise. 
 */
async function updateShipLocation(shipObject, newLocationName, sceneName="Galactic Map") {
    const currentLocation = getShipLocation(shipObject);

    const planetObject = tfu.getThingOfTypeByKeys("items",{name:newLocationName}) || {name:"Deep Space", image:"modules/teddy-foundry-utilities/styles/assets/transparent.png", description:"Deep in the black."};

    const planetName = planetObject.name,
          planetWebp = planetObject.img,
          planetWebm = planetWebp.replace("webp","webm"),
          planetDesc = planetObject.system.description;
    
    const locationData = {
        name: planetName,
        image: planetWebm,
        description: planetDesc
    };
    
    const planetBigTile = tfu.getSceneThingOfTypeByKeys("tiles",{overhead:true,texture:{src:currentLocation.image}},sceneName);
    const planetSmallTile = tfu.getSceneThingOfTypeByKeys("tiles",{overhead:false,texture:{src:currentLocation.image}},sceneName);
    const planetNameText = tfu.getSceneThingOfTypeByKeys("drawings",{text:currentLocation.name},sceneName);
    const planetDescText = tfu.getSceneThingOfTypeByKeys("drawings",{text:currentLocation.description},sceneName);
    const shipToken = tfu.getSceneThingOfTypeByKeys("tokens",{name:shipObject.name,width:1,height:1},sceneName);

    if (!!planetBigTile) await planetBigTile.update({texture:{src:locationData.image}});
    if (!!planetNameText) await planetNameText.update({text:locationData.name});
    if (!!planetDescText) await planetDescText.update({text:locationData.description});
    if (!!shipToken && !!planetSmallTile) await shipToken.update({x:planetSmallTile.x,y:planetSmallTile.y});

    await shipObject.setFlag("teddy-foundry-utilities","locationData",locationData);

    return true;
}

export const sav = {
    getShipLocation:getShipLocation,
    updateShipLocation:updateShipLocation
}