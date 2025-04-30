// ===============================
// 📦 Dialogue Layout Macros
// ===============================

// ✅ Injects the side-by-side convo UI and moves passage content to convoBox
Macro.add("StartDialogueLayout", {
	handler() {
	  const backdrop = document.getElementById('text-backdrop');
	  if (!backdrop) {
		console.warn("<<StartDialogueLayout>> failed: #text-backdrop not found.");
		return;
	  }
  
	  backdrop.classList.add("in-dialogue");
  
	  // Inject layout HTML
	  backdrop.innerHTML = `
		<div id="convoLayoutContainer">
		  <div id="convoChoicesPanel"><div id="convoChoices"></div></div>
		  <div id="convoBoxPanel"><div id="convoBox"></div></div>
		</div>
	  `;
  
	  // Wait until the passage is rendered, then move it into the convoBox
	  const tryInjectPassage = () => {
		const passage = document.querySelector('#passages > .passage');
		const convoBox = document.getElementById('convoBox');
  
		if (passage && convoBox) {
		  convoBox.appendChild(passage);
		} else {
		  requestAnimationFrame(tryInjectPassage);
		}
	  };
  
	  tryInjectPassage();
	}
  });
  
  // ✅ Optional: removes .in-dialogue class to restore normal layout visuals
  Macro.add("EndDialogueLayout", {
	handler() {
	  const backdrop = document.getElementById('text-backdrop');
	  if (backdrop) {
		backdrop.classList.remove("in-dialogue");
	  }
	}
  });
  
  // ✅ Wraps content and moves it into the #convoChoices container
  Macro.add("LayoutConvoChoices", {
	tags: [], // <- Must be defined for block content support
	handler() {
	  const content = [...this.output];
  
	  const tryInject = () => {
		const target = document.getElementById('convoChoices');
		if (target) {
		  const frag = document.createDocumentFragment();
		  content.forEach(el => frag.appendChild(el));
		  target.appendChild(frag);
		} else {
		  requestAnimationFrame(tryInject);
		}
	  };
  
	  tryInject();
	}
  });
  
  // ✅ Clears old convo choices before injecting new ones
  setup.clearConvoChoices = function () {
	const choicesPanel = document.getElementById("convoChoices");
	if (choicesPanel) {
	  choicesPanel.innerHTML = "";
	}
  };
  