/* Zeepredict - Shared Utilities */

/* ---- HTML Sanitization (XSS Prevention) ---- */
window.ZeepredictUtils = {
    /**
     * Strips all HTML tags from a string to prevent XSS.
     * Use this before inserting user-generated content into innerHTML.
     */
    escapeHtml: function (str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    },

    /**
     * Shows a toast notification.
     * @param {string} message  - Text to display
     * @param {string} type     - 'success' | 'error' | 'info'  (default: 'success')
     * @param {number} duration - Auto-dismiss in ms (default: 3000)
     */
    showToast: function (message, type, duration) {
        type = type || 'success';
        duration = duration || 3000;

        // Create container if it doesn't exist
        var container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.setAttribute('role', 'status');
            container.setAttribute('aria-live', 'polite');
            document.body.appendChild(container);
        }

        var toast = document.createElement('div');
        toast.className = 'toast toast--' + type;

        var icon = type === 'success' ? '\u2705' : type === 'error' ? '\u274C' : '\u2139\uFE0F';
        toast.innerHTML = '<span>' + icon + ' ' + ZeepredictUtils.escapeHtml(message) + '</span>';

        container.appendChild(toast);

        // Trigger enter animation
        requestAnimationFrame(function () {
            toast.classList.add('toast--visible');
        });

        // Auto dismiss
        setTimeout(function () {
            toast.classList.remove('toast--visible');
            toast.addEventListener('transitionend', function () {
                toast.remove();
            });
        }, duration);
    }
};