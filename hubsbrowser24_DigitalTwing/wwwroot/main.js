import './extensions/GeorefExtension.js'; // Para que se registre en theExtensionManager
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
        };

        // 1) Iniciamos el viewer
        const viewer = await initViewer(document.getElementById('preview'));

        // 2) Cargamos GeorefExtension manualmente (si no está en config)
        viewer.loadExtension('GeorefExtension')
            .catch((err) => console.error('Error al cargar GeorefExtension:', err));

        // 3) Escuchamos el evento enviado por la extensión
        viewer.addEventListener('GEORF_DATA_EVENT', (evt) => {
            const { coordNS, coordEW, coordElev, sysCoord, angleTrueNorth } = evt.data;
            // Ejemplo: si tienes un elemento debajo de "Model Selected" para mostrar coords
            const selectedItemDisplay = document.getElementById('selected-item-display');
            if (selectedItemDisplay) {
                // Agregar texto debajo del nombre
                const coordsInfo = document.createElement('div');
                coordsInfo.style.marginTop = '10px';
                coordsInfo.innerHTML =  `
                <table>
                    <tr>
                        <td><strong>Coordinates:</strong></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>N/S:</td>
                        <td>${coordNS}</td>
                        <td>m</td>
                    </tr>
                    <tr>
                        <td>E/W:</td>
                        <td>${coordEW}</td>
                        <td>m</td>
                    </tr>
                    <tr>
                        <td>Elevation:</td>
                        <td>${coordElev}</td>
                        <td>m</td>
                    </tr>
                    <tr>
                        <td>Angle:</td>
                        <td>${angleTrueNorth}</td>
                        <td>°</td>
                    </tr>
                    <tr>
                        <td>System Coordinates:</td>
                        <td colspan="2">${sysCoord}</td>
                    </tr>
                </table>
                    `;
                selectedItemDisplay.appendChild(coordsInfo);
            }
        });

        // 4) Iniciar el árbol con la función de loadModel
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

    if (panel && emptyParamsPanel) {
        const adjustPanelHeight = () => {
            const panelHeight = panel.offsetHeight;
            const progressChartHeight = document.getElementById("progress-chart").offsetHeight;
            const remainingHeight = panelHeight - progressChartHeight - 20; // 20px de padding
            emptyParamsPanel.style.height = `${remainingHeight}px`;
        };
        adjustPanelHeight();
        window.addEventListener("resize", adjustPanelHeight);
    } else {
        console.error("El panel o empty-params-panel no se encontró.");
    }
});
