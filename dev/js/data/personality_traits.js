/* ======================================================
   Personality Trait Library (Core Behavioral / Emotional Traits)
   --------------------------------------------------------------
   These traits shape daily behavior, conversation dynamics,
   emotional response patterns, and flavor interactions.
========================================================= */

setup.PersonalityTraits = {
    optimistic: { conflicts: ["pessimistic"], tags: ["emotional"] },
    pessimistic: { conflicts: ["optimistic"], tags: ["emotional"] },
    stoic: { conflicts: ["expressive"], tags: ["emotional"] },
    expressive: { conflicts: ["stoic"], tags: ["emotional"] },
    cheerful: { tags: ["emotional"] },
    melancholic: { tags: ["emotional"] },
    cynical: { conflicts: ["idealistic"], tags: ["emotional"] },
    idealistic: { conflicts: ["cynical"], tags: ["emotional"] },
    empathic: { tags: ["emotional"] },
    detached: { conflicts: ["empathic"], tags: ["emotional"] },
  
    goofy: { conflicts: ["serious"], tags: ["social"] },
    serious: { conflicts: ["goofy"], tags: ["social"] },
    charismatic: { tags: ["social"] },
    awkward: { tags: ["social"] },
    introverted: { conflicts: ["extroverted"], tags: ["social"] },
    extroverted: { conflicts: ["introverted"], tags: ["social"] },
    polite: { conflicts: ["crude"], tags: ["social"] },
    crude: { conflicts: ["polite"], tags: ["social"] },
    jealous: { tags: ["emotional"] },
    insecure: { tags: ["emotional"] },
    confident: { tags: ["emotional"] },
    flirty: { tags: ["social"] },
    guarded: { conflicts: ["flirty"], tags: ["emotional"] },
    affectionate: { tags: ["emotional"] },
    ruthless: { conflicts: ["kind", "empathic"], tags: ["emotional"] },
    kind: { conflicts: ["ruthless"], tags: ["emotional"] },
    dominant: { conflicts: ["submissive"], tags: ["social"] },
    submissive: { conflicts: ["dominant"], tags: ["social"] },
    independent: { conflicts: ["clingy"], tags: ["emotional"] },
    clingy: { conflicts: ["independent"], tags: ["emotional"] },
  
    anxious: { conflicts: ["bold"], tags: ["emotional"] },
    bold: { conflicts: ["anxious"], tags: ["emotional"] },
    secretive: { tags: ["emotional"] },
    trusting: { tags: ["emotional"] },
    judgmental: { tags: ["emotional"] },
    curious: { tags: ["mental"] },
    routineOriented: { tags: ["quirk"] },
    chaotic: { tags: ["quirk"] },
    possessive: { tags: ["emotional"] },
    detachedRomantic: { tags: ["romantic"] },
    loveBombing: { tags: ["romantic"] },
  
    entitled: { conflicts: ["humble"], tags: ["class"] },
    humble: { conflicts: ["entitled"], tags: ["class"] },
    pious: { tags: ["moral"] },
    hedonistic: { tags: ["moral", "social"] },
    militant: { tags: ["social"] },
    scholar: { tags: ["intellectual"] },
    merchant: { tags: ["social"] }
  };
  