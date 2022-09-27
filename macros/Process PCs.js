const friends = {
    cutter:{
        "Marlane":"Pugilist",
        "Chael":"Vicious thug",
        "Mercy":"Cold killer",
        "Grace":"Extortionist",
        "Sawtooth":"Physicker"
    },
    hound:{
        "Steiner":"Assassin",
        "Celene":"Sentinel",
        "Melvir":"Physicker",
        "Veleris":"Spy",
        "Casta":"Bounty hunter"
    },
    leech:{
        "Stazia":"Apothecary",
        "Veldren":"Psychonaut",
        "Eckerd":"Corpse thief",
        "Jul":"Blood dealer",
        "Malista":"Priestess"
    },
    lurk:{
        "Telda":"Beggar",
        "Darmot":"Bluecoat",
        "Frake":"Locksmith",
        "Roslyn Kellis":"Noble",
        "Petra":"City clerk"
    },
    slide:{
        "Bryl":"Drug dealer",
        "Bazso Baz":"Gang leader",
        "Klyra":"Tavern owner",
        "Nyryx":"Prostitute",
        "Harker":"Jail bird"
    },
    spider:{
        "Salia":"Information broker",
        "Augus":"Master architect",
        "Jennah":"Servant",
        "Riven":"Chemist",
        "Jeren":"Bluecoat archivist"
    },
    whisper:{
        "Nyryx":"Possessor ghost",
        "Scurlock":"Vampire",
        "Setarra":"Demon",
        "Quellyn":"Witch",
        "Flint":"Spirit trafficker"
    },
    assassins:{
        "Trev":"Gang boss",
        "Lydra":"Deal broker",
        "Irimina":"Vicious noble",
        "Karlos":"Bounty hunter",
        "Exeter":"Spirit Warden",
        "Sevoy":"Merchant lord"
    },
    bravos:{
        "Meg":"Pit-fighter",
        "Conway":"Bluecoat",
        "Keller":"Blacksmith",
        "Tomas":"Physicker",
        "Walker":"Ward boss",
        "Lutes":"Tavern owner"
    },
    cult:{
        "Gagan":"Academic",
        "Adikin":"Occultist",
        "Hutchins":"Antiquarian",
        "Moriya":"Spirit trafficker",
        "Mateas Kline":"Noble",
        "Bennett":"Astronomer"
    },
    hawkers:{
        "Rolan Wott":"Magistrate",
        "Laroze":"Bluecoat",
        "Lydra":"Deal broker",
        "Hoxley":"Smuggler",
        "Anya":"Dilettante",
        "Marlo":"Gang boss"
    },
    shadows:{
        "Dowler":"Explorer",
        "Laroze":"Bluecoat",
        "Amancio":"Deal broker",
        "Fitz":"Collector",
        "Adelaide Phroaig":"Noble",
        "Rigney":"Tavern owner"
    },
    smugglers:{
        "Elynn":"Dock worker",
        "Rolan":"Drug dealer",
        "Sera":"Arms dealer",
        "Nyelle":"Spirit trafficker",
        "Decker":"Anarchist",
        "Esme":"Tavern owner"
    }
};

let characters = game.actors.contents.filter(character => character.type === "character");

let crew = game.actors.contents.filter(character => character.type === "crew")[0];

let characterNames = [];

for (const character of characters) {
    characterNames.push(character.name);
}

characterNames.unshift(crew.name);

let vitalDetails = [
    "Full Name",
    "Age",
    "Gender",
    "Sexuality",
    "Hair",
    "Facial Hair",
    "Heritage",
    "Tycherosi Tell",
    "Skin",
    "Clothing",
    "First Look",
]

let tables = {
	"Name": "Alias",
    "Full Name":["Given Name", "Surname"],
	"Age":true,
	"Gender":true,
	"Sexuality":true,
	"Hair": ["Hair", "Hair Color"],
	"Facial Hair": {
		"odds": .5,
		"conditions": {
			"Gender": {
				"not": "Woman"
			}
		}
	},
	"Heritage":true,
	"Tycherosi Tell": {
		"table": "Demon Feature",
		"conditions": {
			"Heritage": {
				"is":"Tycheros"
			}
		}
	},
	"Skin":true,
	"Clothing": true,
	"First Look":true,
	"Goal":"Character Goal",
    "Background":"Profession",
    "Trait":true,
    "Revealed Aspect":true,
    "Preferred Method":true
}

