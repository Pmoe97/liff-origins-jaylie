setup.DataAuditor = {
    listUniqueValues(objectArray, property) {
      const values = objectArray.flatMap(item => {
        if (Array.isArray(item[property])) {
          return item[property].map(val => val.toLowerCase());
        } else if (item[property] !== undefined) {
          return [item[property].toLowerCase()];
        } else {
          return [];
        }
      });
      const uniqueValues = [...new Set(values)];
      console.log(`✅ Unique "${property}" values (${uniqueValues.length} total):`, uniqueValues.sort());
      return uniqueValues;
    },
  
    compareValues(listA, listB) {
      const lowerA = listA.map(val => val.toLowerCase());
      const lowerB = listB.map(val => val.toLowerCase());
      const missingFromB = lowerA.filter(val => !lowerB.includes(val));
      const missingFromA = lowerB.filter(val => !lowerA.includes(val));
      console.group("🧹 Data Comparison Results:");
      console.log("In A but missing from B:", missingFromB.length ? missingFromB : "None");
      console.log("In B but missing from A:", missingFromA.length ? missingFromA : "None");
      console.groupEnd();
    },
  
    auditMultipleArrays(arrays, property) {
      const merged = arrays.flat();
      return this.listUniqueValues(merged, property);
    },

    
  };
  window.audit = {
    prompts: {
      themes() {
        return setup.DataAuditor.listUniqueValues(setup.ConvoPrompts, "theme");
      },
      difficultyMods() {
        return setup.DataAuditor.listUniqueValues(setup.ConvoPrompts, "baseDifficultyMod");
      }
    },
    characters: {
      trustAndAffection() {
        const chars = State.variables.characters || {};
        console.group("🧡 Character Trust and Affection Levels:");
        Object.entries(chars).forEach(([id, char]) => {
          console.log(`${id}: Trust=${char.trust ?? 0} | Affection=${char.affection ?? 0}`);
        });
        console.groupEnd();
      }
    },
    
    tropes: {
      skills() {
        const allTropes = [
          ...setup.ConvoTropesByTier[1],
          ...setup.ConvoTropesByTier[2],
          ...setup.ConvoTropesByTier[3],
          ...setup.ConvoTropesByTier[4],
          ...setup.ConvoTropesByTier[5]
        ];
        return setup.DataAuditor.listUniqueValues(allTropes, "skill");
      },
      effects() {
        const allTropes = [].concat(
          ...Object.values(setup.ConvoTropesByTier)
        );
        const flatKeys = allTropes.flatMap(t => Object.keys(t.effects || {}));
        const unique = [...new Set(flatKeys)];
        console.log("Unique effect keys:", unique.sort());
        return unique;
      }
    },
  
    compare: {
      themesToTraits() {
        const themes = setup.DataAuditor.listUniqueValues(setup.ConvoPrompts, "theme");
        const allTraits = Object.values(State.variables.characters)
          .flatMap(c => c.traits || []);
        const traits = [...new Set(allTraits.map(t => t.toLowerCase()))];
        setup.DataAuditor.compareValues(themes, traits);
      }
    }
  };
  
/*
===========================================================
🧠 DataAuditor.js — Dev Cheatsheet
Quick reference for running audits and comparisons
===========================================================

✅ Quick Natural Language Macros:

audit.prompts.themes();            → List all unique prompt themes
audit.prompts.difficultyMods();     → List all prompt difficulty modifiers
audit.tropes.skills();              → List all skills used in tropes across all tiers
audit.tropes.effects();             → List all unique trust/affection effect keys
audit.compare.themesToTraits();     → Compare prompt themes vs NPC traits

-----------------------------------------------------------

✅ Print a live help menu anytime:
audit.help();

-----------------------------------------------------------

🧠 Run these in your browser's DevTools Console
after compiling your game with Tweego and loading index.html.

Pro Tip: You can suppress duplicate console returns by prefixing commands with 'void'.

Example:
void audit.prompts.themes();

===========================================================
*/

