// Esperar a que el DOM cargue completamente
document.addEventListener("DOMContentLoaded", () => {
  // Referencia al formulario
  const form = document.getElementById("maintenanceForm");

  // Escuchar el evento 'submit' (cuando se presiona el botón)
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
        brakeFluid
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

// Lógica Principal: Evaluación de Reglas de Riesgo
function analyzeRisk(
  id,
  km,
  codes,
  report,
  tirePressure,
  engineTemp,
  brakeFluid
) {
  let riskLevel = "";
  let recommendation = "";
  let cssClass = "";
  let explanation = "";

  // Reglas de decisión basadas en el PDF (Prioridad y Prevención) [cite: 27, 29]

  // CASO ROJO: Falla crítica, Kilometraje excesivo (>15k) o Pérdida de potencia
  if (
    codes === "critical" ||
    km > 15000 ||
    report === "power_loss" ||
    brakeFluid === "low" ||
    engineTemp === "high"
  ) {
    riskLevel = "RIESGO ALTO (CRÍTICO)";
    cssClass = "risk-red";
    recommendation = "⛔ DETENER UNIDAD. Programar entrada a taller inmediata.";
    explanation =
      "Se detectaron una o más condiciones críticas que requieren atención inmediata.";
  }
  // CASO AMARILLO: Kilometraje medio (>10k), Advertencia menor o Ruidos
  else if (
    km > 10000 ||
    codes === "warning" ||
    report === "noise" ||
    tirePressure !== "normal" ||
    engineTemp === "low"
  ) {
    riskLevel = "RIESGO MEDIO (PREVENTIVO)";
    cssClass = "risk-yellow";
    recommendation =
      "⚠️ PLANIFICAR REVISIÓN. Agendar mantenimiento en próximos 3 días.";
    explanation =
      "La unidad presenta desviaciones que podrían escalar a fallas mayores si no se atienden.";
  }
  // CASO VERDE: Todo en orden
  else {
    riskLevel = "BAJO RIESGO (OPERATIVO)";
    cssClass = "risk-green";
    recommendation = "✅ CONTINUAR OPERACIÓN. Unidad en condiciones óptimas.";
    explanation = "Todos los parámetros están dentro de norma.";
  }

  // Construir la respuesta HTML del bot con el semáforo y la acción sugerida [cite: 43, 44]
  const responseHTML = `
        <strong>Análisis para unidad ${id}:</strong><br>
        ${explanation}
        <div class="risk-card ${cssClass}">
            ${riskLevel}
        </div>
        <br>
        <strong>Acción Sugerida:</strong><br>
        ${recommendation}
    `;

  addMessage(responseHTML, "bot-message");
}
