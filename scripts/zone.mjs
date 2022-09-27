//import { utilities as tfu } from "./utilities.mjs";

export const scene = {
    async initializeZone(zone, zoneXSize=1, zoneYSize=1, leftToRight=true, topToBottom=true) {
        const xSize = Math.floor(zone.parent.grid.size*Math.floor(zoneXSize)),
              ySize = Math.floor(zone.parent.grid.size*Math.floor(zoneYSize)),
              zoneWidth = Math.floor(zone.width/xSize),
              zoneHeight = Math.floor(zone.height/ySize),
              zoneSlots = [];
        
        for (let x = 0; x < zoneWidth; x++) {
            zoneSlots[x] = [];
            for (let y = 0; y < zoneHeight; y++) {
                zoneSlots[x][y] = {
                    parent:zone,
                    x:x,
                    y:y,
                    sceneX:zone.x + x*gridSize,
                    sceneY:zone.y + y*gridSize,
                    occupant:null
                };
            }
        }

        const zoneData = {
            scene:zone.parent,
            gridSize:Math.floor(zoneGridSize),
            width:zoneWidth,
            height:zoneHeight,
            slots:zoneSlots,
            tokens:[],
            leftToRight:leftToRight,
            topToBottom:topToBottom
        }

        zone.setFlag("teddy-foundry-utilities","zoneData",zoneData);

        return zoneData;
    },

    getNextEmptyZoneSlot(zoneData, startingX = 0, startingY = 0) {
        let emptySlot = null;

        for (let x = startingX; (zoneData.leftToRight && x < zoneData.width) || (!zoneData.leftToRight && x >= 0); zoneData.leftToRight ? x++ : x--) {
            for (let y = startingY; (zoneData.topToBottom && y < zoneData.width) || (!zoneData.topToBottom && y >= 0); zoneData.topToBottom ? y++ : y--) {
                if (zoneData.slots[x][y].occupant === null) {
                    emptySlot = zoneData.slots[x][y];
                }
            }
        }

        return emptySlot;
    },

    async putTokenInZoneSlot(token,zoneSlot) {
        const zone = zoneSlot.parent;

        const originalSize = token.getFlag("teddy-foundry-utilities","originalSize") || {
            height:token.height,
            width:token.width
        };

        token.setFlag("teddy-foundry-utilities","originalSize",originalSize);

        await token.update({
            width:zone.xSize,
            height:zone.ySize,
            x:zoneSlot.sceneX,
            y:zoneSlot.sceneY
        });

        token.setFlag("teddy-foundry-utilities","zone",zone);
        token.setFlag("teddy-foundry-utilities","zoneSlot",zoneSlot);
        zoneSlot.occupant = token;

        return zoneSlot;
    },

    async clearZoneSlot(zoneSlot) {
        const token = zoneSlot.occupant;
        if (token === null) {return zoneSlot;}
        const originalSize = token.getFlag("teddy-foundry-utilities","originalSize");

        token.unsetFlag("teddy-foundry-utilities","zone");
        token.unsetFlag("teddy-foundry-utilities","zoneSlot");
        token.unsetFlag("teddy-foundry-utilities","originalSize");

        if (token.width !== originalSize.width || token.height !== originalSize.height) {
            await token.update({
                width: originalSize.width,
                height: originalSize.height
            })
        }

        zoneSlot.occupant = null;

        return zoneSlot;
    }
}