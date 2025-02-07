import axios from "axios";
import env from "../env";

const api = axios.create({
    baseURL: env.API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const petitions = {};

export const verifyForm = (form, required, enqueueSnackbar) => {
    for (let field of required) {
        if (!form[field]) {
            enqueueSnackbar(`Complete los campos obligatorios`, { variant: "error" });
            return false;
        }
    }
    return true;
}

export const makeQuery = async (token, method, form, enqueueSnackbar, onSuccess, setLoading, onError) => {
    if (setLoading) setLoading(true);
    try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const { data } = await petitions[method](form); // Llama al método de petitions
        console.log('Method:', method, 'Data:', data);
        if (onSuccess) onSuccess(data);
        return data;
    } catch (error) {
        // Verificamos si es un error estructurado
        console.log(error);
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error en el servidor';

        // Mostrar el mensaje en enqueueSnackbar si está disponible
        if (enqueueSnackbar) {
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
        if (onError) onError(error);
    } finally {
        if (setLoading) setLoading(false);
    }
};

// * AUTH

petitions.login = (form) => api.post("/auth/login", form);

petitions.socialLogin = (form) => api.post("/auth/social-login", form);

petitions.getUser = (token) => api.get(`/auth/whoIam`);

petitions.editUser = (form) => api.put("/auth/edit", form);

petitions.register = (form) => api.post("/auth/register", form);

petitions.requestPasswordReset = (form) => api.post("/auth/requestPasswordReset", form);

petitions.verifyPasswordResetCode = (form) => api.post("/auth/verifyPasswordResetCode", form);

petitions.resetPassword = (form) => api.post("/auth/resetPassword", form);

petitions.verifyAuth = (token) => api.get("/auth/verifyAuth", {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

// * TEMPLATES

petitions.getTemplates = () => api.get("/templates");

petitions.getTemplate = (id) => api.get(`/templates/${id}`);

petitions.createTemplate = (form) => api.post("/templates", form, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

petitions.editTemplate = (form) => api.put(`/templates/${form.id}`, form.form, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

petitions.deleteTemplate = (id) => api.delete(`/templates/${id}`);

// * DESIGNS

petitions.getDesigns = () => api.get("/designs");

petitions.getDesign = (id) => api.get(`/designs/${id}`);

petitions.createDesign = (form) => api.post("/designs", form);

petitions.editDesign = (form) => api.put(`/designs/${form._id}`, form);

petitions.deleteDesign = (id) => api.delete(`/designs/${id}`);

petitions.deleteAllDesigns = () => api.delete("/designs");

export default petitions;