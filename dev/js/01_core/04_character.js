/* ================================
=  Character Dialogue & Avatars  =
================================ */

setup.initializeCharacters = function () {
	return{
		jaylie: {
			name: "Jaylie",
			defaultName: "Jaylie",
			known: true,
			avatar: "images/portrait_jaylie.png",
			color: "white",
			bgColor: "rgba(110, 43, 54, 0.8)",

			isPlayer: true, // Optional: May be used to prevent this character from appearing in random events

			// Optional fallback portrait info — no runtime body data needed here
			pronouns: {
				subject: "she",
				object: "her",
				possessive: "her",
				reflexive: "herself",
				noun: "woman"
			},

			// Optional static traits used only for fallback conversations
			traits: ["Curious", "Stubborn", "Playful"],
			socialStyle: "Warm"
		},

		
  
		adda: {
			name: "Mistress Adda",
			defaultName: "Brothel Mistress",
			known: false,
			avatar: "images/portrait_mistressadda.png",
			color: "white",
			bgColor: "rgba(32, 32, 32, 0.8)",
		
			trust: 0,
			affection: 0,
			rapport: 0.5,
			tension: 0,
		
			traits: ["Dominant", "Wise", "Seductive"],
			inclinations: ["bondage", "praise", "service"],
			motivations: ["Control", "Guidance"],
			socialStyle: "Regal",
			
			pronouns: {
				subject: "she",         // he / they
				object: "her",          // him / them
				possessive: "her",      // his / their
				reflexive: "herself",   // himself / themself
				noun: "woman"           // man / person
			  },
			  
			body: {
				height: 69, // 5'9"
				breastSize: 4, // "large"
				buttSize: 3, // "round"
				bodyType: 4, // "curvy"
				lipFullness: 3, // "full"
				skinTone: "olive",
				muscleTone: 2, // "fit"
				hipWidth: 3, // "very wide"
				bodyHair: 1, // "light"
				voiceTone: "commanding",
				hairColor: "iron-gray with black undertones",
				hairStyle: "elegantly pinned with loose waves",
				hairLength: 20, // "mid-back"
				eyeColor: "dark hazel"
			},
		
			preferences: {
				sexualActs: {
					likes: [
						"Dominate", "Bondage_Use", "Praise_G",
						"Spank_G", "HairPulling_G", "DirtyTalk_G",
						"Vaginal_P", "Oral_R", "OrgasmControl_G"
					],
					dislikes: ["Submit", "Clit_Rub", "Blindfold_R"]
				},
				bodyTypes: {
					likes: ["SlimWaist", "BigButt", "Curvy", "Fit"],
					dislikes: ["Emaciated", "VeryHairy"]
				},
				partners: {
					genderPreference: {
						male: 0.5,
						female: 0.5
					},
					anatomyPreference: {
						penisSize: "modest",
						breastSize: "medium"
					}
				}
			},
			status: {
				excitement: 0,
				maxExcitement: 100,
				fatigue: 0,
				maxFatigue: 100
			  },
			  
		},
		
  
		kallot: {
			name: "Kallot",
			defaultName: "Drunk Man",
			known: false,
			avatar: "images/portrait_kallot.png",
			color: "white",
			bgColor: "rgba(159, 172, 138, 0.8)",
		
			trust: 0,
			affection: 0,
			rapport: 0.5,
			tension: 0,
		
			traits: ["Cynical", "Melancholic", "Awkward"],
			inclinations: ["voyeurism", "vanilla", "submission"],
			motivations: ["Redemption", "Connection"],
			socialStyle: "Humble",
			
			pronouns: {
				subject: "he",         // he / they
				object: "him",          // him / them
				possessive: "his",      // his / their
				reflexive: "himself",   // himself / themself
				noun: "man"           // man / person
			  },
		
			body: {
				height: 68, // 5'8"
				breastSize: null,
				buttSize: 3, // "round"
				penisSize: 6.5, // inches
				bodyType: 5, // "thick"
				lipFullness: 2, // "modest"
				skinTone: "brown",
				muscleTone: 3, // "athletic"
				hipWidth: 2, // "modest"
				bodyHair: 3, // "hairy"
				voiceTone: "gentle",
				hairColor: "dark brown",
				hairStyle: "short and messy",
				hairLength: 2, // ~short
				eyeColor: "muddy blue"
			},
		
			preferences: {
				sexualActs: {
					likes: ["Oral_R", "Oral_G", "Vaginal_P", "Voyeurism", "Submit", "Kissing", "Cuddling"],
					dislikes: ["Dominate", "Spank_G", "Degrade_G"]
				},
				bodyTypes: {
					likes: ["Curvy", "Soft", "Average"],
					dislikes: ["Ripped", "Broad", "VeryTall"]
				},
				partners: {
					genderPreference: {
						male: 0.1,
						female: 0.9
					},
					anatomyPreference: {
						breastSize: "large",
						buttSize: "plump"
					}
				}
			},
			status: {
				excitement: 0,
				maxExcitement: 100,
				fatigue: 0,
				maxFatigue: 100
			  },
			  
		},
		
  
		marie: {
			name: "Marie",
			defaultName: "Brothel Girl",
			known: false,
			avatar: "images/portrait_marie.png",
			color: "white",
			bgColor: "rgba(197, 126, 65, 0.8)",
		
			trust: 0,
			affection: 0,
			rapport: 0.5,
			tension: 0,
		
			traits: ["Introverted", "Guarded", "Submissive"],
			inclinations: ["praise", "service", "submission"],
			motivations: ["Safety", "Freedom"],
			socialStyle: "Reserved",
			
			pronouns: {
				subject: "she",         // he / they
				object: "her",          // him / them
				possessive: "her",      // his / their
				reflexive: "herself",   // himself / themself
				noun: "woman"           // man / person
			  },
			  
			body: {
				height: 61, // 5'1"
				breastSize: 1, // "small"
				buttSize: 2, // "modest"
				bodyType: 1, // "slender"
				lipFullness: 2, // "modest"
				skinTone: "porcelain",
				muscleTone: 0, // "soft"
				hipWidth: 1, // "modest"
				bodyHair: 0, // "smooth"
				voiceTone: "hushed",
				hairColor: "blonde",
				hairStyle: "loose and natural",
				hairLength: 5, // "mid-back"
				eyeColor: "green"
			},
		
			preferences: {
				sexualActs: {
					likes: ["Praise_G", "Oral_G", "Oral_R", "Cuddling", "Kissing", "Fingering_R", "BreastPlay_R"],
					dislikes: ["Spank_G", "HairPulling_G", "Choke_G", "Anal_P", "Clit_Rub"]
				},
				bodyTypes: {
					likes: ["Curvy", "Soft", "Fit"],
					dislikes: ["Ripped", "VeryTall", "Broad"]
				},
				partners: {
					genderPreference: {
						male: 0.3,
						female: 0.7
					},
					anatomyPreference: {
						breastSize: "large",
						penisSize: "modest"
					}
				}
			},
			status: {
				excitement: 0,
				maxExcitement: 100,
				fatigue: 0,
				maxFatigue: 100
			  },
			  
		},
		
  
		eristan: {
			name: "Eristan Velthar",
			defaultName: "Madman",
			known: false,
			avatar: "images/portrait_eristan.png",
			color: "white",
			bgColor: "rgba(53, 18, 4, 0.8)",
		
			trust: 0,
			affection: 0,
			rapport: 0.5,
			tension: 0,
		
			traits: ["Detached", "Curious", "Traumatized"],
			inclinations: ["chastity", "abstinence", "masochism"],
			motivations: ["Prophecy", "Protection"],
			socialStyle: "Unhinged",
			
			pronouns: {
				subject: "he",         // he / they
				object: "him",          // him / them
				possessive: "his",      // his / their
				reflexive: "himself",   // himself / themself
				noun: "man"           // man / person
			  },
		
			body: {
				height: 70, // 5'10"
				breastSize: null,
				buttSize: 0, // "flat"
				bodyType: 0, // "emaciated"
				lipFullness: 1, // "narrow"
				skinTone: "fair",
				muscleTone: 0, // "soft"
				hipWidth: 0, // "narrow"
				bodyHair: 2, // "natural"
				voiceTone: "breathy",
				hairColor: "ashen gray",
				hairStyle: "wild and unkempt",
				hairLength: 4, // "shoulder-length"
				eyeColor: "cloudy blue",
				penisSize: 9.5 // destiny's joke
			},
		
			preferences: {
				sexualActs: {
					likes: [],
					dislikes: [
						"Oral_R", "Oral_G", "Vaginal_P", "Anal_P", "Toys_OnSelf",
						"Toys_Use", "Kissing", "Cuddling", "DirtyTalk_R", "Dominate", "Submit"
					]
				},
				bodyTypes: {
					likes: [],
					dislikes: ["Curvy", "Voluptuous", "Fit", "Broad"]
				},
				partners: {
					genderPreference: {
						male: 0.9,
						female: 0.1
					},
					anatomyPreference: {
						penisSize: "irrelevant",
						breastSize: "irrelevant"
					}
				}
			},
			status: {
				excitement: 0,
				maxExcitement: 100,
				fatigue: 0,
				maxFatigue: 100
			  },
			  
		},
		

		harroc: {
			name: "Harroc",
			defaultName: "Barkeep",
			known: true,
			avatar: "images/portrait_harroc.png",
			color: "white",
			bgColor: "rgba(65, 48, 35, 0.8)",
		
			trust: 0,
			affection: 0,
			rapport: 0.5,
			tension: 0,
		
			traits: ["Stoic", "Kind", "Guarded"],
			inclinations: ["vanilla", "monogamy", "aftercare"],
			motivations: ["Duty", "Redemption"],
			socialStyle: "Grizzled",
			
			pronouns: {
				subject: "he",         // he / they
				object: "him",          // him / them
				possessive: "his",      // his / their
				reflexive: "himself",   // himself / themself
				noun: "man"           // man / person
			  },
		
			body: {
				height: 76, // 6'4"
				breastSize: null,
				buttSize: 2, // "modest"
				bodyType: 6, // "heavyset"
				lipFullness: 2, // "modest"
				skinTone: "brown",
				muscleTone: 5, // "muscular"
				hipWidth: 1, // "modest"
				bodyHair: 3, // "hairy"
				voiceTone: "commanding",
				hairColor: "grizzled black",
				hairStyle: "bald with beard",
				hairLength: 2, // ~"short"
				eyeColor: "dark brown",
				penisSize: 7.5
			},
		
			preferences: {
				sexualActs: {
					likes: ["Vaginal_P", "Cuddling", "Kissing", "BreastPlay_G", "Submit"],
					dislikes: ["Choke_G", "Spank_G", "Toys_Use", "Anal_P"]
				},
				bodyTypes: {
					likes: ["Curvy", "Thick", "Strong"],
					dislikes: ["Slender", "Emaciated"]
				},
				partners: {
					genderPreference: {
						female: 1.0,
						male: 0.0
					},
					anatomyPreference: {
						breastSize: "large",
						penisSize: null
					}
				}
			},
			status: {
				excitement: 0,
				maxExcitement: 100,
				fatigue: 0,
				maxFatigue: 100
			  },
			  
		},

		tesska: {
			name: "Tesska",
			defaultName: "Barmaid",
			known: false,
			avatar: "images/portrait_tesska.png",
			color: "white",
			bgColor: "rgba(189, 108, 99, 0.85)",
		
			trust: 0,
			affection: 0,
			rapport: 0.5,
			tension: 0,
		
			traits: ["Flirty", "Crude", "Confident"],
			inclinations: ["exhibitionist", "teasing", "dominant"],
			motivations: ["Freedom", "Excitement"],
			socialStyle: "Feisty",

			pronouns: {
				subject: "she",         // he / they
				object: "her",          // him / them
				possessive: "her",      // his / their
				reflexive: "herself",   // himself / themself
				noun: "woman"           // man / person
			  },
			  
		
			body: {
				height: 64, // 5'4"
				breastSize: 4, // "large"
				buttSize: 3, // "round"
				bodyType: 5, // "thick"
				lipFullness: 3, // "full"
				skinTone: "golden",
				muscleTone: 4, // "defined"
				hipWidth: 2, // "wide"
				bodyHair: 1, // "light"
				voiceTone: "melodic",
				hairColor: "fiery red",
				hairStyle: "braided",
				hairLength: 5, // "mid-back"
				eyeColor: "hazel"
			},
		
			preferences: {
				sexualActs: {
					likes: ["Oral_G", "Oral_R", "Spank_G", "HairPulling_G", "Vaginal_P", "Toys_Use", "Dominate"],
					dislikes: ["Submit", "Choke_R"]
				},
				bodyTypes: {
					likes: ["Muscular", "Broad", "Defined"],
					dislikes: ["Emaciated", "Soft"]
				},
				partners: {
					genderPreference: {
						male: 0.9,
						female: 0.1
					},
					anatomyPreference: {
						penisSize: "large",
						breastSize: "medium"
					}
				}
			},
			status: {
				excitement: 0,
				maxExcitement: 100,
				fatigue: 0,
				maxFatigue: 100
			  },
			  
		},
		
		allura: {
			name: "Allura",
			defaultName: "Exotic Hostess",
			known: false,
			avatar: "images/portrait_allura.png",
			color: "white",
			bgColor: "rgba(20, 152, 232, 0.6)",

			trust: 0,
			affection: 0,
			rapport: 0.5,
			tension: 0,

			traits: ["Flirty", "Cynical", "Confident"],
			inclinations: ["bondage", "dominant", "sadism", "exhibitionism"],
			motivations: ["Pleasure", "Family"],
			socialStyle: "Seductive",
			
			pronouns: {
				subject: "she",
				object: "her",
				possessive: "her",
				reflexive: "herself",
				noun: "woman"
			},

			body: {
				height: 68, // 5'8"
				breastSize: 5, // "very large"
				buttSize: 4, // "plump"
				bodyType: 4, // "curvy"
				lipFullness: 4, // "plump"
				skinTone: "midnight blue",
				muscleTone: 3, // "athletic"
				hipWidth: 3, // "very wide"
				bodyHair: 0, // "smooth"
				voiceTone: "breathy",
				hairColor: "black",
				hairStyle: "voluminous and wild",
				hairLength: 6, // "waist-length"
				eyeColor: "gold",
				horns: "small curled obsidian",
				ears: "long and pointed",

				// Required anatomy
				vagina: true,
				buttSize: 3,
				anus: true,
				clitoris: true,
				penisSize: 4
			},

			preferences: {
				sexualActs: {
					likes: [
						"Dominate", "Bondage_Use", "Choke_G", "Spank_G", "Toys_Use",
						"Oral_G", "Oral_R", "FaceSit", "Praise_G", "DirtyTalk_G", "Vaginal_P"
					],
					dislikes: ["Submit", "Cuddling", "Creampie_Preference"]
				},
				bodyTypes: {
					likes: ["Defined", "Broad", "Fit", "Muscular"],
					dislikes: ["Soft", "Emaciated"]
				},
				partners: {
					genderPreference: {
						male: 0.6,
						female: 0.4
					},
					anatomyPreference: {
						penisSize: "large",
						breastSize: "medium"
					}
				}
			},

			status: {
				excitement: 0,
				maxExcitement: 100,
				fatigue: 0,
				maxFatigue: 100
			}
		},
	
		darian: {
			name: "Darian",
			defaultName: "Male Host",
			known: false,
			avatar: "images/portrait_darian.png",
			color: "white",
			bgColor: "rgba(126, 66, 0, 0.6)",
		
			trust: 3,
			affection: 0,
			rapport: 1.0,
			tension: 0,
			cooldown: 0,
		
			traits: ["Flirty", "Confident", "Charming"],
			inclinations: ["voyeurism", "exhibitionism", "praise", "gentle"],
			motivations: ["Pleasure", "Connection"],
			socialStyle: "Charming",
			
			pronouns: {
				subject: "he",         // he / they
				object: "him",          // him / them
				possessive: "his",      // his / their
				reflexive: "himself",   // himself / themself
				noun: "man"           // man / person
			  },

			body: {
				height: 70, // 5'10"
				breastSize: null,
				buttSize: 3, // "round"
				bodyType: 3, // "average"
				lipFullness: 3, // "full"
				skinTone: 5, // "deep brown"
				muscleTone: 4, // "defined"
				hipWidth: 2, // "modest"
				bodyHair: 1, // "light"
				voiceTone: "melodic",
				hairColor: "black",
				hairStyle: "short and soft",
				hairLength: "short",
				eyeColor: "warm brown",
				penisSize: 7 // inches – proportional, generous but not absurd
			},
		
			preferences: {
				sexualActs: {
					likes: [
						"Praise_G", "Kissing", "Oral_R", "Oral_G", "Cuddling", 
						"Vaginal_P", "Anal_P", "RomanticPlay", "SensualMassage"
					],
					dislikes: ["Degrade_G", "Choke_G", "Spank_G"]
				},
				bodyTypes: {
					likes: ["Curvy", "Average", "Fit", "Soft"],
					dislikes: ["Broad", "VeryTall"]
				},
				partners: {
					genderPreference: {
						male: 0.5,
						female: 0.5
					},
					anatomyPreference: {
						penisSize: "modest",
						breastSize: "full"
					}
				}
			},
			status: {
				excitement: 0,
				maxExcitement: 100,
				fatigue: 0,
				maxFatigue: 100
			  },
			  
		},
		
		bert: {
			name: "Bert",
			defaultName: "Brothel Bartender",
			known: false,
			avatar: "images/portrait_bert.png",
			color: "white",
			bgColor: "rgba(74, 76, 69, 0.6)",
		
			trust: 0,
			affection: 0,
			rapport: 1.0,
			tension: 0,
			cooldown: 0,
		
			traits: ["Stoic", "Cynical", "Guarded"],
			inclinations: ["voyeurism", "abstinence"],
			motivations: ["Loyalty", "Devotion"],
			socialStyle: "Stoic",

			pronouns: {
				subject: "he",         // he / they
				object: "him",          // him / them
				possessive: "his",      // his / their
				reflexive: "himself",   // himself / themself
				noun: "man"           // man / person
			  },
		
			body: {
				height: 70, // 5'10"
				breastSize: null,
				buttSize: 2, // modest
				bodyType: 5, // thick
				lipFullness: 1, // narrow
				skinTone: 2, // golden
				muscleTone: 3, // athletic
				hipWidth: 1, // modest
				bodyHair: 2, // natural
				voiceTone: "raspy",
				hairColor: "black with graying at temples",
				hairStyle: "neatly parted",
				hairLength: "cropped",
				eyeColor: "iron gray",
				penisSize: 5.5 // statistically average, likely unused
			},
		
			preferences: {
				sexualActs: {
					likes: [],
					dislikes: ["Oral_G", "Oral_R", "Vaginal_P", "Anal_P", "Toys_Use", "Submit", "Dominate"]
				},
				bodyTypes: {
					likes: [],
					dislikes: []
				},
				partners: {
					genderPreference: {
						male: 0.5,
						female: 0.5
					},
					anatomyPreference: {
						penisSize: "irrelevant",
						breastSize: "irrelevant"
					}
				}
			},
			status: {
				excitement: 0,
				maxExcitement: 100,
				fatigue: 0,
				maxFatigue: 100
			  },
			  
		},

		redmarrow: {
			name: "Leopold Redmarrow",
			defaultName: "Bounty Hunter",
			known: false,
			avatar: "images/portrait_redmarrow.png", // You can swap in your actual filename
			color: "white",
			bgColor: "rgba(132, 54, 54, 0.75)",

			trust: 0,
			affection: 0,
			rapport: 0.5,
			tension: 0,

			traits: ["Flashy", "Evasive", "Charismatic"],
			inclinations: ["performance", "control", "deception"],
			motivations: ["Reputation", "Comfort"],
			socialStyle: "Charming",

			pronouns: {
				subject: "he",
				object: "him",
				possessive: "his",
				reflexive: "himself",
				noun: "man"
			},

			body: {
				height: 71, // 5'11"
				breastSize: null,
				buttSize: 2, // "modest"
				bodyType: 3, // "average"
				lipFullness: 3, // "full"
				skinTone: "light olive",
				muscleTone: 2, // "fit"
				hipWidth: 2, // "modest"
				bodyHair: 1, // "light"
				voiceTone: "silken",
				hairColor: "rich chestnut brown",
				hairStyle: "slicked back under a wide-brimmed hat",
				hairLength: 3, // "short-medium"
				eyeColor: "hazel",
				penisSize: 6.5 // enough for bravado
			},

			preferences: {
				sexualActs: {
					likes: ["Praise_R", "Teasing", "Oral_R", "RomanticPlay"],
					dislikes: ["Submit", "Cuddling", "Anal_P"]
				},
				bodyTypes: {
					likes: ["Elegant", "Fit", "Mysterious"],
					dislikes: ["Disheveled", "OverlyMuscular"]
				},
				partners: {
					genderPreference: {
						male: 0.4,
						female: 0.6
					},
					anatomyPreference: {
						penisSize: "modest",
						breastSize: "medium"
					}
				}
			},

			status: {
				excitement: 0,
				maxExcitement: 100,
				fatigue: 0,
				maxFatigue: 100
			}
		},

		brakka: {
			name: "Brakka",
			defaultName: "Half-Orc Fighter",
			known: false,
			avatar: "images/portrait_brakka.png", // Swap with actual path
			color: "white",
			bgColor: "rgba(85, 110, 73, 0.8)",

			trust: 0,
			affection: 0,
			rapport: 0.4,
			tension: 0,

			traits: ["Blunt", "Short-Tempered", "Independent"],
			inclinations: ["dominance", "violence", "solitude"],
			motivations: ["Strength", "Respect"],
			socialStyle: "Rough",

			pronouns: {
				subject: "she",
				object: "her",
				possessive: "her",
				reflexive: "herself",
				noun: "woman"
			},

			body: {
				height: 73, // 6'1"
				breastSize: 2, // "modest"
				buttSize: 2, // "modest"
				bodyType: 5, // "muscular"
				lipFullness: 2, // "modest"
				skinTone: "greenish bronze",
				muscleTone: 6, // "ripped"
				hipWidth: 2, // "modest"
				bodyHair: 2, // "natural"
				voiceTone: "gravelly",
				hairColor: "black",
				hairStyle: "shaved sides, top tied back",
				hairLength: 2, // "short"
				eyeColor: "amber"
			},

			preferences: {
				sexualActs: {
					likes: ["Dominate", "Spank_G", "WrestlePlay", "Teasing"],
					dislikes: ["Cuddling", "Praise_R", "Service"]
				},
				bodyTypes: {
					likes: ["Strong", "Lean", "Fit"],
					dislikes: ["Delicate", "OverlySoft"]
				},
				partners: {
					genderPreference: {
						male: 0.5,
						female: 0.5
					},
					anatomyPreference: {
						penisSize: "large",
						breastSize: "irrelevant"
					}
				}
			},

			status: {
				excitement: 0,
				maxExcitement: 100,
				fatigue: 0,
				maxFatigue: 100
			}
		},

		sarjan: {
			name: "Sarjan",
			defaultName: "Dice Rat Leader",
			known: false,
			avatar: "images/portrait_sarjan.png", // Placeholder path
			color: "white",
			bgColor: "rgba(80, 40, 20, 0.85)",

			trust: -1,
			affection: 0,
			rapport: 0.3,
			tension: 0.6,

			traits: ["Crass", "Mocking", "Dominant"],
			inclinations: ["gambling", "taunting", "misogyny"],
			motivations: ["Control", "Entertainment"],
			socialStyle: "Brash",

			pronouns: {
				subject: "he",
				object: "him",
				possessive: "his",
				reflexive: "himself",
				noun: "man"
			},

			body: {
				height: 69, // 5'9"
				breastSize: null,
				buttSize: 2, // "modest"
				bodyType: 3, // "average"
				lipFullness: 1, // "narrow"
				skinTone: "sallow tan",
				muscleTone: 3, // "defined"
				hipWidth: 2, // "modest"
				bodyHair: 2, // "natural"
				voiceTone: "grating",
				hairColor: "dirty blonde",
				hairStyle: "greased back",
				hairLength: 2, // "short"
				eyeColor: "murky green",
				penisSize: 5.5
			},

			preferences: {
				sexualActs: {
					likes: ["Dominate", "Oral_R", "FaceSit", "Degrade_G"],
					dislikes: ["Submit", "Praise_G", "RomanticPlay"]
				},
				bodyTypes: {
					likes: ["Petite", "Curvy", "Busty"],
					dislikes: ["Muscular", "Androgynous"]
				},
				partners: {
					genderPreference: {
						male: 0.0,
						female: 1.0
					},
					anatomyPreference: {
						breastSize: "large",
						penisSize: null
					}
				}
			},

			status: {
				excitement: 0,
				maxExcitement: 100,
				fatigue: 0,
				maxFatigue: 100
			}
		},


		/* Minor characters */
		diceratone: {
			name: "Dice Rat 1",
			defaultName: "Skinny Dice-Rat",
			known: false,
			avatar: "images/portrait_diceratone.png", // Placeholder path
			color: "white",
			bgColor: "rgba(182, 89, 2, 0.85)",
		},
		dicerattwo: {
			name: "Dice Rat 2",
			defaultName: "Fat Dice-Rat",
			known: false,
			avatar: "images/portrait_dicerattwo.png", // Placeholder path
			color: "white",
			bgColor: "rgba(182, 89, 2, 0.85)",
		},

	};
};
  
  /* Character Dialogue & Avatars - End */