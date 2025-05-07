// dev/js/02_systems/11_BodyDescriptorsDB.js
// Centralized enum and descriptor logic for body-related features

const BodyDescriptors = {
  breastSize: ["flat", "small", "modest", "full", "large", "very large", "massive"],
  buttSize: ["flat", "tight", "modest", "round", "plump", "large", "voluptuous"],
  bodyType: ["emaciated", "slender", "lean", "average", "curvy", "thick", "heavyset", "broad"],
  lipFullness: ["thin", "narrow", "modest", "full", "plump", "voluptuous"],
  muscleTone: ["soft", "slightly toned", "fit", "athletic", "defined", "muscular", "ripped"],
  hipWidth: ["narrow", "modest", "wide", "very wide"],
  bodyHair: ["smooth", "light", "natural", "hairy", "very hairy"],

  hairLengthMap: [
    { label: "bald", max: 0 },
    { label: "buzzed", max: 1 },
    { label: "cropped", max: 3 },
    { label: "short", max: 6 },
    { label: "ear-length", max: 8 },
    { label: "jaw-length", max: 10 },
    { label: "shoulder-length", max: 14 },
    { label: "mid-back", max: 20 },
    { label: "waist-length", max: 26 },
    { label: "butt-length", max: 34 },
    { label: "floor-length", max: Infinity }
  ],

  heightDescriptor(heightInInches) {
    if (heightInInches <= 48) return "extremely short";
    if (heightInInches <= 54) return "short";
    if (heightInInches <= 60) return "below average height";
    if (heightInInches <= 66) return "average height";
    if (heightInInches <= 72) return "tall";
    if (heightInInches <= 78) return "very tall";
    return "towering";
  },

  penisSizeDesc(sizeInInches) {
    if (sizeInInches < 3.5) return "small";
    if (sizeInInches < 5.5) return "modest";
    if (sizeInInches < 7) return "average";
    if (sizeInInches < 8.5) return "large";
    return "very large";
  },

  getHairLengthLabel(inches) {
    for (const entry of this.hairLengthMap) {
      if (inches <= entry.max) return entry.label;
    }
    return "unknown length";
  },

  describeHair(profile) {
    const lengthLabel = this.getHairLengthLabel(profile.hairLength || 0);
    return `${lengthLabel} ${profile.hairStyle || "unstyled"} ${profile.hairColor || "hair"}`;
  },

  describeEyes(profile) {
    return `${profile.eyeColor || "unknown"} eyes`;
  },

  describeBody(profile) {
    let height = this.heightDescriptor(profile.height);
    let build = this.bodyType[profile.bodyType];
    let breasts = profile.breastSize != null ? this.breastSize[profile.breastSize] + " breasts" : null;
    let butt = profile.buttSize != null ? this.buttSize[profile.buttSize] + " butt" : null;

    return `A ${height}, ${build} build${breasts ? ", with " + breasts : ""}${butt ? ", and a " + butt : ""}.`;
  },

  describeFullAppearance(profile) {
    return `${this.describeBody(profile)} ${profile.skinTone} skin, ${this.describeHair(profile)}, and ${this.describeEyes(profile)}.`;
  }
};

setup.BodyDescriptors = BodyDescriptors;
