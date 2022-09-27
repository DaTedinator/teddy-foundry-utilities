export const scene = {
    /**
     * 
     * @param {*} scene - If you give it a string, it'll compare it to all scene names and ids. If you give it an object, it'll check if that's a scene.
     * @param {*} returnCanvas - If true, will return canvas.scene if it can't find a valid scene. Otherwise will return undefined.
     * 
     * @returns {Object} - a scene, or undefined. 
     */
    async getScene(scene, returnCanvas=true) {
        switch(typeof scene) {
            case "object":
                if (scene === null) return canvas.scene;
                if (game.scenes.contents.includes(scene)) return scene;
                if (returnCanvas) return canvas.scene;
                return undefined;
            case "string":
                scene = game.scenes.contents.find(s => {
                    if (s.name === scene) return true;
                    if (s.id === scene) return true;
                    return false;
                });
                if (returnCanvas && !scene) scene = canvas.scene;
                return scene;
            default:
                if (returnCanvas) return canvas.scene;
                return undefined;
        }
    }
}