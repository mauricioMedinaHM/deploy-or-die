const scenarios = {
  friday: {
    level: "NIVEL 02 · FRIDAY DEPLOY",
    steps: [
      {
        icon: "🔥", title: "EL CHECKOUT NO FUNCIONA",
        copy: "Un deploy de hace 4 minutos rompió los pagos. Hay 327 clientes intentando comprar y el número sigue subiendo.",
        boss: "¿Ya lo arreglaste? El cliente está llamando.",
        help: "Primero recuperá el servicio. La opción más segura es volver a la última versión estable y analizar el error después.",
        choices: [
          ["Revertir el último deploy", -12, 18, true],
          ["Editar el código directo en producción", 30, -28, false],
          ["Decir que es problema del proveedor", 15, -18, false]
        ]
      },
      {
        icon: "📱", title: "EL CEO ENTRÓ AL CHAT",
        copy: "El servicio volvió, pero el CEO exige una explicación inmediata y quiere saber quién fue responsable.",
        boss: "Necesito nombres. Ahora.",
        help: "Comunicá hechos, impacto y próximos pasos. Evitá culpar a una persona durante el incidente; primero asegurá que no vuelva a ocurrir.",
        choices: [
          ["Compartir estado, impacto y plan", -5, 18, true],
          ["Culpar al developer que hizo el deploy", 12, -20, false],
          ["Silenciar las notificaciones", 22, -15, false]
        ]
      },
      {
        icon: "🧯", title: "QUEDA UN BUG SILENCIOSO",
        copy: "Los pagos funcionan, pero los logs muestran que algunos cupones aplican descuentos incorrectos.",
        boss: "¿Nos podemos ir o no?",
        help: "Reducí el riesgo: desactivá temporalmente los cupones afectados, documentá el incidente y dejá una corrección preparada para revisión.",
        choices: [
          ["Desactivar cupones y documentar", -8, 22, true],
          ["Hacer otro deploy rápido", 24, -12, false],
          ["Dejarlo para el lunes sin avisar", 18, -25, false]
        ]
      }
    ]
  },
  ai: {
    level: "NIVEL 03 · THE AI INTERN",
    steps: [
      {
        icon: "🤖", title: "LA IA CAMBIÓ 84 ARCHIVOS",
        copy: "El agente recibió la tarea de ‘mejorar el rendimiento’ y acaba de abrir un cambio gigante que nadie puede revisar de una vez.",
        boss: "La IA dijo que mejoró todo un 300%. ¿Lo desplegamos?",
        help: "Detené la automatización y achicá el cambio. Revisá una mejora a la vez con una medición clara antes de desplegar.",
        choices: [
          ["Pausar al agente y dividir el cambio", -10, 20, true],
          ["Aprobar porque la IA parece segura", 28, -25, false],
          ["Borrar todos los archivos modificados", 12, -12, false]
        ]
      },
      {
        icon: "🔑", title: "ENCONTRÓ UNA CLAVE SECRETA",
        copy: "En el historial aparece una clave privada. El agente la copió en un archivo de configuración que está por publicarse.",
        boss: "Seguro no pasa nada, ¿no?",
        help: "Considerá la clave comprometida: revocala, generá una nueva y retirala del código. Después revisá accesos y registros.",
        choices: [
          ["Revocar y rotar la clave", 5, 24, true],
          ["Ocultar el archivo y seguir", 18, -20, false],
          ["Cambiarle el nombre a la variable", 25, -24, false]
        ]
      },
      {
        icon: "🛑", title: "EL AGENTE SIGUE TRABAJANDO",
        copy: "Aunque pausaste la tarea, otro proceso del agente intenta desplegar una versión propia cada 30 segundos.",
        boss: "¿Podemos confiar en esta cosa?",
        help: "Cortá su permiso de despliegue, verificá qué procesos siguen activos y exigí aprobación humana para futuras publicaciones.",
        choices: [
          ["Quitar permisos y exigir aprobación", -6, 24, true],
          ["Pedirle a la IA que se detenga", 20, -16, false],
          ["Desconectar toda la oficina", 13, -10, false]
        ]
      }
    ]
  }
};

const $ = (selector) => document.querySelector(selector);
const screens = [...document.querySelectorAll(".screen")];
let state = { scenario: null, step: 0, stress: 20, reputation: 50, correct: 0, helps: 0, seconds: 90, timer: null };

