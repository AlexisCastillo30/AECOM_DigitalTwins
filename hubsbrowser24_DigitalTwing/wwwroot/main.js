import { initViewer, loadModel } from './viewer.js';
import { initTree } from './sidebar.js';

const login = document.getElementById('login');
try {
    const resp = await fetch('/api/auth/profile');
    if (resp.ok) {
        const user = await resp.json();
        login.innerText = `Logout (${user.name})`;
        login.onclick = () => {
            const iframe = document.createElement('iframe');
            iframe.style.visibility = 'hidden';
            iframe.src = 'https://accounts.autodesk.com/Authentication/LogOut';
            document.body.appendChild(iframe);
            iframe.onload = () => {
                window.location.replace('/api/auth/logout');
                document.body.removeChild(iframe);
            };
        }
        const viewer = await initViewer(document.getElementById('preview'));
        initTree('#tree', (id) => loadModel(viewer, window.btoa(id).replace(/=/g, '')));
    } else {
        login.innerText = 'Login';
        login.onclick = () => window.location.replace('/api/auth/login');
    }
    login.style.visibility = 'visible';
} catch (err) {
    alert('Could not initialize the application. See console for more details.');
    console.error(err);
}

document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById("bim-quality-panel");
    const emptyParamsPanel = document.getElementById("empty-params-panel");

    // Ajustar el tamaño del panel dinámicamente al cargar la página
    if (panel && emptyParamsPanel) {
        const adjustPanelHeight = () => {
            const panelHeight = panel.offsetHeight;
            const progressChartHeight = document.getElementById("progress-chart").offsetHeight;

            // Ajustar la altura restante para empty-params-panel
            const remainingHeight = panelHeight - progressChartHeight - 20; // 20px de padding
            emptyParamsPanel.style.height = `${remainingHeight}px`;
        };

        // Llamar al ajuste de tamaño inicial y en caso de redimensionar la ventana
        adjustPanelHeight();
        window.addEventListener("resize", adjustPanelHeight);
    } else {
        console.error("El panel o empty-params-panel no se encontró.");
    }
});
