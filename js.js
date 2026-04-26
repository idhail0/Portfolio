const ThemeEngine = (() => {
    const STORAGE_KEY = 'theme-preference';
    const DARK_MODE_CLASS = 'dark-mode';
    const LIGHT_MODE_CLASS = 'light-mode';
    const htmlElement = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');
    
   
    const init = () => {
        attachEventListeners();
        listenToSystemPreference();
    };
    
   
    const attachEventListeners = () => {
        if (!toggleBtn) return;
        
        toggleBtn.addEventListener('click', handleToggleClick);
        toggleBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleClick();
            }
        });
    };
    
   
    const handleToggleClick = () => {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };
    
    /**
     * Get current theme from DOM or localStorage
     * @returns {string} 'dark' or 'light'
     */
    const getCurrentTheme = () => {
        
        if (htmlElement.classList.contains(DARK_MODE_CLASS)) {
            return 'dark';
        }
        
        
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return saved;
        } catch (e) {
            // localStorage unavailable
        }
        
       
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    };
    
    /**
     * Set theme and save preference
     * @param {string} theme - 'dark' or 'light'
     */
    const setTheme = (theme) => {
        const isDark = theme === 'dark';
        
        
        if (isDark) {
            htmlElement.classList.add(DARK_MODE_CLASS);
            htmlElement.classList.remove(LIGHT_MODE_CLASS);
        } else {
            htmlElement.classList.remove(DARK_MODE_CLASS);
            htmlElement.classList.add(LIGHT_MODE_CLASS);
        }
        
        
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            // localStorage unavailable
        }
        
        
        updateThemeColor(isDark);
        
        
        window.dispatchEvent(
            new CustomEvent('themechange', { 
                detail: { theme, isDark }
            })
        );
    };
    
    /**
     * Update browser meta theme-color
     * @param {boolean} isDark
     */
    const updateThemeColor = (isDark) => {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = isDark ? '#0d1117' : '#1a1a1a';
    };
    
    
    const listenToSystemPreference = () => {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        darkModeQuery.addEventListener('change', (e) => {
           
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (!saved) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            } catch (e) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    };
    
    
    return {
        init,
        setTheme,
        getCurrentTheme,
        STORAGE_KEY,
        DARK_MODE_CLASS
    };
})();


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ThemeEngine.init();
    });
} else {
    ThemeEngine.init();
}


document.documentElement.classList.add('js');

const revealSelectors = [
    '.hero-card',
    '.cv-section',
    '.content-block',
    '.skill-category',
    '.project-card',
    '.job',
    '.skills-container .skill-badge',
    '.job li',
    '.certifications-list li',
    '.languages-list li',
    '.social-icons a',
].join(', ');

const revealTargets = Array.from(document.querySelectorAll(revealSelectors));

revealTargets.forEach((element) => {
    element.classList.add('reveal-target');
});

const applyStaggerDelays = (selector, step) => {
    document.querySelectorAll(selector).forEach((element, index) => {
        element.style.setProperty('--delay', `${index * step}ms`);
    });
};

applyStaggerDelays('.hero-card, .cv-section, .job', 90);
applyStaggerDelays('.content-grid .content-block', 120);
applyStaggerDelays('.skills-grid .skill-category', 120);
applyStaggerDelays('.projects-container .project-card', 140);
applyStaggerDelays('.skills-container .skill-badge', 70);
applyStaggerDelays('.job li', 90);
applyStaggerDelays('.certifications-list li', 85);
applyStaggerDelays('.languages-list li', 85);
applyStaggerDelays('.social-icons a', 70);

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
    });

    revealTargets.forEach((element) => revealObserver.observe(element));
} else {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
}



const CVTooltip = (() => {
    const TOOLTIP_DURATION = 8000; // milliseconds
    let tooltipTimeout = null;
    let isTooltipVisible = false;

    const init = () => {
        const logoBtn = document.getElementById('logo-btn');
        if (!logoBtn) return;

        showTooltip(logoBtn);

        logoBtn.addEventListener('mouseenter', () => {
            if (!isTooltipVisible) {
                showTooltip(logoBtn);
            }
        });
    };

    const showTooltip = (logoBtn) => {
        const tooltip = logoBtn.querySelector('.cv-tooltip');
        if (!tooltip) return;

        if (tooltipTimeout) {
            clearTimeout(tooltipTimeout);
        }

        isTooltipVisible = true;
        tooltip.classList.add('visible');

        tooltipTimeout = setTimeout(() => {
            hideTooltip(tooltip);
        }, TOOLTIP_DURATION);
    };

    const hideTooltip = (tooltip) => {
        isTooltipVisible = false;
        tooltip.classList.remove('visible');
    };

    return { init };
})();


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CVTooltip.init());
} else {
    CVTooltip.init();
}
