import { utilities as tfu } from "../utilities.mjs";
import { token } from "../token.mjs";
import { fitd } from "../system/fitd.mjs";
import { sav } from "../system/sav.mjs";

async function generateClock(name, size=4, type="job", subtype="good", startFull=false) {
    const scene = canvas.scene,
          sceneName = scene.name;

    let clockCoords = {
        job: {
            good:{},
            bad:{}
        },
        ltp: {},
        other: {}
    };

    switch (sceneName) {
        case "Main Screen":
            clockCoords.job = {
                good: {
                    x: 3175,
                    y: 3325
                },
                bad: {
                    x: 1825,
                    y: 3100
                }
            };
            break;
        default:
            return false;
            break;
    }

    const sceneTokens = scene.tokens.contents,
          clockTokens = sceneTokens.filter(token.getFlag("teddy-foundry-utilities",clockType) !== undefined);

    const clockActor = await fitd.generateClock(name,size,type,subtype,startFull);
    
    
}

export const scumGame = {
    generateClock:generateClock
}