function makeBiography(d={}) {
    console.log(d);

    const p = tfu.pronoun.getPronouns(d.Gender);
    
    const vowels = ["a","e","i","o","u"];

    let description = [];

    description.push(`${d.Name} is ${vowels.includes(d["First Look"][0].toLowerCase()) ? "an" : "a"} ${d["First Look"].toLowerCase()} ${d.Role.toLowerCase()} from ${d.Heritage}.`);

    description.push(`${p.They} ${p.they == "they" ? "come" : "comes"} from a ${d.Background.toLowerCase()} background as ${vowels.includes(d["Background Details"].toLowerCase()) ? "an" : "a"} ${d["Background Details"].toLowerCase()}.`)

    description.push(`${p.They} ${p.they == "they" ? "want" : "wants"} to ${d.Goal.toLowerCase()}, and ${p.they == "they" ? "are" : "is"} likely to use ${d["Preferred Method"].toLowerCase()} to achieve it. While in typical situations ${p.they} can be ${d.Trait.toLowerCase()}, under pressure ${p.they} ${p.they == "they" ? "are" : "is"} revealed to be ${d["Revealed Aspect"].toLowerCase()}.`);

    return "<p>" + description.join("</p>\n\n<p>") + "</p>";
}

function makeNpcBiography(d={},plaintext=true) {
    console.log(d);

    const p = tfu.pronoun.getPronouns(d.Gender);
    
    const vowels = ["a","e","i","o","u"];

    let description = [];

    description.push(`${d.Name} is ${vowels.includes(d["First Look"][0].toLowerCase()) ? "an" : "a"} ${d["First Look"].toLowerCase()} ${d.Role.toLowerCase()} from ${d.Heritage}.`);

    description.push(`${p.They} ${p.they == "they" ? "want" : "wants"} to ${d.Goal.toLowerCase()}, and ${p.they == "they" ? "are" : "is"} likely to use ${d["Preferred Method"].toLowerCase()} to achieve it. While in typical situations ${p.they} can be ${d.Trait.toLowerCase()}, under pressure ${p.they} ${p.they == "they" ? "are" : "is"} revealed to be ${d["Revealed Aspect"].toLowerCase()}.`);

    if (plaintext) return description.join("\n\n");
    return "<p>" + description.join("</p>\n\n<p>") + "</p>";
}

for (const character of characters) {
    const predetermined = {
        Name:character.name,
        "Full Name":character.system.alias,
        Gender:character.system.look.split(", ")[0],
        Role:character.items.contents.find(item => item.type === "class").name,
        Heritage:character.items.contents.find(item => item.type === "heritage").name,
        Background:character.items.contents.find(item => item.type === "background").name,
        "Background Details":character.system["background-details"],
        "First Look":character.system.look.split(", ")[1],
        Clothing:character.system.look.split(", ")[2]
    }
    const name = `${predetermined.Name}, the ${predetermined.Role}`;
    const journalName = `PCs`;

    const journal = await tfu.GuaranteedGetThingOfTypeByKeys("journals",{name:journalName});
    const journalPages = journal.pages.contents;

    let pageExists = false;
    for (const page of journalPages) {
        pageExists = pageExists || page.name === name;
    }
    if (pageExists) continue;

    const pcDetails = await tfu.npc.generateDetails(tables, predetermined);

    await tfu.npc.makeNPC(name, pcDetails, vitalDetails, makeBiography(pcDetails), journalName);
}

let usedNames = [];

for (const actor of [...characters, crew]) {
    let actorRole = actor.items.contents.find(item => {
        return (item.type === "class" || item.type === "crew_type")
    });

    for (const [contactName,contactRole] of Object.entries(friends[actorRole.name.toLowerCase()])) {
        const predetermined = {
            Name:contactName,
            Role:contactRole
        }

        if (usedNames.includes(predetermined.Name)) delete predetermined.Name;
        else usedNames.push(predetermined.Name);

        const npcDetails = await tfu.npc.generateDetails(tables, predetermined);

        const name = npcDetails.Name;
        const journalName = `Contacts##${actor.name}`;

        const journal = await tfu.GuaranteedGetThingOfTypeByKeys("journals",{name:journalName});
        const journalPages = journal.pages.contents;

        let pageExists = false;
        for (const page of journalPages) {
            pageExists = pageExists || page.name === name;
        }
        if (pageExists) continue;

        const characters = game.actors.contents;
        let npcExists = false;
        for (const character of characters) {
            npcExists = npcExists || character.name === name;
        }
        if (npcExists) continue;

        const npc = await tfu.npc.makeNPC(`Contacts##${actor.name}##${name}`, npcDetails, vitalDetails.filter( item => item !== "Full Name" ), makeNpcBiography(npcDetails));

        if (actor.type === "crew") {
            npc.update({system:{associated_crew_type:actorRole.name}});
        } else {
            npc.update({system:{associated_class:actorRole.name}});
        }
    }
}

tfu.organize("actors", "##");