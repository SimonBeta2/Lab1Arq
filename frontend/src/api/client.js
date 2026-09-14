import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8088/api",
  headers: { "Content-Type": "application/json" },
});

export function extractErrorMessage(error) {
  if (error.response?.data) {
    const data = error.response.data;
    return typeof data === "string" ? data : data.message || "Ocurrió un error inesperado.";
  }
  if (error.request) return "No se pudo contactar al servidor. ¿Está corriendo el backend en el puerto 8088?";
  return error.message || "Ocurrió un error inesperado.";
}

export default api;