function show(id) {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startScenario(key) {
  clearInterval(state.timer);
  state = { scenario: key, step: 0, stress: 20, reputation: 50, correct: 0, helps: 0, seconds: 90, timer: null };
  $("#level-label").textContent = scenarios[key].level;
  show("game");
  renderStep();
  state.timer = setInterval(() => {
    state.seconds--;
    updateTimer();
    if (state.seconds <= 0) finish(true);
  }, 1000);
}

function renderStep() {
  const step = scenarios[state.scenario].steps[state.step];
  $("#step-label").textContent = `DECISIÓN ${state.step + 1} DE 3`;
  $("#incident-icon").textContent = step.icon;
  $("#incident-title").textContent = step.title;
  $("#incident-copy").textContent = step.copy;
  $("#boss-message p").textContent = `“${step.boss}”`;
  $("#choices").innerHTML = step.choices.map((c, i) => `<button class="choice" data-choice="${i}"><b>${String.fromCharCode(65 + i)}</b><span>${c[0]}</span></button>`).join("");
  $("#assistant-empty").hidden = false;
  $("#assistant-answer").hidden = true;
  $("#help-btn").disabled = false;
  $("#choices").querySelectorAll(".choice").forEach(btn => btn.addEventListener("click", () => choose(+btn.dataset.choice)));
  updateMeters();
}

function choose(index) {
  const choice = scenarios[state.scenario].steps[state.step].choices[index];
  state.stress = Math.max(0, Math.min(100, state.stress + choice[1]));
  state.reputation = Math.max(0, Math.min(100, state.reputation + choice[2]));
  if (choice[3]) state.correct++;
  state.step++;
  if (state.step >= 3 || state.stress >= 100 || state.reputation <= 0) finish(false);
  else renderStep();
}

function askHelp() {
  const step = scenarios[state.scenario].steps[state.step];
  state.helps++;
  $("#assistant-empty").hidden = true;
  $("#assistant-answer").hidden = false;
  $("#help-btn").disabled = true;
  const box = $(".answer-content");
  box.innerHTML = "";
  setTimeout(() => {
    $(".typing-label").textContent = "RECOMENDACIÓN SIMULADA";
    box.innerHTML = `<strong>Mi sugerencia:</strong><p>${step.help}</p><ul><li>Priorizá reducir el impacto.</li><li>Comunicá lo que sabés con claridad.</li></ul>`;
  }, 550);
}

function updateMeters() {
  $("#stress-bar").style.width = `${state.stress}%`;
  $("#stress-value").textContent = `${state.stress}%`;
  $("#rep-bar").style.width = `${state.reputation}%`;
  $("#rep-value").textContent = `${state.reputation}%`;
}

function updateTimer() {
  const min = String(Math.floor(state.seconds / 60)).padStart(2, "0");
  const sec = String(state.seconds % 60).padStart(2, "0");
  $("#timer").textContent = `${min}:${sec}`;
  $("#timer").style.color = state.seconds < 20 ? "var(--red)" : "var(--acid)";
}

function finish(timedOut) {
  clearInterval(state.timer);
  const won = !timedOut && state.correct >= 2 && state.reputation > 25 && state.stress < 90;
  $("#result-stamp").textContent = won ? "SOBREVIVISTE" : "GAME OVER";
  $("#result-stamp").classList.toggle("bad", !won);
  $("#result-title").textContent = won ? "SEGUÍS CONTRATADO." : (timedOut ? "SE ACABÓ EL TIEMPO." : "TE DESPIDIERON.");
  $("#result-copy").textContent = won
    ? "Controlaste el incidente, comunicaste con claridad y evitaste que el caos se convirtiera en catástrofe. Mañana hay otro deploy."
    : "El incidente ganó esta vez. En tecnología, una decisión rápida puede salvar el día o convertir un bug en una reunión con Recursos Humanos.";
  $("#score-decisions").textContent = `${state.correct}/3`;
  $("#score-stress").textContent = `${state.stress}%`;
  $("#score-help").textContent = state.helps;
  let rank = "JUNIOR DESTRUCTIVO";
  if (state.correct === 3) rank = "GUARDIÁN DE PRODUCCIÓN";
  else if (state.correct === 2) rank = "JUNIOR PROMETEDOR";
  else if (state.correct === 1) rank = "APRENDIZ DEL CAOS";
  $("#rank-name").textContent = rank;
  show("result");
}

$("#start-btn").addEventListener("click", () => show("select"));
document.querySelectorAll(".scenario-card").forEach(card => card.addEventListener("click", () => startScenario(card.dataset.scenario)));
$("#exit-btn").addEventListener("click", () => { clearInterval(state.timer); show("select"); });
$("#help-btn").addEventListener("click", askHelp);
$("#replay-btn").addEventListener("click", () => show("select"));
$("#copy-btn").addEventListener("click", async () => {
  const text = `DEPLOY OR DIE\n${$("#result-title").textContent}\nDecisiones correctas: ${state.correct}/3\nEstrés: ${state.stress}%\nRango: ${$("#rank-name").textContent}`;
  try { await navigator.clipboard.writeText(text); } catch { /* Clipboard puede no estar disponible al abrir como archivo local. */ }
  $("#toast").classList.add("show");
  setTimeout(() => $("#toast").classList.remove("show"), 1800);
});

updateTimer();
