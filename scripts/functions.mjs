import { utilities } from "./utilities.mjs";
import { data } from "./data.mjs";
import { dialog } from "./dialog.mjs";
import { hooks } from "./hooks.mjs";
import { npc } from "./npc.mjs";
import { pronoun } from "./pronoun.mjs";

import { fitd } from "./system/fitd.mjs";
import { sav } from "./system/sav.mjs";

import { scumGame } from "./game/scumGame.mjs";

console.log("Teddy's new shit loaded");

const tfu = {...utilities};
tfu.data = data;
tfu.dialog = dialog;
tfu.hooks = hooks;
tfu.npc = npc;
tfu.pronoun = pronoun;

tfu.fitd = fitd;
tfu.sav = sav;

Hooks.once('init', async () => {
  game.settings.register('teddy-foundry-utilities', 'editRolls', {
    name: 'Edit Rolls',
    hint: 'Rewrite rolls it fitd systems to list suggested results rather than possible results.',
    scope: 'world',     // "world" = sync to db, "client" = local storage
    config: true,       // false if you dont want it to show in module config
    type: Boolean,       // Number, Boolean, String, Object
    default: false,
    onChange: value => { // value is the new value of the setting
      switch(value){
        case true:
          Hooks.on('createChatMessage', tfu.fitd.editRoll)
          break;
        case false:
          Hooks.off('createChatMessage', tfu.fitd.editRoll)
          break;
      }
    },
  });
})

Hooks.once('ready', async () => {
  window.tfu = tfu;
})