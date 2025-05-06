// dev/js/02_systems/11_BodyDescriptorsDB.js
// Centralized enum and descriptor logic for body-related features

const BodyDescriptors = {
    breastSize: ["flat", "small", "modest", "full", "large", "very large", "massive"],
    buttSize: ["flat", "tight", "modest", "round", "plump", "large", "voluptuous"],
    bodyType: ["emaciated", "slender", "lean", "average", "curvy", "thick", "heavyset", "broad"],
    lipFullness: ["thin", "narrow", "modest", "full", "plump", "voluptuous"],
    skinTone: ["porcelain", "fair", "golden", "olive", "brown", "dark", "ebony"],
    muscleTone: ["soft", "slightly toned", "fit", "athletic", "defined", "muscular", "ripped"],
    hipWidth: ["narrow", "modest", "wide", "very wide"],
    penisSize: ["micro", "small", "modest", "average", "large", "very large", "massive"],
    bodyHair: ["smooth", "light", "natural", "hairy", "very hairy"],
    voiceTone: ["hushed", "gentle", "melodic", "breathy", "raspy", "commanding"],
  
    heightDescriptor(heightInInches) {
      if (heightInInches <= 48) return "extremely short";
      if (heightInInches <= 54) return "short";
      if (heightInInches <= 60) return "below average height";
      if (heightInInches <= 66) return "average height";
      if (heightInInches <= 72) return "tall";
      if (heightInInches <= 78) return "very tall";
      return "towering";
    },
  
    // Helper to get a summary phrase from a character profile
    describeBody(profile) {
      return `A ${this.heightDescriptor(profile.height)}, ${this.bodyType[profile.bodyType]} build with ${this.breastSize?.[profile.breastSize] || "no"} breasts and a ${this.buttSize?.[profile.buttSize] || "flat"} butt.`;
    }
  };
  
  // Export for Twine/SugarCube usage
  setup.BodyDescriptors = BodyDescriptors;
  