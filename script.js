document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("maintenanceForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Evitar que la página se recargue

    // 1. Obtener datos del formulario
    const unitId = document.getElementById("unitId").value;
    const mileage = parseInt(document.getElementById("mileage").value);
    const faultCodes = document.getElementById("faultCodes").value;
    const driverReport = document.getElementById("driverReport").value;
    const tirePressure = document.getElementById("tirePressure").value;
    const engineTemp = document.getElementById("engineTemp").value;
    const brakeFluid = document.getElementById("brakeFluid").value;
    const batteryAge = document.getElementById("batteryAge").value;
    const loadType = document.getElementById("loadType").value;

    // 2. Mostrar mensaje del usuario en el chat (Feedback visual)
    addMessage(
      `Solicitud de análisis - Unidad: ${unitId} | Km: ${mileage}`,
      "user-message"
    );

    // 3. Simular tiempo de procesamiento del bot
    setTimeout(() => {
      analyzeRisk(
        unitId,
        mileage,
        faultCodes,
        driverReport,
        tirePressure,
        engineTemp,
        brakeFluid,
        batteryAge,
        loadType
      );
    }, 800);
  });
});

// Función auxiliar para agregar mensajes al chat
function addMessage(text, className) {
  const chatWindow = document.getElementById("chatWindow");
  const div = document.createElement("div");
  div.className = `message ${className}`;
  div.innerHTML = text; // Usamos innerHTML para poder meter etiquetas dentro del mensaje
  chatWindow.appendChild(div);

  // Auto-scroll hacia abajo
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Lógica Principal: Evaluación de Reglas de Riesgo se pueden añadir mas
function analyzeRisk(
  id,
  km,
  codes,
  report,
  tirePressure,
  engineTemp,
  brakeFluid,
  batteryAge,
  loadType
) {
  let riskLevel = "";
  let recommendation = "";
  let cssClass = "";
  let explanation = "";
  let riskScore = 0;

  // Sistema de Puntuación de Riesgo
  if (codes === "critical") riskScore += 5;
  if (km > 15000) riskScore += 5;
  if (report === "power_loss") riskScore += 5;
  if (brakeFluid === "low") riskScore += 5;
  if (engineTemp === "high") riskScore += 5;

  if (batteryAge === "old") riskScore += 3;
  if (km > 10000 && km <= 15000) riskScore += 3; // Evitar doble conteo
  if (codes === "warning") riskScore += 3;
  if (report === "noise") riskScore += 3;

  if (tirePressure !== "normal") riskScore += 2;
  if (loadType === "heavy") riskScore += 2;

  if (engineTemp === "low") riskScore += 1;
  if (batteryAge === "medium") riskScore += 1;

  // Clasificación basada en Puntuación
  if (riskScore >= 10) {
    riskLevel = "RIESGO ALTO (CRÍTICO)";
    cssClass = "risk-red";
    recommendation = "⛔ DETENER UNIDAD. Programar entrada a taller inmediata.";
    explanation =
      "El puntaje de riesgo acumulado es alto, indicando condiciones críticas que requieren atención inmediata.";
  } else if (riskScore >= 5) {
    riskLevel = "RIESGO MEDIO (PREVENTIVO)";
    cssClass = "risk-yellow";
    recommendation =
      "⚠️ PLANIFICAR REVISIÓN. Agendar mantenimiento en próximos 3-5 días.";
    explanation =
      "El puntaje de riesgo es moderado. Se recomienda una revisión preventiva para evitar fallas mayores.";
  } else {
    riskLevel = "BAJO RIESGO (OPERATIVO)";
    cssClass = "risk-green";
    recommendation = "✅ CONTINUAR OPERACIÓN. Unidad en condiciones óptimas.";
    explanation =
      "El puntaje de riesgo es bajo. Todos los parámetros están dentro de un rango aceptable.";
  }

  // Construir la respuesta HTML del bot con el semáforo y la acción sugerida
  const responseHTML = `
        <strong>Análisis para unidad ${id}:</strong><br>
        ${explanation}
        <div class="risk-card ${cssClass}">
            ${riskLevel} | Puntaje: ${riskScore}
        </div>
        <br>
        <strong>Acción Sugerida:</strong><br>
        ${recommendation}
    `;

  addMessage(responseHTML, "bot-message");
}
