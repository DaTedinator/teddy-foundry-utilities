function roundTo(number, mult) {
    return Math.round(number / mult) * mult
}

function getInt(min, max) {
    Math.floor(Math.random() * (1 + max - min) + min)
}

const rollResults = {
    rewards: {
        clock: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 1,
                  maxValue = Math.min(4, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Advance a beneficial clock by ${value}, or reduce a harmful clock by ${Math.max(value-1, 1)}.`,
                  tags = ["base", "unique", "clock"];
            
            this.clock = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.clock();
        },
        oddClock: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 1,
                  maxValue = Math.min(3, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Advance an apparently unrelated beneficial clock by ${value+1}, or reduce an apparently unrelated harmful clock by ${value}.`,
                  tags = ["unique", "clock"];
            
            this.oddClock = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.oddClock();
        },
        downtimeClock: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 2,
                  maxValue = Math.min(4, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Advance a long-term project clock by ${value}, or start a new long-term project and give it ${value-1} free ticks.`,
                  tags = ["unique", "clock"];
            
            this.downtimeClock = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.downtimeClock();
        },
        position: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 2,
                  maxValue = Math.min(2, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Improve your position.`,
                  tags = ["unique"];
            
            this.position = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.position();
        },
        heat: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 2,
                  maxValue = Math.min(4, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Reduce your heat by ${value-1}. If this would reduce your heat below 0, gain 1 XP in the rolled attribute.`,
                  tags = ["unique"];
            
            this.heat = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.heat();
        },
        coin: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 2,
                  maxValue = Math.min(3, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Gain ${value-1} coin.`,
                  tags = ["unique"];
            
            this.coin = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.coin();
        },
        contact: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 2,
                  maxValue = Math.min(2, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Gain a new contact, or improve your relationship with an existing contact.`,
                  tags = ["unique"];
            
            this.contact = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.contact();
        },
        faction: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 4,
                  maxValue = Math.min(4, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Improve your relationship with a faction`,
                  tags = ["unique"];
            
            this.faction = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.faction();
        },
        item: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 2,
                  maxValue = Math.min(4, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = (()=>{switch(value){
                    case 2: return `Permanently gain an item.`;
                    case 3: return `Permanently gain a <strong>fine</strong> item.`;
                    case 4: return `Permanently gain a rare or uniquely powerful item.`;
                    default: return `Error in item reward`; 
                  }})(),
                  tags = ["unique"];
            
            this.faction = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.faction();
        },
        obstacle: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 3,
                  maxValue = Math.min(4, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Something's hindering your opponent. Start a new clock with ${value === 3 ? "4" : "6"} ticks to represent the obstacle they have to overcome.`,
                  tags = ["unique"];
            
            this.obstacle = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.obstacle();
        }
    },
    penalties: {
        harm: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 1,
                  maxValue = Math.min(4, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Take harm ${value}.`,
                  tags = ["base", "unique", "harm"];
            
            this.harm = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.harm();
        },
        clock: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 1,
                  maxValue = Math.min(4, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Advance a harmful clock by ${value}, or reduce a beneficial clock by ${Math.max(value-1, 1)}.`,
                  tags = ["base", "unique", "clock"];
            
            this.clock = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.clock();
        },
        newClock: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 1,
                  maxValue = Math.min(3, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Start a new harmful clock with ${10 - (value*2)} ticks on it; when it finishes, something bad happens.`,
                  tags = ["base", "unique", "clock"];
            
            this.clock = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.clock();
        },
        otherHarm: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 1,
                  maxValue = Math.min(3, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Someone nearby takes harm ${value}.`,
                  tags = ["unique", "harm"];
            
            this.otherHarm = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.otherHarm();
        },
        oddClock: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 1,
                  maxValue = Math.min(3, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Advance an apparently unrelated harmful clock by ${value+1}, or reduce an apparently unrelated beneficial clock by ${value}.`,
                  tags = ["unique", "clock"];
            
            this.oddClock = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.oddClock();
        },
        position: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 2,
                  maxValue = Math.min(2, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Reduce your position.`,
                  tags = ["unique"];
            
            this.position = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.position();
        },
        heat: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 2,
                  maxValue = Math.min(4, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Increase your heat by ${value-1}.`,
                  tags = ["unique"];
            
            this.heat = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.heat();
        },
        contact: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 2,
                  maxValue = Math.min(2, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Lose a contact, or hurt your relationship with an close contact.`,
                  tags = ["unique"];
            
            this.contact = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.contact();
        },
        faction: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 4,
                  maxValue = Math.min(4, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Damage your relationship with a faction`,
                  tags = ["unique"];
            
            this.faction = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.faction();
        },
        item: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 1,
                  maxValue = Math.min(3, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = (()=>{switch(value){
                    case 1: return `You drop one of your marked items; you can't use it until you retrieve it, and you lose it permanently if you don't.`;
                    case 2: return `One of your items breaks, and can't be used until repaired. (Long term project with 4 ticks.)`;
                    case 3: return `Permanently lose an item.`;
                    default: return `Error in item reward`; 
                  }})(),
                  tags = ["unique"];
            
            this.faction = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.faction();
        },
        obstacle: function(pointsAvailable=4, reqValue=undefined) {
            const weight = 1,
                  minValue = 3,
                  maxValue = Math.min(4, pointsAvailable),
                  roundValueTo = 1;

            if (minValue > maxValue) return false;
            if (!!reqValue && (reqValue < minValue || reqValue > maxValue || reqValue % roundValueTo > 0) ) return false;

            const value = roundTo(getInt(minValue, maxValue),roundValueTo),
                  text = `Something's hindering you. Start a new clock with ${value === 3 ? "4" : "6"} ticks to represent the obstacle you have to overcome before you can continue pursuing your objective.`,
                  tags = ["unique"];
            
            this.obstacle = () => {return {weight:weight, value:value, text:text, tags:tags}}
            return this.obstacle();
        }
    },
    chaos: {
        "newFaction": {
            text: `A new faction appears on the scene.`,
            weight: 2
        },
        "heightenStakes": {
            text: `Something heightens the stakes; reduce your position but improve your effect.`,
            weight: 3
        },
        "breathingRoom": {
            text: `Something throws the situation into a standstill; improve your position but reduce your effect.`,
            weight: 3
        },
        "evenOdds": {
            text: `Something happens to even the odds, for good or for ill.`,
            weight: 4
        },
        "chaos": {
            text: `Something happens to throw the situation into chaos. If nothing else, remove one harmful clock and one beneficial clock (the two closest to completion), and start two new ones.`,
            weight: 4
        },
        "minorOpportunityWithCost": {
            text: `You gain a helpful opportunity, but it will require you to abandon whichever beneficial clock you're closest to filling, or to immediately fill whichever harmful clock is furthest from completion.`,
            weight: 4
        },
        "majorOpportunityWithCost": {
            text: `You gain a tremendous opportunity, but it will require you to abandon your current mission entirely.`,
            weight: 2
        },
        "vice": {
            text: `Your vice is tempted or your trauma flares up. Start a relevant 3-clock, and gain 1 playbook XP if you fill it.`,
            weight: 4
        },
        "reputation": {
            text: `Your crew's reputation is threatened. Start a relevant 3-clock, and gain 1 crew XP if you fill it.`,
            weight: 4
        },
        "neededItem": {
            text: `A particular item would come in handy; gain potency if you have it, or lose effect if you don't.`,
            weight: 5
        },
        "attention": {
            text: `You have the attention of someone important; your performance here will affect their opinion of you, for good for ill.`,
            weight: 3
        },
        "contact": {
            text: `One of your contacts is here - they may be helpful, if you're willing to put them at risk.`,
            weight: 5
        },
        "evidence": {
            text: `You've drawn a lot of attention; if you finish the job, gain +2 heat and +2 rep.`,
            weight: 3
        },
        "quiet": {
            text: `A significant disturbance is happening elsewhere in the city, drawing attention away from you; this job will grant -2 heat and -2 rep.`,
            weight: 3
        },
        "obstacle": {
            text: `Something's holding up the action. Start a new clock with 4 ticks; nobody can act directly against anybody else until that clock is completed.`,
            weight: 6
        },
        "surprise": {
            text: `The situation isn't what you thought; rename any clocks that just got ticked, or whichever clock is closest to completion if none did. Beneficial clocks stay beneficial, and harmful clocks stay harmful.`,
            weight: 3
        },
        "suddenConclusion": {
            text: `Things draw to a sudden conclusion; complete any clocks that just got ticked. If none did, instead add 1 tick to every clock relevant to this encounter.`,
            weight: 3
        },
        "holyShit": {
            text: `Something crazy is in the air tonight; add one tick to every clock on the table that has at least one tick - including faction clocks and long-term projects.`,
            weight: 1
        }
    }
}