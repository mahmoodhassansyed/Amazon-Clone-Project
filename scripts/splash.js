// Splash Screen Manager
export function initializeSplashScreen() {
    // Check if splash has already been shown in this session
    const splashShown = sessionStorage.getItem('splashShown');

    if (!splashShown) {
        // Show splash screen for 4 seconds
        const splashScreen = document.querySelector('.js-splash-screen');
        if (splashScreen) {
            splashScreen.style.display = 'flex';

            // After 4 seconds, fade out and remove
            setTimeout(() => {
                splashScreen.classList.add('fade-out');

                // After fade-out animation completes (1s), hide it
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 1000);
            }, 4000);
        }

        // Mark splash as shown in this session
        sessionStorage.setItem('splashShown', 'true');
    } else {
        // If splash was already shown, hide it immediately
        const splashScreen = document.querySelector('.js-splash-screen');
        if (splashScreen) {
            splashScreen.style.display = 'none';
        }
    }
}
