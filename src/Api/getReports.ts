 import axios from 'axios';
 import { environment } from '../environment/environment'; // Asegúrate de que la ruta sea correcta

async function makeGetRequest(url, req) {
    const token = req.headers['authorization'] || null;
    if (!token) {
        throw new Error("Authorization token is missing");
    }

    const config = {
        headers: { Authorization: token },
    };

    return axios.get(url, config).then(response => response.data);
}

export function getReports(req, clientId) {
    const url = `${environment.clientURL}/${clientId}`; // Construye la URL de forma dinámica
    return makeGetRequest(url, req);
}

export function getPlans(req) {
    return makeGetRequest(environment.plansURL, req);
}

export function getProfile(req, profileId) {
    const url = `${environment.profileURL}/${profileId}`; // URL dinámica con el ID del perfil
    return makeGetRequest(url, req);
}















// export async function getReports(req) {
//     try {
//         const token = req.headers['authorization'] || null;

//         if (!token) {
//             throw new Error("Authorization token is missing");
//         }

//         const url = 'http://localhost:5003/api/v1/sims/client/273'; // Asegúrate de que la URL sea la correcta
//         const config = {
//             headers: {
//                 Authorization: token,
//             },
//         };

//         const response = await axios.get(url, config);
//         return response.data;
//     } catch (error) {
//         // Aquí puedes decidir cómo manejar y loguear el error.
//         // Por ejemplo, podrías devolver un mensaje de error personalizado
//         // o re-lanzar el error dependiendo de tu lógica de manejo de errores.
//         console.error('Error fetching reports:', error);
//         throw error; // O manejar de forma más específica
//     }


// }

// export async function getPlans(req) {
//     try {
//         const token = req.headers['authorization'] || null;

//         if (!token) {
//             throw new Error("Authorization token is missing");
//         }

//         const url = 'http://localhost:5003/api/v1/recharges/plans'; // Asegúrate de que la URL sea la correcta
//         const config = {
//             headers: {
//                 Authorization: token,
//             },
//         };

//         const response = await axios.get(url, config);
//         return response.data;
//     } catch (error) {
//         // Aquí puedes decidir cómo manejar y loguear el error.
//         // Por ejemplo, podrías devolver un mensaje de error personalizado
//         // o re-lanzar el error dependiendo de tu lógica de manejo de errores.
//         console.error('Error fetching reports:', error);
//         throw error; // O manejar de forma más específica
//     }
// }

//     export async function getProfile(req) {
//         try {
//             const token = req.headers['authorization'] || null;

//             if (!token) {
//                 throw new Error("Authorization token is missing");
//             }

//             const url = 'http://localhost:5004/api-auth/auth/profile'; // Asegúrate de que la URL sea la correcta
//             const config = {
//                 headers: {
//                     Authorization: token,
//                 },
//             };

//             const response = await axios.get(url, config);
//             return response.data;
//         } catch (error) {
//             // Aquí puedes decidir cómo manejar y loguear el error.
//             // Por ejemplo, podrías devolver un mensaje de error personalizado
//             // o re-lanzar el error dependiendo de tu lógica de manejo de errores.
//             console.error('Error fetching reports:', error);
//             throw error; // O manejar de forma más específica
//         }


//     }
