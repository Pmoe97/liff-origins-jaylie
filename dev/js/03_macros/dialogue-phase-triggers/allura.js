/* Allura Conversation Options Phase 0 */
setup.allura_Conversation_Options_Phase0 = function () {
    setup.addChoices([
      ["You seem very sure of yourself.", "Allura_SureOfSelf"],
      ["What brings someone like you to a place like this?", "Allura_WhyHere"],
      ["What would you do with someone like me?", "Allura_TeaseIntent"],
      ["Do you think you could help me get a drink?", "Allura_OrderDrink"],
      ["I just want to get to know you better.", "Allura_StartMinigame"],
      ["Nevermind.", "ReturnToParlor"]
    ]);
  };

  /* Allura Conversation Options Phase 1 */
  setup.allura_Conversation_Options_Phase1 = function () {
    setup.addChoices([
      ["What do you really want from people?", "Allura_WhatSheWants"],
      ["Do you ever feel alone, even here?", "Allura_FeelsAlone"],
      ["Is there someone you miss?", "Allura_SomeoneMissed"],
      ["Do you believe in love?", "Allura_BelievesInLove"],
      ["We don’t have to talk about this.", "Allura_ReturnToLight"]
    ]);
  };
  
  
