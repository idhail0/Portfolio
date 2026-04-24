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