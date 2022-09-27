export const rollResults = { 
    rewards: {
        base:{
            "clock+1a": {
                weight: 4,
                value: 1,
                unique:true,
                text: `Advance a beneficial clock by 1 or reduce a harmful clock by 1.`
            },
            "clock+1b": {
                weight: 4,
                value: 1,
                unique:true,
                text: `Advance a beneficial clock by 2 or reduce a harmful clock by 1.`
            },
            "clock+2": {
                weight: 8,
                value: 2,
                unique:false,
                text: `Advance a beneficial clock by 2 or reduce a harmful clock by 2.`
            },
            "clock+3": {
                weight: 12,
                value: 3,
                unique:false,
                text: `Advance a beneficial clock by 3 or reduce a harmful clock by 2.`
            },
            "clock+4": {
                weight: 16,
                value: 4,
                unique:false,
                text: `Advance a beneficial clock by 4 or reduce a harmful clock by 3.`
            }
        },
        bonus:{
            "differentClock+2": {
                weight: 4,
                value: 1,
                unique:true,
                text: `Advance an apparently unrelated beneficial clock by 2, or reduce an apparently unrelated harmful clock by 1.`
            },
            "differentClock+3": {
                weight: 4,
                value: 2,
                unique:false,
                text: `Advance an apparently unrelated beneficial clock by 3, or reduce an apparently unrelated harmful clock by 2.`
            },
            "downtimeClock+2": {
                weight: 4,
                value: 1,
                unique:false,
                text: `Advance a long term project clock by 2, or start a new long term project and give it 2 free ticks.`
            },
            "+position": {
                weight: 2,
                value: 2,
                unique:true,
                text: `Improve your position.`
            },
            "+effect": {
                weight: 2,
                value: 1,
                unique:true,
                text: `Improve your effect for your next move.`
            },
            "heat-1": {
                weight: 2,
                value: 2,
                unique:true,
                text: `Reduce your heat by 1.`
            },
            "heat-2": {
                weight: 2,
                value: 3,
                unique:true,
                text: `Reduce your heat by 2.`
            },
            "coin+1": {
                weight: 3,
                value: 2,
                unique:true,
                text: `Gain 1 coin.`
            },
            "coin+2": {
                weight: 1,
                value: 3,
                unique:true,
                text: `Gain 2 coin.`
            },
            "+contact": {
                weight: 3,
                value: 2,
                unique:true,
                text: `Gain a new contact, or improve your relationship with an existing contact.`
            },
            "+faction": {
                weight: 1,
                value: 3,
                unique:true,
                text: `Improve your relationship with a faction.`
            },
            "averageItem": {
                weight: 1,
                value: 2,
                unique:true,
                text: `Permanently gain a relevant item.`
            },
            "greatItem": {
                weight: 1,
                value: 3,
                unique:true,
                text: `Permanently gain a particularly valuable or useful item.`
            },
            "goodObstacle": {
                weight: 3,
                value: 3,
                unique:true,
                text: `Something's hindering your opponent. Start a new clock with 4 ticks; you can't advance any harmful clocks until this one is completed.`
            }
        }
    },
    penalties: {
        base:{
            "clock-1a": {
                weight: 4,
                value: 1,
                unique:true,
                text: `Advance a harmful clock by 1 or reduce a beneficial clock by 1.`
            },
            "clock-1b": {
                weight: 4,
                value: 1,
                unique:true,
                text: `Advance a harmful clock by 2 or reduce a beneficial clock by 1.`
            },
            "clock-2": {
                weight: 8,
                value: 2,
                unique:false,
                text: `Advance a harmful clock by 2 or reduce a beneficial clock by 2.`
            },
            "clock-3": {
                weight: 12,
                value: 3,
                unique:false,
                text: `Advance a harmful clock by 3 or reduce a beneficial clock by 2.`
            },
            "clock-4": {
                weight: 16,
                value: 4,
                unique:false,
                text: `Advance a harmful clock by 4 or reduce a beneficial clock by 3.`
            },
            "harm 1": {
                weight: 4,
                value: 1,
                unique:false,
                text: `A PC takes Harm 1.`
            },
            "harm 2": {
                weight: 6,
                value: 2,
                unique:false,
                text: `A PC takes Harm 2.`
            },
            "harm 3": {
                weight: 8,
                value: 3,
                unique:false,
                text: `A PC takes Harm 3.`
            },
            "harm 4": {
                weight: 4,
                value: 4,
                unique:false,
                text: `A PC takes Harm 4.`
            },
            "-position": {
                weight: 6,
                value: 2,
                unique:true,
                text: `Reduce your position.`
            }
        },
        bonus: {
            "differentClock-2": {
                weight: 4,
                value: 1,
                unique:true,
                text: `Advance an apparently unrelated harmful clock by 2, or reduce an apparently unrelated beneficial clock by 1.`
            },
            "differentClock-3": {
                weight: 4,
                value: 2,
                unique:false,
                text: `Advance an apparently unrelated harmful clock by 3, or reduce an apparently unrelated beneficial clock by 2.`
            },
            "downtimeClock-2": {
                weight: 4,
                value: 3,
                unique:false,
                text: `Reduce a long term project clock by 2, or start a new harmful downtime clock.`
            },
            "heat+1": {
                weight: 1,
                value: 2,
                unique:true,
                text: `Increase your heat by 1.`
            },
            "heat+2": {
                weight: 1,
                value: 3,
                unique:true,
                text: `Increase your heat by 2.`
            },
            "complication": {
                weight: 2,
                value: 2,
                unique:true,
                text: `A complication occurs; if in doubt, start a new bad clock.`
            },
            "omen": {
                weight: 2,
                value: 2,
                unique:true,
                text: `Something bad is coming. Start a new 4 clock; when it finishes, the bad thing arrives.`
            },
            "coin-1": {
                weight: 3,
                value: 2,
                unique:true,
                text: `Lose 1 coin or 2 stash.`
            },
            "coin-2": {
                weight: 1,
                value: 3,
                unique:true,
                text: `Lose 2 coin or 3 stash.`
            },
            "-contact": {
                weight: 3,
                value: 2,
                unique:false,
                text: `Lose a contact, or harm your relationship with one.`
            },
            "-faction": {
                weight: 1,
                value: 3,
                unique:false,
                text: `Reduce your relationship with a faction.`
            },
            "itemDropped": {
                weight: 1,
                value: 2,
                unique:true,
                text: `You drop one of your marked items; you can't use it until you retrieve it, and you lose it permanently if you don't.`
            },
            "itemBreaks": {
                weight: 1,
                value: 2,
                unique:true,
                text: `One of your item breaks, and can't be used until repaired. (Long term project with 4 ticks.)`
            },
            "-item": {
                weight: 1,
                value: 3,
                unique:true,
                text: `Permanently lose an item.`
            },
            "badObstacle": {
                weight: 3,
                value: 2,
                unique:true,
                text: `Something's hindering you. Start a new clock with 4 ticks; you can't advance any beneficial clocks until this one is completed.`
            }
        }
    },
    chaos: {
        "newFaction": {
            weight: 2,
            text: `A new faction appears on the scene.`
        },
        "heightenStakes": {
            weight: 3,
            text: `Something heightens the stakes; reduce your position but improve your effect.`
        },
        "breathingRoom": {
            weight: 3,
            text: `Something throws the situation into a standstill; improve your position but reduce your effect.`
        },
        "evenOdds": {
            weight: 4,
            text: `Something happens to even the odds, for good or for ill.`
        },
        "chaos": {
            weight: 4,
            text: `Something happens to throw the situation into chaos. If nothing else, remove one harmful clock and one beneficial clock (the two closest to completion), and start two new ones.`
        },
        "minorOpportunityWithCost": {
            weight: 4,
            text: `You gain a helpful opportunity, but it will require you to abandon whichever beneficial clock you're closest to filling, or to immediately fill whichever harmful clock is furthest from completion.`
        },
        "majorOpportunityWithCost": {
            weight: 2,
            text: `You gain a tremendous opportunity, but it will require you to abandon your current mission entirely.`
        },
        "vice": {
            weight: 4,
            text: `Your vice is tempted or your trauma flares up. Start a relevant 3-clock, and gain 1 playbook XP if you fill it.`
        },
        "reputation": {
            weight: 4,
            text: `Your crew's reputation is threatened. Start a relevant 3-clock, and gain 1 crew XP if you fill it.`
        },
        "neededItem": {
            weight: 5,
            text: `A particular item would come in handy; gain potency if you have it, or lose effect if you don't.`
        },
        "attention": {
            weight: 3,
            text: `You have the attention of someone important; your performance here will affect their opinion of you, for good for ill.`
        },
        "contact": {
            weight: 5,
            text: `One of your contacts is here - they may be helpful, if you're willing to put them at risk.`
        },
        "evidence": {
            weight: 3,
            text: `You've drawn a lot of attention; if you finish the job, gain +2 heat and +2 rep.`
        },
        "quiet": {
            weight: 3,
            text: `A significant disturbance is happening elsewhere in the city, drawing attention away from you; this job will grant -2 heat and -2 rep.`
        },
        "obstacle": {
            weight: 6,
            text: `Something's holding up the action. Start a new clock with 4 ticks; nobody can act directly against anybody else until that clock is completed.`
        },
        "surprise": {
            weight: 3,
            text: `The situation isn't what you thought; rename any clocks that just got ticked, or whichever clock is closest to completion if none did. Beneficial clocks stay beneficial, and harmful clocks stay harmful.`
        },
        "suddenConclusion": {
            weight: 3,
            text: `Things draw to a sudden conclusion; complete any clocks that just got ticked. If none did, instead add 1 tick to every clock relevant to this encounter.`
        },
        "holyShit": {
            weight: 1,
            text: `Something crazy is in the air tonight; add one tick to every clock on the table that has at least one tick - including faction clocks and long-term projects.`
        }
    }
}

