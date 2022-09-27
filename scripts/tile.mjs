import { scene as sceneUtil } from "./scene.mjs";

export const tile = {
    async spawnTile(img,x=0,y=0,tileData={},scene=undefined) {
        scene = sceneUtil.getScene(scene);

        const image = new Image();
        image.src = img;
        
        tileData.texture = {src:img};
        tileData.x = x;
        tileData.y = y;
        tileData.width = image.naturalWidth,
        tileData.height = image.naturalHeight

        return (await scene.createEmbeddedDocuments("Tile",[tileData]))[0];
    }
}