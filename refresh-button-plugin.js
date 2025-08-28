/**
 * Lampa TV Refresh Button Plugin
 * Adds a refresh button to the upper right menu
 */

(function() {
    'use strict';
    
    // Plugin configuration
    const PLUGIN_CONFIG = {
        name: 'Refresh Button Plugin',
        version: '1.0.0',
        author: 'Plugin Developer',
        description: 'Adds a refresh button to the upper right menu'
    };
    
    // Create refresh button element
    function createRefreshButton() {
        const button = document.createElement('div');
        button.className = 'refresh-button-plugin';
        button.innerHTML = `
            <div class="refresh-button" title="Refresh Page" style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                cursor: pointer;
                margin-left: 10px;
                transition: all 0.2s ease;
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
                    <path d="M23 4v6h-6"/>
                    <path d="M1 20v-6h6"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
            </div>
        `;
        
        // Add hover effects
        const refreshBtn = button.querySelector('.refresh-button');
        refreshBtn.addEventListener('mouseenter', () => {
            refreshBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            refreshBtn.style.transform = 'scale(1.05)';
        });
        
        refreshBtn.addEventListener('mouseleave', () => {
            refreshBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            refreshBtn.style.transform = 'scale(1)';
        });
        
        // Add click functionality
        refreshBtn.addEventListener('click', () => {
            // Add loading animation
            refreshBtn.style.transform = 'rotate(360deg)';
            refreshBtn.style.transition = 'transform 0.5s ease';
            
            // Refresh the page after animation
            setTimeout(() => {
                window.location.reload();
            }, 500);
        });
        
        return button;
    }
    
    // Find and inject the refresh button
    function injectRefreshButton() {
        try {
            // Try multiple selectors for the upper menu
            const menuSelectors = [
                '.head__actions',
                '.header .menu',
                '.top-menu',
                '.upper-menu',
                '.navigation',
                '.header',
                '.top-bar',
                '.menu-container',
                '.view--header',
                '.view--navigation'
            ];
            
            let targetMenu = null;
            let selector = '';
            
            for (const sel of menuSelectors) {
                const element = document.querySelector(sel);
                if (element) {
                    targetMenu = element;
                    selector = sel;
                    break;
                }
            }
            
            if (!targetMenu) {
                return false; // Menu not found
            }
            
            // Check if button already exists
            if (targetMenu.querySelector('.refresh-button-plugin')) {
                return true; // Button already exists
            }
            
            // Create and inject the refresh button
            const refreshButton = createRefreshButton();
            
            // Try to position it on the right side
            if (targetMenu.style.display === 'flex' || getComputedStyle(targetMenu).display === 'flex') {
                targetMenu.appendChild(refreshButton);
            } else {
                // If not flex, make it flex and add the button
                targetMenu.style.display = 'flex';
                targetMenu.style.alignItems = 'center';
                targetMenu.style.justifyContent = 'space-between';
                targetMenu.appendChild(refreshButton);
            }
            
            console.log(`[${PLUGIN_CONFIG.name}] Refresh button injected successfully into ${selector}`);
            return true;
            
        } catch (error) {
            console.error(`[${PLUGIN_CONFIG.name}] Failed to inject refresh button:`, error);
            return false;
        }
    }
    
    // Fallback injection method
    function injectFallbackButton() {
        try {
            const existingButton = document.querySelector('.refresh-button-plugin');
            if (existingButton) return;
            
            const refreshButton = createRefreshButton();
            refreshButton.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                background: rgba(0, 0, 0, 0.8);
                border-radius: 8px;
                padding: 10px;
            `;
            
            document.body.appendChild(refreshButton);
            console.log(`[${PLUGIN_CONFIG.name}] Fallback refresh button injected`);
            
        } catch (error) {
            console.error(`[${PLUGIN_CONFIG.name}] Fallback injection failed:`, error);
        }
    }
    
    // Initialize plugin
    function initPlugin() {
        console.log(`[${PLUGIN_CONFIG.name}] Initializing plugin v${PLUGIN_CONFIG.version}`);
        
        // Try to inject immediately
        if (!injectRefreshButton()) {
            // If failed, try fallback
            setTimeout(injectFallbackButton, 1000);
        }
    }
    
    // Listen for Lampa events
    if (typeof Lampa !== 'undefined' && Lampa.Listener) {
        // Listen for full view completion
        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'complite') {
                // Wait a bit for DOM to be ready
                setTimeout(() => {
                    injectRefreshButton();
                }, 100);
            }
        });
        
        // Listen for other view changes
        Lampa.Listener.follow('view', function(e) {
            if (e.type === 'complite') {
                setTimeout(() => {
                    injectRefreshButton();
                }, 100);
            }
        });
        
        // Listen for navigation
        Lampa.Listener.follow('navigate', function(e) {
            setTimeout(() => {
                injectRefreshButton();
            }, 200);
        });
        
        console.log(`[${PLUGIN_CONFIG.name}] Lampa listeners attached successfully`);
        
    } else {
        // Fallback for when Lampa is not available
        console.log(`[${PLUGIN_CONFIG.name}] Lampa not available, using fallback initialization`);
        
        // Try to initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPlugin);
        } else {
            initPlugin();
        }
        
        // Also try after delays
        setTimeout(initPlugin, 1000);
        setTimeout(initPlugin, 3000);
    }
    
    // Also try to inject periodically as a backup
    setInterval(() => {
        if (!document.querySelector('.refresh-button-plugin')) {
            injectRefreshButton();
        }
    }, 5000);
    
})();
