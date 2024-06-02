// src/utils/validator.js

/**
 * Valida un número de teléfono basado en los siguientes criterios:
 * - Debe estar formado por dos partes separadas por '-'.
 * - La primera parte debe tener dos o tres dígitos.
 * - La segunda parte debe consistir solo en dígitos.
 *
 * @param {string} phoneNumber - Número de teléfono a validar.
 * @returns {boolean} True si el número de teléfono es válido, false en caso contrario.
 */
const isValidPhoneNumber = (phoneNumber) => {
  const regex = /^\d{2,3}-\d+$/;
  return regex.test(phoneNumber);
};

module.exports = isValidPhoneNumber;
