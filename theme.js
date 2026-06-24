/* Zeepredict - Shared Theme Toggle */
(function () {
    const KEY = 'theme';

    function setTheme(isLight) {
        const html = document.documentElement;
        const btn = document.getElementById('themeToggle');
        if (isLight) {
            html.classList.add('light-mode');
            if (btn) btn.textContent = '\u2600\uFE0F';
        } else {
            html.classList.remove('light-mode');
            if (btn) btn.textContent = '\uD83C\uDF19';
        }
        localStorage.setItem(KEY, isLight ? 'light' : 'dark');
    }

    document.addEventListener('DOMContentLoaded', function () {
        const btn = document.getElementById('themeToggle');
        if (!btn) return;

        // Apply saved theme immediately
        setTheme(localStorage.getItem(KEY) === 'light');

        btn.addEventListener('click', function () {
            setTheme(!document.documentElement.classList.contains('light-mode'));
        });
    });
})();