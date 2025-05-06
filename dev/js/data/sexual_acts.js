// dev/js/data/sexual_acts.js
// Full registry of sexual interaction tags used across preferences, inclinations, and scene logic

setup.SexualActs = {

    // ORAL
    Oral_G:       { label: "Giving oral", category: "Oral", tags: ["foreplay"] },
    Oral_R:       { label: "Receiving oral", category: "Oral", tags: ["foreplay", "pleasure"] },
    OralAnal_G:   { label: "Giving oral to anus", category: "Oral", tags: ["kink", "analingus"] },
    OralAnal_R:   { label: "Receiving oral on anus", category: "Oral", tags: ["kink", "analingus"] },
  
    // MANUAL
    Clit_Rub:     { label: "Clitoral rubbing", category: "Manual", tags: ["foreplay", "sensitive"] },
    NipplePlay_G: { label: "Nipple play (giving)", category: "Manual", tags: ["affection"] },
    NipplePlay_R: { label: "Nipple play (receiving)", category: "Manual", tags: ["foreplay"] },
    BreastPlay_G: { label: "Breast fondling (giving)", category: "Manual", tags: ["affection", "pleasure"] },
    BreastPlay_R: { label: "Breast fondling (receiving)", category: "Manual", tags: ["foreplay"] },
    Fingering_G:  { label: "Fingering partner", category: "Manual", tags: ["penetration"] },
    Fingering_R:  { label: "Being fingered", category: "Manual", tags: ["penetration", "pleasure"] },
    Handjob_G:    { label: "Giving handjob", category: "Manual", tags: ["foreplay"] },
    Handjob_R:    { label: "Receiving handjob", category: "Manual", tags: ["pleasure"] },
    Lick_Body:    { label: "Licking their body", category: "Manual", tags: ["sensory", "foreplay"] },
    Bite_G:       { label: "Biting partner", category: "Manual", tags: ["rough", "dominant"] },
  
    // PENETRATION
    Vaginal_P:    { label: "Vaginal penetration", category: "Penetration", tags: ["climax", "core"] },
    Anal_P:       { label: "Anal penetration", category: "Penetration", tags: ["kink", "climax"] },
  
    // POSITION CONTROL
    FaceSit:      { label: "Face sitting", category: "Position", tags: ["oral", "dominant"] },
    Mount_Top:    { label: "Climbing on top", category: "Position", tags: ["position", "active"] },
    Pinned_Down:  { label: "Being pinned", category: "Position", tags: ["passive", "submissive"] },
  
    // DOMINANCE & SUBMISSION
    Spank_G:      { label: "Spanking partner", category: "DomPlay", tags: ["impact", "dominant"] },
    Spank_R:      { label: "Being spanked", category: "SubPlay", tags: ["impact", "submission"] },
    Choke_G:      { label: "Choking partner", category: "DomPlay", tags: ["kink", "breathplay"] },
    Choke_R:      { label: "Being choked", category: "SubPlay", tags: ["kink", "submission"] },
    HairPulling_G:{ label: "Pulling partner's hair", category: "DomPlay", tags: ["rough", "dominant"] },
    HairPulling_R:{ label: "Having hair pulled", category: "SubPlay", tags: ["rough", "submissive"] },
    Dominate:     { label: "Taking control", category: "Dominance", tags: ["assertive"] },
    Submit:       { label: "Submitting", category: "Submission", tags: ["obedient"] },
  
    // TOYS & RESTRAINTS
    Toys_Use:     { label: "Using toys on partner", category: "ToyPlay", tags: ["tools"] },
    Toys_Receive: { label: "Having toy used on you", category: "ToyPlay", tags: ["tools"] },
    Toys_OnSelf:  { label: "Using toy on self", category: "ToyPlay", tags: ["solo"] },
    Bondage_Use:  { label: "Binding partner", category: "Bondage", tags: ["control"] },
    Bondage_R:    { label: "Being bound", category: "Bondage", tags: ["helpless"] },
    Gag_Use:      { label: "Using gag", category: "Bondage", tags: ["control", "silence"] },
  
    // VERBAL
    DirtyTalk_G:  { label: "Giving dirty talk", category: "Verbal", tags: ["vocal", "dominant"] },
    DirtyTalk_R:  { label: "Receiving dirty talk", category: "Verbal", tags: ["vocal", "arousal"] },
    Praise_G:     { label: "Praising partner", category: "Verbal", tags: ["affirming"] },
    Degrade_G:    { label: "Degrading partner", category: "Verbal", tags: ["humiliation", "kink"] },
  
    // INTIMACY
    Kissing:      { label: "Kissing", category: "Affection", tags: ["tender"] },
    Cuddling:     { label: "Cuddling", category: "Affection", tags: ["comfort"] },
    EyeContact:   { label: "Intense eye contact", category: "Intimacy", tags: ["connection"] },
  
    // FLUID & CLIMAX
    Cum_OnSelf:   { label: "Ejaculating on self", category: "Climax", tags: ["messy"] },
    Cum_OnThem:   { label: "Ejaculating on partner", category: "Climax", tags: ["messy"] },
    Swallow_Cum:  { label: "Swallowing ejaculation", category: "Climax", tags: ["oral", "kink"] },
    Creampie:     { label: "Internal ejaculation", category: "Climax", tags: ["penetration"] },
  
     // ROLEPLAY / FANTASY
    Roleplay_Servant:   { label: "Servant roleplay", category: "Roleplay", tags: ["submission", "obedience"] },
    Roleplay_Master:    { label: "Master/Dominant roleplay", category: "Roleplay", tags: ["powerplay"] },
    Roleplay_Teacher:   { label: "Teacher/student fantasy", category: "Roleplay", tags: ["authority"] },
    Roleplay_Stranger:  { label: "Stranger/danger fantasy", category: "Roleplay", tags: ["risk", "non-familiar"] },

    // EXHIBITIONISM & VOYEURISM
    Exhibition_Solo:    { label: "Being watched while pleasuring self", category: "Exhibitionism", tags: ["public", "exposed"] },
    Exhibition_Sex:     { label: "Having sex in public", category: "Exhibitionism", tags: ["public", "thrill"] },
    Voyeurism:          { label: "Watching others", category: "Voyeurism", tags: ["observation"] },

    // RISK & POWER KINKS
    Risk_BeingCaught:   { label: "Risk of being caught", category: "RiskPlay", tags: ["excitement", "fear"] },
    PowerImbalance:     { label: "Power imbalance kink", category: "DomPlay", tags: ["hierarchy"] },
    OrgasmControl_G:    { label: "Controlling partner’s orgasm", category: "Control", tags: ["edging", "dom"] },
    OrgasmControl_R:    { label: "Having orgasm controlled", category: "Control", tags: ["edging", "sub"] },

    // HUMILIATION & DEGRADATION
    Verbal_Humiliate:   { label: "Humiliation play", category: "Humiliation", tags: ["emotional", "kink"] },
    NameCalling:        { label: "Dirty name calling", category: "Verbal", tags: ["intense", "dominant"] },

    // OBJECTIFICATION
    Objectified_R:      { label: "Being treated as an object", category: "Objectification", tags: ["dehumanizing", "sub"] },
    Objectified_G:      { label: "Treating partner as an object", category: "Objectification", tags: ["dehumanizing", "dom"] },

    // SENSORY PLAY
    Blindfold_R:        { label: "Being blindfolded", category: "Sensory", tags: ["helpless", "anticipation"] },
    Blindfold_G:        { label: "Blindfolding partner", category: "Sensory", tags: ["control", "suspense"] },
    IcePlay:            { label: "Using ice for stimulation", category: "Sensory", tags: ["temperature"] },
    WaxPlay:            { label: "Dripping wax", category: "Sensory", tags: ["temperature", "sting"] },

    // BREEDING & IMPREGNATION (if used)
    Breeding_Kink:      { label: "Breeding/impregnation kink", category: "Climax", tags: ["risk", "reproductive"] },
    Creampie_Preference:{ label: "Prefers internal finish", category: "Climax", tags: ["climax", "preference"] }
  };
  