export const heistDeck = {
    jobs:[
        "smuggle [thing] past [npc]",
        "escort [thing] through [place]",
        "deliver [thing] to [place]",
        "prevent [event]",
        "delay [event] by [duration]",
        "hide [thing] from [npc]",
        "protect [thing] from [thing]",
        "alert [npc] to [thing]",
        "find [thing]",
        "study [thing]",
        "surveil [thing]",
        "observe [thing]?",
        "destroy [thing]",
        "sabotage [thing]",
        "capture [thing]",
        "take [thing]",
        "hold [thing]",
        "plant [thing] in [place]",
        "negotiate [deal] with [npc]",
        "switch [thing] with [thing]",
        "persuade [npc] to [action]",
        "dissuade [npc] from [action]",
        "lead [npc] in [action]",
        "direct [npc]",
        "represent [npc] at [event]",
        "manage [npc] during [event]"
    ],
    reasons:[
        "to sustain [character]",
        "to powerup [character]",
        "to change [character]",
        "to sabotage [npc]",
        "to fulfil [npc] obligation",
        "to avenge [npc]",
        "to enable [character] to [action]",
        "to advance [character] [interest]",
        "to sabotage [npc] [interest]",
        "to remove [threat] to [character]",
        "to remove [obstacle] to [character] [interest]",
        "to influence [npc] to [action]",
        "to change [character]-[npc] relations",
        "to change [place]",
        "to cause [event]",
        "to progress [event]"
    ],
    complications:[
        "you must use a [loadout]",
        "you must use [item]",
        "you can use [ability]",
        "you must not use [item]",
        "you must use [cohort]",
        "you must use [asset]",
        "you must work with [npc]",
        "you are led by [npc]",
        "[pc] must do the score alone",
        "[npc] forces you to do the score",
        "you get [reward] if you [action]",
        "you get less [payoff] if you [action]",
        "the score must be done at [place]",
        "the score must be done at [time]",
        "the score must be done now",
        "the job must be done by using [approach]",
        "the score has two or more jobs",
        "the score has two or more reasons",
        "the score has two or more complications",
        "you must do two or more scores simultaneously",
        "a greater opportunity arises during the score",
        "[event] is behind schedule",
        "[event] is ahead of schedule",
        "during the score, the job changes",
        "[thing] will be at the score",
        "[npc] will be at the score",
        "[npc] and [npc] will be at the score",
        "[npc] will interfere with the score",
        "the score is a trap",
        "your information about the score is inaccurate",
        "[npc] will be affected by the score",
        "the score will draw the attention of [npc]"
    ],
    challenges: [
        "[npc] does not want you to succeed",
        "[npc] will be at the score",
        "[weather] will be at the score",
        "[terrain] will be at the score",
        "[phenomenon] will be at the score",
        "[architecture] will be at the score",
        "[flora] will be at the score",
        "[fauna] will be at the score",
        "[thing] tempts you",
        "Your opponent outnumbers you",
        "Your opponent outmatches you in [capability]",
        "[ally] will be opposing you",
        "[place] is crowded",
        "[place] is empty",
        "access to [place] is restricted",
        "[place] has strict rules"
    ],
    coin: [
        "coin",
        "goods to fence",
        "valuable information",
        "a valuable artifact"
    ],
    rewards: [
        "a favor",
        "a useful contact",
        "a big boost to your rep",
        "heat reduction",
        "wanted level reduction",
        "significant leverage",
        "a new lair",
        "promise of a future haul",
        "a fine weapon",
        "military hardware",
        "an arcane artifact",
        "a spark-craft device",
        "several potions",
        "recipes, formulas, and/or rituals"
    ],
    tags: {
        ability: {},
        action: {},
        ally: "Custom",
        approach: {
                "Assault": {
                    type:"text"
                },
                "Deception": {
                    type:"text"
                },
                "Stealth": {
                    type:"text"
                },
                "Occult": {
                    type:"text"
                },
                "Social": {
                    type:"text"
                },
                "Transport": {
                    type:"text"
                }
        },
        architecture: {},
        asset: {},
        capability: {},
        character: {
            pc: {
                type:"tag"
            },
            npc: {
                type:"tag",
                weight:3
            }
        },
        cohort: "Custom",
        deal: {},
        duration: {},
        event: {},
        fauna: {},
        flora: {},
        interest: {},
        item: {},
        loadout: {
            "Light Loadout": {
                type:"text",
                weight:3
            },
            "Normal Loadout": {
                type:"text",
                weight:1
            },
            "Heavy Loadout": {
                type:"text",
                weight:2
            }
        },
        npc: "Custom",
        obstacle: {},
        opponent: {},
        payoff: {},
        pc: "Custom",
        phenomenon: {},
        place: {},
        reward: {},
        rules: {},
        terrain: {},
        thing: {},
        threat: {},
        time: {
            "Time of Day": {
                type:"table"
            }
        },
        weather: {
            "Dangerous Weather": {
                type:"table"
            }
        }
    } 
}