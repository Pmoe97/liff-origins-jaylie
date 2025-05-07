setup.resolveCharacterText = function (text, npc) {
    if (!npc || typeof npc !== "object") return text;
  
    const p = npc.pronouns || {};
    const b = npc.body || {};
  
    // Descriptive helpers
    const bd = setup.BodyDescriptors || {};
    const getBody = (index, arr) => arr?.[index] || "unknown";
    const getHairLength = (inches) => {
      if (!bd.getHairLengthLabel) return `${inches} inches`;
      return bd.getHairLengthLabel(inches);
    };
  
    // Resolution map
    const replacements = {
      "<<npc.name>>": npc.name || "they",
      "<<npc.they>>": p.subject || "they",
      "<<npc.them>>": p.object || "them",
      "<<npc.their>>": p.possessive || "their",
      "<<npc.theirs>>": p.possessive + "s" || "theirs",
      "<<npc.themself>>": p.reflexive || "themself",
      "<<npc.noun>>": p.noun || "person",
      "<<npc.eyecolor>>": b.eyeColor || "unknown",
      "<<npc.hairColor>>": b.hairColor || "unknown",
      "<<npc.hairStyle>>": b.hairStyle || "unstyled",
      "<<npc.hairLength>>": getHairLength(b.hairLength || 0),
      "<<npc.skinTone>>": b.skinTone || "skin",
      "<<npc.voiceTone>>": b.voiceTone || "neutral",
      "<<npc.bodyType>>": getBody(b.bodyType, bd.bodyType),
      "<<npc.buttSize>>": getBody(b.buttSize, bd.buttSize),
      "<<npc.breastSize>>": b.breastSize != null ? getBody(b.breastSize, bd.breastSize) : "",
      "<<npc.penisSize>>": b.penisSize != null ? `${b.penisSize.toFixed(1)} inch` : ""
    };
  
    // Apply all replacements
    for (const [key, value] of Object.entries(replacements)) {
      const safeVal = (value || "").toString();
      text = text.replaceAll(key, safeVal);
    }
  
    return text;
  };
  