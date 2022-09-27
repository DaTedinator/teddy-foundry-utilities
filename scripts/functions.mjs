import { utilities } from "./utilities.mjs";
import { data } from "./data.mjs";
import { dialog } from "./dialog.mjs";
import { hooks } from "./hooks.mjs";
import { npc } from "./npc.mjs";
import { pronoun } from "./pronoun.mjs";

import { fitd } from "./system/fitd.mjs";
import { sav } from "./system/sav.mjs";

console.log("Teddy's new shit loaded");

const tfu = {...utilities};
tfu.data = data;
tfu.dialog = dialog;
tfu.hooks = hooks;
tfu.npc = npc;
tfu.pronoun = pronoun;

tfu.fitd = fitd;
tfu.sav = sav;

Hooks.once('ready', async () => {
    window.tfu = tfu;
  })

Hooks.on('createChatMessage', tfu.fitd.editRoll)