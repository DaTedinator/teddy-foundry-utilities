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
	"Name": ["Given Name", "Surname"],
    "Role":"Profession",
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

let dialogChoices = {
	Name: {
		type: "text",
		headingLevel: 2
	},
	Role: {
		type: "text",
		headingLevel: 2
	},
	Character: {
		type: "dropdown",
		headingLevel: 2,
		options: characterNames
	}
}

let choices = await tfu.dialog.choice("New NPC", dialogChoices);

if (choices.Name == "") delete choices.Name;
if (choices.Role == "") delete choices.Role;

let folder = choices.Character;
delete choices.Character;

let npcDetails = await tfu.npc.generateDetails(tables, choices);

await tfu.npc.makeNPC(`Contacts##${folder}##${npcDetails.Name}`, npcDetails, vitalDetails, makeNpcBiography(npcDetails));

function makeNpcBiography(d={}, plaintext=true) {
    console.log(d);

    const p = tfu.pronoun.getPronouns(d.Gender);
    
    const vowels = ["a","e","i","o","u"];

    let description = [];

    description.push(`${d.Name} is ${vowels.includes(d["First Look"][0].toLowerCase()) ? "an" : "a"} ${d["First Look"].toLowerCase()} ${d.Role.toLowerCase()} from ${d.Heritage}.`);

    description.push(`${p.They} ${p.they == "they" ? "want" : "wants"} to ${d.Goal.toLowerCase()}, and ${p.they == "they" ? "are" : "is"} likely to use ${d["Preferred Method"].toLowerCase()} to achieve it. While in typical situations ${p.they} can be ${d.Trait.toLowerCase()}, under pressure ${p.they} ${p.they == "they" ? "are" : "is"} revealed to be ${d["Revealed Aspect"].toLowerCase()}.`);

    if (plaintext) return description.join("\n\n");
    return "<p>" + description.join("</p>\n\n<p>") + "</p>";
}

tfu.organize("actors", "##");