        const iframe = document.getElementById('browser');
        const urlInput = document.getElementById('urlInput');
        const forwardButton = document.getElementById('forwardButton');
        const settingsMenu = document.getElementById('settingsMenu');
        const themeColorInput = document.getElementById('themeColorInput');
        const cancelButton = document.getElementById('cancelButton');
        const header = document.getElementById('header');

        let currentThemeColor = '';
        let originalThemeColor = '';

        function navigate() {
            let url = urlInput.value.trim();
            
            if (!url.startsWith('https://') && !url.startsWith('http://')) {
                url = 'https://' + url;
            }

            if (!url.includes('www.')) {
                url = 'https://www.bing.com/search?q=' + encodeURIComponent(url.replace('https://', ''));
            }

            iframe.src = url;
        }

        function goBack() {
            iframe.contentWindow.history.back();
        }

        function goForward() {
            iframe.contentWindow.history.forward();
        }

        function reload() {
            iframe.contentWindow.location.reload();
        }

        function toggleSettings() {
            settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
        }

        function changeThemeColor() {
            currentThemeColor = themeColorInput.value;
            document.body.style.backgroundColor = currentThemeColor;
            header.style.backgroundColor = currentThemeColor;

            const buttons = document.querySelectorAll('#header button');
            const lighterColor = lightenColor(currentThemeColor, 20);
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].style.backgroundColor = lighterColor;
            }

            cancelButton.style.display = currentThemeColor !== originalThemeColor ? 'block' : 'none';
        }

        function lightenColor(color, percent) {
            const num = parseInt(color.replace('#', ''), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) + amt;
            const G = (num >> 8 & 0x00FF) + amt;
            const B = (num & 0x0000FF) + amt;
            const newColor = (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1);
            return '#' + newColor;
        }

        function loadThemeColor() {
            const savedColor = localStorage.getItem('themeColor');
            if (savedColor) {
                currentThemeColor = savedColor;
                originalThemeColor = savedColor;
                document.body.style.backgroundColor = currentThemeColor;
                header.style.backgroundColor = currentThemeColor;
                themeColorInput.value = currentThemeColor;
                changeThemeColor(); // Update button background color
            }
        }

        function applyThemeColor() {
            localStorage.setItem('themeColor', currentThemeColor);
            toggleSettings();
        }

        function cancelThemeColor() {
            currentThemeColor = originalThemeColor;
            themeColorInput.value = currentThemeColor;
            document.body.style.backgroundColor = currentThemeColor;
            header.style.backgroundColor = currentThemeColor;
            changeThemeColor(); // Update button background color
            cancelButton.style.display = 'none';
            toggleSettings();
        }

        function setDefaultColor() {
            currentThemeColor = '#f5f5f5';
            themeColorInput.value = currentThemeColor;
            document.body.style.backgroundColor = currentThemeColor;
            header.style.backgroundColor = currentThemeColor;
            changeThemeColor(); // Update button background color
        }

        iframe.addEventListener('load', updateNavigationButtons);

        loadThemeColor();

        function updateNavigationButtons() {
            const history = iframe.contentWindow.history;
            forwardButton.style.display = history.length > 1 && history.length > history.currentIndex + 1 ? 'block' : 'none';
        }
