const fs = require('fs');
const path = require('path');

// Directorio raíz donde se encuentran tus módulos
const modulesDir = path.join(__dirname, 'src');

// Función para actualizar el contenido de un archivo de entidad
const updateEntityContent = (content) => {
    // Reemplaza 'type: 'datetime'' por 'type: 'timestamptz''
    content = content.replace(/type: 'datetime'/g, "type: 'timestamptz'");

    // Reemplaza 'Buffer' por 'Uint8Array'
    content = content.replace(/Buffer/g, 'Uint8Array');

    return content;
};

// Función para recorrer directorios y actualizar archivos
const updateEntitiesInDir = (dir) => {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error('Error leyendo el directorio:', err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(dir, file);

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(
                        'Error obteniendo estadísticas del archivo:',
                        err,
                    );
                    return;
                }

                if (stats.isDirectory()) {
                    updateEntitiesInDir(filePath);
                } else if (stats.isFile() && file.endsWith('.entity.ts')) {
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error('Error leyendo el archivo:', err);
                            return;
                        }

                        const updatedContent = updateEntityContent(data);

                        fs.writeFile(
                            filePath,
                            updatedContent,
                            'utf8',
                            (err) => {
                                if (err) {
                                    console.error(
                                        'Error escribiendo el archivo:',
                                        err,
                                    );
                                    return;
                                }

                                console.log(`Archivo actualizado: ${filePath}`);
                            },
                        );
                    });
                }
            });
        });
    });
};

// Iniciar la actualización desde el directorio de módulos
updateEntitiesInDir(modulesDir);
