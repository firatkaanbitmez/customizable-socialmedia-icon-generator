function updateIcons() {
    const shape = document.getElementById('shape').value;
    const mainColor = document.getElementById('mainColor').value;
    const bgColor = document.getElementById('bgColor').value;
    const iconSize = document.getElementById('iconSize').value + 'px';

    document.querySelectorAll('.icon-container').forEach(container => {
        container.style.backgroundColor = bgColor;
        container.style.borderRadius = shape === 'circle' ? '100%' : '0';
        container.style.setProperty('--icon-size', iconSize);
    });

    document.querySelectorAll('.fa-icon').forEach(icon => {
        icon.style.color = mainColor;
        icon.style.fontSize = `calc(${iconSize} / 1.5)`;
    });

    document.getElementById('iconSizeNumber').value = document.getElementById('iconSize').value;
}

function updateSizeInput() {
    document.getElementById('iconSizeNumber').value = document.getElementById('iconSize').value;
    updateIcons();
}

function updateSizeRange() {
    document.getElementById('iconSize').value = document.getElementById('iconSizeNumber').value;
    updateIcons();
}

function downloadSymbol(id) {
    const container = document.getElementById(id);
    html2canvas(container, {
        backgroundColor: null,
        scale: 1,  // Increase the scale for higher resolution
        width: container.offsetWidth,
        height: container.offsetHeight
    }).then(canvas => {
        let link = document.createElement('a');
        link.download = `${id}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

function downloadAllSymbols() {
    const zip = new JSZip();
    const icons = document.querySelectorAll('.icon-container');
    const promises = [];

    // Backup the original state of tabs
    const activeTab = document.querySelector('.tab-pane.active');
    const activeTabId = activeTab ? activeTab.id : null;

    // Temporarily show all tabs to ensure all icons are rendered correctly
    const tabs = document.querySelectorAll('.tab-pane');
    tabs.forEach(tab => tab.classList.add('show', 'active'));

    icons.forEach(icon => {
        const promise = html2canvas(icon, {
            backgroundColor: null,
            scale: 1,  // Increase the scale for higher resolution
            width: icon.offsetWidth,
            height: icon.offsetHeight
        }).then(canvas => {
            return new Promise((resolve) => {
                canvas.toBlob(blob => {
                    zip.file(`${icon.id}.png`, blob);
                    resolve();
                });
            });
        });
        promises.push(promise);
    });

    Promise.all(promises).then(() => {
        // Restore the original state of tabs
        tabs.forEach(tab => {
            if (tab.id !== activeTabId) {
                tab.classList.remove('show', 'active');
            }
        });

        zip.generateAsync({ type: 'blob' }).then(content => {
            saveAs(content, 'icons.zip');
        });
    });
}

// Initialize icons with default colors
updateIcons();
