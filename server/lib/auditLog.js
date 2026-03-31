import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_FILE = path.resolve(__dirname, "../../audit.log");

/**
 * Registra una acción administrativa en el archivo audit.log
 * @param {string} adminId - ID del administrador
 * @param {string} adminName - Nombre del administrador
 * @param {string} action - Acción realizada (ej: ASSIGN_STATION, COMPENSATE_BRANCH)
 * @param {object} details - Detalles adicionales de la operación
 */
export const logAdminAction = (adminId, adminName, action, details = {}) => {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    adminId,
    adminName,
    action,
    details,
  });

  try {
    fs.appendFileSync(LOG_FILE, entry + "\n");
  } catch (error) {
    console.error("Error escribiendo en audit log:", error);
  }
};
