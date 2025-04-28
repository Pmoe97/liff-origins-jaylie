// 03_sidebar.js

setup.SidebarUI = {
	initialize() {
		console.log("[SidebarUI] Initializing SidebarUI...");
		const toggleButton = document.getElementById("sidebar-toggle");
	  
		if (!toggleButton) {
		  console.warn("[SidebarUI] Sidebar toggle button not found during initialize().");
		  return;
		}
		console.log("[SidebarUI] Found toggleButton:", toggleButton);
		toggleButton.addEventListener("click", function() {
			console.log("[SidebarUI] Collapse button clicked!");
			setup.SidebarUI.toggleSidebar();
		});
	  
		// Define a smart Lucide retry loop
		function tryLucideIcons() {
		  if (typeof lucide !== "undefined") {
			lucide.createIcons();
			console.log("[SidebarUI] Lucide icons rendered successfully!");
		  } else {
			console.warn("[SidebarUI] Lucide not ready yet — retrying in 250ms...");
			setTimeout(tryLucideIcons, 250);
		  }
		}
	  
		// Start trying to render Lucide icons
		tryLucideIcons();
	  },
	  
  
	  toggleSidebar() {
		const sidebar = document.getElementById("custom-sidebar");
		const arrow = document.getElementById("sidebar-arrow");

		if (!sidebar) {
			console.warn("[SidebarUI] Custom sidebar not found during toggleSidebar().");
			return;
		}

		sidebar.classList.toggle("collapsed");

		if (arrow) {
			const isCollapsed = sidebar.classList.contains("collapsed");
			arrow.style.transform = isCollapsed ? "rotate(180deg)" : "rotate(0deg)";
		}

		if (sidebar.classList.contains("collapsed")) {
			document.body.classList.add("sidebar-collapsed");
		} else {
			document.body.classList.remove("sidebar-collapsed");
		}

		console.log(`[SidebarUI] Sidebar is now ${sidebar.classList.contains("collapsed") ? "collapsed" : "expanded"}.`);
	}
};
  
  // Initialize Sidebar when Story is Ready
  $(document).one(':storyready', function () {
	if (setup.SidebarUI?.initialize) {
	  setup.SidebarUI.initialize();
	} else {
	  console.error("[SidebarUI] Initialization failed: setup.SidebarUI missing.");
	}
  });
  