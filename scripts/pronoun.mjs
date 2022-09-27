//import { utilities as tfu } from "./utilities.mjs";

export const pronoun = {
    getPronouns(gender) {
        switch(gender) {
            case "Man":
                gender = "Male";
                break;
            case "Woman":
                gender = "Female";
                break;
            default:
                break;
        }

        return {
            They: this.They(gender),
            they: this.they(gender),
            Them: this.Them(gender),
            them: this.them(gender),
            Their: this.Their(gender),
            their: this.their(gender),
            Theirs: this.Theirs(gender),
            theirs: this.theirs(gender),
            are: this.are(gender)
        };
    },

    They(gender) {
        switch (gender) {
            case "Male":
                return "He";
            case "Female":
                return "She";
            default:
                return "They"
        }
    },

    they(gender) {
        switch (gender) {
            case "Male":
                return "he";
            case "Female":
                return "she";
            default:
                return "they"
        }
    },

    Them(gender) {
        switch (gender) {
            case "Male":
                return "Him";
            case "Female":
                return "Her";
            default:
                return "Them"
        }
    },

    them(gender) {
        switch (gender) {
            case "Male":
                return "him";
            case "Female":
                return "her";
            default:
                return "them"
        }
    },

    Their(gender) {
        switch (gender) {
            case "Male":
                return "His";
            case "Female":
                return "Her";
            default:
                return "Their"
        }
    },

    their(gender) {
        switch (gender) {
            case "Male":
                return "his";
            case "Female":
                return "her";
            default:
                return "their"
        }
    },

    Theirs(gender) {
        switch (gender) {
            case "Male":
                return "His";
            case "Female":
                return "Hers";
            default:
                return "Theirs"
        }
    },

    theirs(gender) {
        switch (gender) {
            case "Male":
                return "his";
            case "Female":
                return "hers";
            default:
                return "theirs"
        }
    },

    are(gender) {
        switch (gender) {
            case "Male":
            case "Female":
                return "is";
            default:
                return "are";
        }
    }
}