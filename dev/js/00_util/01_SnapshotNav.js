/* ===============================
   SNAPSHOT SYSTEM
   =============================== */

   setup.Snapshots = [];
   setup.CurrentSnapshotIndex = -1;
   setup.MaxSnapshots = 10;
   setup.suppressNextSnapshot = false;
   
   // Track UI states manually (optional per-feature)
   setup.getUIState = function () {
       return {
           dialogueMode: State.getVar('_dialogueMode') || false,
           shopOpen: State.getVar('_shopOpen') || false,
       };
   };
   
   setup.applyUIState = function (uiState) {
       if (uiState.dialogueMode !== undefined) State.setVar('_dialogueMode', uiState.dialogueMode);
       if (uiState.shopOpen !== undefined) State.setVar('_shopOpen', uiState.shopOpen);
   };
   
   setup.takeSnapshot = function () {
       const snapshot = {
           variables: clone(State.variables),
           temporary: clone(State.temporary),
           uiState: setup.getUIState(),
           passageName: passage(),
       };
   
       if (setup.CurrentSnapshotIndex < setup.Snapshots.length - 1) {
           setup.Snapshots = setup.Snapshots.slice(0, setup.CurrentSnapshotIndex + 1);
       }
   
       setup.Snapshots.push(snapshot);
   
       if (setup.Snapshots.length > setup.MaxSnapshots) {
           setup.Snapshots.shift();
       }
   
       setup.CurrentSnapshotIndex = setup.Snapshots.length - 1;
       setup.saveSnapshotsToStorage();
       setup.updateNavButtons();
   };
   
   setup.saveSnapshotsToStorage = function () {
       try {
           const serialized = JSON.stringify(setup.Snapshots);
           window.localStorage.setItem('game_snapshots', serialized);
       } catch (error) {
           console.error("[Snapshot] Failed to save snapshots:", error);
       }
   };
   
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
       setup.updateNavButtons();
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
   
       Object.assign(State.variables, clone(snapshot.variables));
       Object.assign(State.temporary, clone(snapshot.temporary));
       setup.applyUIState(snapshot.uiState);
   
       setup.CurrentSnapshotIndex = index;
       setup.suppressNextSnapshot = true;
   
       // ✅ Trigger UI hydration flag — let :passagerender handle rehydration
       State.variables.needsUIRehydrate = true;
   
       Engine.play(snapshot.passageName, true);
   
       setup.updateNavButtons();
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
   
   setup.updateNavButtons = function () {
       const backBtn = document.getElementById("sidebar-nav-back");
       const forwardBtn = document.getElementById("sidebar-nav-forward");
   
       if (backBtn) {
           backBtn.disabled = setup.CurrentSnapshotIndex <= 0;
       }
       if (forwardBtn) {
           forwardBtn.disabled = setup.CurrentSnapshotIndex >= setup.Snapshots.length - 1;
       }
   };
   
   $(document).on(':passagedisplay', function () {
       if (setup.suppressNextSnapshot) {
           setup.suppressNextSnapshot = false;
           return;
       }
       setup.takeSnapshot();
   });
   
   setup.clearSnapshots = function () {
       setup.Snapshots = [];
       setup.CurrentSnapshotIndex = -1;
       window.localStorage.removeItem('game_snapshots');
       setup.updateNavButtons();
   };
   
   /* ===============================
      END SNAPSHOT SYSTEM
      =============================== */
   