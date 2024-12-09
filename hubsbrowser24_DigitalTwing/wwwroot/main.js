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


//// Botón para mostrar el panel de calidad BIM
//document.addEventListener('DOMContentLoaded', () => {
//    console.log("Inicializando la clase Botones.");
//    new botones(); // Inicializa la clase complementaria Botones

//    /*const button = document.getElementById("quality-btn");*/
//    const panel = document.getElementById("bim-quality-panel");

//    if (button && panel) {
//        button.addEventListener('click', async () => {
//            panel.classList.toggle("visible-panel");

//            if (panel.classList.contains("visible-panel")) {
//                console.log("Panel de calidad BIM activado.");
//                const viewer = await initViewer(document.getElementById('preview'));

//                // Cargar la extensión del ProgressBar si no está activa
//                const progressBarExtension = viewer.getExtension('ProgressBarExtension');
//                const emptyParamsExtension = viewer.getExtension('EmptyParamsExtension');
//                if (progressBarExtension && progressBarExtension.panel) {
//                    console.log("Inicializando la barra de progreso.");
//                    /*progressBarExtension.panel.initChart();*/
//                } else {
//                    console.error("No se encontró la extensión ProgressBarExtension.");
//                }
//                if (emptyParamsExtension && emptyParamsExtension.panel) {
//                    console.log("Inicializando la barra de progreso.");
//                    /*progressBarExtension.panel.initChart();*/
//                } else {
//                    console.error("No se encontró la extensión ProgressBarExtension.");
//                }
//            }
//        });
//    } else {
//        console.error("Botón o panel no encontrado.");
//    }
//})
document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById("bim-quality-panel");

    // Hacer visible el panel al cargar la página
    if (panel) {
        panel.classList.remove("hidden-panel");
        console.log("BIM Quality Panel is now visible.");
    }

    const sidebar = document.getElementById("sidebar");
    const menuSidebarBtn = document.getElementById("menu-sidebar-btn");

    // Lógica para alternar la visibilidad del sidebar
    if (sidebar && menuSidebarBtn) {
        menuSidebarBtn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    } else {
        console.error("Sidebar or its button is missing.");
    }
});
