/* ===============================
   SNAPSHOT SYSTEM
   =============================== */

   setup.Snapshots = [];
   setup.CurrentSnapshotIndex = -1;
   setup.MaxSnapshots = 10;
   
   // Track UI states manually
   setup.getUIState = function () {
       return {
           dialogueMode: State.getVar('_dialogueMode') || false,
           shopOpen: State.getVar('_shopOpen') || false,
           // Add more custom UI states here
       };
   };
   
   setup.applyUIState = function (uiState) {
       if (uiState.dialogueMode !== undefined) State.setVar('_dialogueMode', uiState.dialogueMode);
       if (uiState.shopOpen !== undefined) State.setVar('_shopOpen', uiState.shopOpen);
       // Apply more custom UI states here
   };
   
   setup.takeSnapshot = function () {
	const snapshot = {
		variables: clone(State.variables),
		temporary: clone(State.temporary),
		uiState: setup.getUIState(),
		passageName: passage(), // Optional: capture passage name for safety
	};

	setup.Snapshots.push(snapshot);

	if (setup.Snapshots.length > setup.MaxSnapshots) {
		setup.Snapshots.shift();
	}

	setup.CurrentSnapshotIndex = setup.Snapshots.length - 1;

	// 🧠 Save to localStorage
	setup.saveSnapshotsToStorage();
    };
    setup.saveSnapshotsToStorage = function () {
	try {
		const serialized = JSON.stringify(setup.Snapshots);
		window.localStorage.setItem('game_snapshots', serialized);
	} catch (error) {
		console.error("[Snapshot] Failed to save snapshots:", error);
	}
    };

   
   setup.loadSnapshot = function (index) {
       if (index < 0 || index >= setup.Snapshots.length) {
           console.warn("[Snapshot] Tried to load invalid index:", index);
           return;
       }
   
       const snapshot = setup.Snapshots[index];
       if (!snapshot) {
           console.warn("[Snapshot] No snapshot at index:", index);
           return;
       }
   
       // Overwrite states
       Object.assign(State.variables, clone(snapshot.variables));
       Object.assign(State.temporary, clone(snapshot.temporary));
       setup.applyUIState(snapshot.uiState);
   
       setup.CurrentSnapshotIndex = index;
   
       // Reload the correct passage
       Engine.play(snapshot.passageName, true);
   };
   
   setup.navBack = function () {
       if (setup.CurrentSnapshotIndex > 0) {
           setup.loadSnapshot(setup.CurrentSnapshotIndex - 1);
       } else {
           UI.alert("No earlier snapshots available.");
       }
   };
   
   setup.navForward = function () {
       if (setup.CurrentSnapshotIndex < setup.Snapshots.length - 1) {
           setup.loadSnapshot(setup.CurrentSnapshotIndex + 1);
       } else {
           UI.alert("No newer snapshots available.");
       }
   };
   
   // Auto-snapshot after every passage render
   $(document).on(':passagedisplay', function (event) {
       setup.takeSnapshot();
   });
   
   setup.loadSnapshotsFromStorage = function () {
	try {
		const serialized = window.localStorage.getItem('game_snapshots');
		if (serialized) {
			setup.Snapshots = JSON.parse(serialized);
			setup.CurrentSnapshotIndex = setup.Snapshots.length - 1;
			console.log("[Snapshot] Snapshots restored from storage.");
		}
	} catch (error) {
		console.error("[Snapshot] Failed to load snapshots:", error);
		setup.Snapshots = [];
		setup.CurrentSnapshotIndex = -1;
	}
};

// Call it immediately when game starts
setup.loadSnapshotsFromStorage();

   /* ===============================
      END SNAPSHOT SYSTEM
      =============================== */
   