import { BaseExtension } from './BaseExtension.js';

class GeorefExtension extends BaseExtension {
    load() {
        super.load();
        console.log('GeorefExtension loaded.');
        return true;
    }

    unload() {
        super.unload();
        console.log('GeorefExtension unloaded.');
        return true;
    }

    async onModelLoaded(model) {
        super.onModelLoaded(model);

        const modelData = model.getData();
        const tipoArchivo = modelData.loadOptions ? modelData.loadOptions.fileExt : 'No disponible';

        if (modelData?.metadata?.georeference) {
            const georef = modelData.metadata.georeference;
            
            const coordEW = georef.positionNative ? (georef.positionNative[0] * 0.3048).toFixed(3) : 'No disponible';
            const coordNS = georef.positionNative ? (georef.positionNative[1] * 0.3048).toFixed(3) : 'No disponible';
            const coordElev = georef.positionNative ? (georef.positionNative[2] * 0.3048).toFixed(3) : 'No disponible';
            const sysCoord = georef.positionNative ? georef.nativeCoordSys : 'No disponible';

            const customValues = modelData.metadata.valueOf()['custom values'];
            const angleTrueNorth = (customValues && customValues.angleToTrueNorth !== undefined)
                    ? customValues.angleToTrueNorth.toFixed(2)
                    : 'No disponible';


            console.log('Coordenadas de georeferenciación N/S:', coordNS, 'm');
            console.log('Coordenadas de georeferenciación E/W:', coordEW, 'm');
            console.log('Coordenadas de georeferenciación Elevación:', coordElev, 'm');
            console.log('Coordenadas de georeferenciación Angulo:', angleTrueNorth, '°');
            console.log('Sistema de coordenadas:', sysCoord);
            console.log('El tipo de archivo es:', tipoArchivo);

            // Dispara un evento personalizado con la información
            this.viewer.fireEvent({
                type: 'GEORF_DATA_EVENT',
                data: {
                    coordNS,
                    coordEW,
                    coordElev,
                    sysCoord,
                    tipoArchivo,
                    angleTrueNorth
                }
            });
        } else {
            console.warn('El modelo cargado no contiene datos de georreferenciación.');
        }
    }


    async onSelectionChanged(model) {
        super.onSelectionChanged(model);
        console.log('Model has changed');
    }

    onIsolationChanged(model) {
        super.onIsolationChanged(model);
        console.log('Isolation has changed');
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('GeorefExtension', GeorefExtension);