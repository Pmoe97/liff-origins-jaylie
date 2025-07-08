window.ambientFlavorTags = {
    // Tag priority order (higher number = higher priority)
    _priority: {
        smoke3: 100,  // Highest priority - immediate danger
        smoke2: 90,
        smoke1: 80,
        fire: 70,
        rain: 50,
        fog: 40,
        night: 30,
        day: 20,
        default: 10
    },
    
    // Smoke Tags with weighted/conditional entries
    smoke1: [
        {
            text: "Smoke clings to the air, subtle but persistent, stinging your nose and throat. It lingers in the corners like it's waiting to thicken. You can still breathe easily, but there's no mistaking the presence of fire.",
            weight: 1
        },
        {
            text: "The scent of burning wood creeps through the room, curling into every crevice. The air carries a faint warmth, as if it's been touched by something far away but steadily approaching. It's not choking—yet.",
            weight: 1
        },
        {
            text: "Your lungs feel tight, but not strained. A thin haze floats in the air, softening edges and dimming light. It's the kind of smoke that makes you aware of every breath.",
            weight: 1
        },
        {
            text: "Grey wisps drift lazily above your head, harmless for now. You can taste the smoke if you breathe too deeply, sharp and dry like a forgotten campfire. The air is watchful—like it might change at any moment.",
            weight: 1
        },
        {
            text: "A dull scratchiness builds in the back of your throat with each inhale. It's bearable, but uncomfortable, like standing near a fire too long. The smoke isn't thick, but it's constant, like a warning in the air.",
            weight: 1
        },
        {
            text: "The smoke here mingles with the dampness, creating an oppressive fog that clings to everything.",
            weight: 2,
            conditions: [
                { type: "variable", name: "world.weather", value: "rain", operator: "==" }
            ]
        }
    ],

    smoke2: [
        {
            text: "The smoke here is thick, wrapping around you like a damp shroud. It clings to your skin, seeping into your clothes and hair. Every motion stirs the haze, but it never clears.",
            weight: 1
        },
        {
            text: "Every breath comes with a cough, the air dry and bitter with ash. Your throat feels raw, your chest tight. You instinctively squint against the stinging haze.",
            weight: 1
        },
        {
            text: "Your eyes water as you push forward, vision swimming with every blink. The smoke dances in slow spirals around you, disorienting and relentless. It's hard to tell where anything truly begins or ends.",
            weight: 1
        },
        {
            text: "The walls are reduced to silhouettes behind the swirling grey. Sounds are muffled, distorted by the dense air. It feels like the building itself is holding its breath.",
            weight: 1
        },
        {
            text: "You can feel the smoke invading every part of you—sharp, acidic, inescapable. Breathing takes conscious effort now. The longer you stay, the worse it gets.",
            weight: 1
        }
    ],

    smoke3: [
        {
            text: "The air is nearly solid with smoke—you can barely see your own hands in front of you. Every breath feels like dragging embers into your lungs. Staying here much longer would be suicide.",
            weight: 1
        },
        {
            text: "You're choking now. Each inhale burns, and your body lurches with involuntary coughs. Your lungs are screaming, desperate for air that no longer exists.",
            weight: 1
        },
        {
            text: "You won't last long here. Heat rolls off the walls, and the smoke closes in like a living thing. It's hard to think past the instinct to flee.",
            weight: 1
        },
        {
            text: "Breathing has become an act of desperation. Your body trembles from the effort of simply staying upright. Your vision swims through the smoke-blurred world around you.",
            weight: 1
        },
        {
            text: "Every second here counts. You're drowning in smoke with your feet still on the ground. The pressure in your chest builds with terrifying consistency.",
            weight: 1
        }
    ],
    
    // Example weather tags
    rain: [
        {
            text: "Rain patters steadily against the surfaces around you, creating a rhythmic backdrop to everything else.",
            weight: 1
        },
        {
            text: "The air is thick with moisture, each breath feeling heavy and damp.",
            weight: 1
        },
        {
            text: "Puddles have formed in every depression, reflecting distorted images of the world above.",
            weight: 2,
            conditions: [
                { type: "variable", name: "world.timeOfDay", value: "night", operator: "==" }
            ]
        }
    ],
    
    // Time-based tags (include: time)
    night: [
        {
            text: "Darkness presses in from all sides, broken only by what little light you can find.",
            weight: 1
        },
        {
            text: "The shadows seem deeper here, hiding secrets in their depths.",
            weight: 1
        }
    ],

    morning: [
        {
            text: "The early morning light filters in, painting everything in soft golden hues.",
            weight: 1
        },
        {
            text: "Morning dew still clings to surfaces, catching the first rays of sunlight.",
            weight: 1
        }
    ],
    
    afternoon: [
        {
            text: "The afternoon sun beats down steadily, casting sharp shadows across the area.",
            weight: 1
        },
        {
            text: "The heat of midday makes the air shimmer slightly, creating a drowsy atmosphere.",
            weight: 1
        }
    ],
    
    evening: [
        {
            text: "The fading light of evening bathes everything in warm orange and purple tones.",
            weight: 1
        },
        {
            text: "Long shadows stretch across the ground as the sun begins its descent.",
            weight: 1
        }
    ],
    
    // Weather tags (include: weather)
    clear: [
        {
            text: "The air is crisp and clear, offering perfect visibility in all directions.",
            weight: 1
        }
    ],
    
    fog: [
        {
            text: "A thick fog rolls through the area, muffling sounds and limiting visibility.",
            weight: 1
        },
        {
            text: "The mist clings to everything, creating an ethereal, dreamlike atmosphere.",
            weight: 1
        }
    ],
    snow: [
        {
            text: "Snow falls gently, blanketing the ground in a soft, white layer.",
            weight: 1
        },
        {
            text: "The world is hushed under the weight of fresh snow, muffling all sound.",
            weight: 1
        }
    ],
    rain: [
        {
            text: "Rain patters steadily against the surfaces around you, creating a rhythmic backdrop to everything else.",
            weight: 1
        },
        {
            text: "The air is thick with moisture, each breath feeling heavy and damp.",
            weight: 1
        },
        {
            text: "Puddles have formed in every depression, reflecting distorted images of the world above.",
            weight: 2,
            conditions: [
                { type: "variable", name: "world.timeOfDay", value: "night", operator: "==" }
            ]
        }
    ],
    
    // Season tags (include: season)
    spring: [
        {
            text: "Fresh spring blooms add splashes of color to the surroundings.",
            weight: 1
        }
    ],
    
    summer: [
        {
            text: "The heavy heat of summer makes every movement feel like an effort.",
            weight: 1
        }
    ],
    
    autumn: [
        {
            text: "Fallen leaves crunch underfoot, painting the ground in reds and golds.",
            weight: 1
        }
    ],
    
    winter: [
        {
            text: "A bitter chill hangs in the air, making you pull your clothing tighter.",
            weight: 1
        }
    ]
};
