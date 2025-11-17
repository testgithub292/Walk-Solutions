// Component Loader with proper initialization
class ComponentLoader {
    constructor() {
        this.componentsLoaded = 0;
        this.totalComponents = 2; // navbar + footer
    }

    // Load component with proper initialization
    async loadComponent(url, elementId) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            
            const data = await response.text();
            document.getElementById(elementId).innerHTML = data;
            
            console.log(`✅ ${elementId} loaded successfully`);
            
            // Initialize component specific functionality
            this.initializeComponent(elementId);
            
            this.componentsLoaded++;
            this.checkAllComponentsLoaded();
            
        } catch (error) {
            console.error(`❌ Error loading ${elementId}:`, error);
        }
    }

    // Initialize component specific functionality
    initializeComponent(elementId) {
        if (elementId === 'navbar-container') {
            this.initializeNavbar();
        } else if (elementId === 'footer-container') {
            this.initializeFooter();
        }
    }

    // Initialize navbar functionality
    initializeNavbar() {
        const navbar = document.querySelector('.navbar-premium');
        if (!navbar) return;

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile dropdown scroll fix
        this.fixMobileDropdowns();

        // Active link highlighting
        this.setActiveNavLink();

        console.log('🎯 Navbar initialized with animations');
    }

    // Initialize footer functionality
    initializeFooter() {
        console.log('🎯 Footer initialized');
    }

    // Fix mobile dropdown scrolling
    fixMobileDropdowns() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('dropdown-toggle')) {
                const dropdown = e.target.nextElementSibling;
                if (window.innerWidth < 992 && dropdown) {
                    dropdown.style.maxHeight = '300px';
                    dropdown.style.overflowY = 'auto';
                }
            }
        });

        // Recalculate on window resize
        window.addEventListener('resize', () => {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(dropdown => {
                if (window.innerWidth < 992) {
                    dropdown.style.maxHeight = '300px';
                    dropdown.style.overflowY = 'auto';
                } else {
                    dropdown.style.maxHeight = '';
                    dropdown.style.overflowY = '';
                }
            });
        });
    }

    // Set active nav link based on current page
    setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Check if all components are loaded
    checkAllComponentsLoaded() {
        if (this.componentsLoaded === this.totalComponents) {
            this.finalizeInitialization();
        }
    }

    // Final initialization after all components are loaded
    finalizeInitialization() {
        // Reinitialize AOS for new content
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                
            });
            console.log('🔄 AOS reinitialized');
        }

        // Reinitialize Bootstrap components if needed
        this.reinitializeBootstrap();

        console.log('🎉 All components loaded and initialized');

            // 👇 Show body after all components load
    // document.body.style.display = 'block';
    document.body.style.opacity = '1';
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('componentsLoaded'));
    }

    // Reinitialize Bootstrap components
    reinitializeBootstrap() {
        // If you have any custom Bootstrap initialization, do it here
        const dropdowns = document.querySelectorAll('.dropdown-toggle');
        dropdowns.forEach(dropdown => {
            // Bootstrap automatically handles these, but you can add custom logic here
        });
    }

    // Load all components
    // loadAllComponents() {
    //     console.log('🔄 Loading components...');
        
    //     // Load navbar
    //     this.loadComponent('nav.html', 'navbar-container');
        
    //     // Load footer
    //     this.loadComponent('footer.html', 'footer-container');
    // }
    // Load all components (parallel loading)

    
loadAllComponents() {
    console.log('🔄 Loading components in parallel...');

    Promise.all([
        this.loadComponent('nav.html', 'navbar-container'),
        this.loadComponent('footer.html', 'footer-container')
    ]).then(() => {
        this.finalizeInitialization();
    }).catch(error => {
        console.error('❌ Error loading one or more components:', error);
    });
}

}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const loader = new ComponentLoader();
    loader.loadAllComponents();
});

// Fallback: If components don't load in time, try again
window.addEventListener('load', function() {
    setTimeout(() => {
        if (document.querySelector('#navbar-container').innerHTML === '' || 
            document.querySelector('#footer-container').innerHTML === '') {
            console.log('🔄 Retrying component load...');
            const loader = new ComponentLoader();
            loader.loadAllComponents();
        }
    }, 1000);
});