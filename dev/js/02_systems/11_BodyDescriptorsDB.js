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
  
    penisSizeDesc(sizeInInches) {
      if (sizeInInches < 3.5) return "small";
      if (sizeInInches < 5.5) return "modest";
      if (sizeInInches < 7) return "average";
      if (sizeInInches < 8.5) return "large";
      return "very large";
    },
  
    describeBody(profile) {
      let height = this.heightDescriptor(profile.height);
      let build = this.bodyType[profile.bodyType];
      let breasts = profile.breastSize != null ? this.breastSize[profile.breastSize] + " breasts" : null;
      let butt = profile.buttSize != null ? this.buttSize[profile.buttSize] + " butt" : null;
  
      return `A ${height}, ${build} build${breasts ? ", with " + breasts : ""}${butt ? ", and a " + butt : ""}.`;
    }
  };
  
  setup.BodyDescriptors = BodyDescriptors;