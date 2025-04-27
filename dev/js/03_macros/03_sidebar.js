// 03_sidebar.js

setup.SidebarUI = {
	initialize() {
		const toggleButton = document.getElementById("sidebar-toggle");
	  
		if (!toggleButton) {
		  console.warn("[SidebarUI] Sidebar toggle button not found during initialize().");
		  return;
		}
	  
		toggleButton.addEventListener("click", setup.SidebarUI.toggleSidebar);
	  
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
  
	  if (arrow && typeof lucide !== "undefined") {
		const isCollapsed = sidebar.classList.contains("collapsed");
		arrow.setAttribute("data-lucide", isCollapsed ? "arrow-right" : "arrow-left");
		lucide.createIcons();
	  }
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
  