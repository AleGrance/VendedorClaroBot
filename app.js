const { createBot, createProvider, createFlow, addKeyword } = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const WebWhatsappProvider = require("@bot-whatsapp/provider/web-whatsapp");
const MockAdapter = require("@bot-whatsapp/database/mock");

/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */



const flowSecundario = addKeyword(["2", "siguiente"])
  .addAnswer(["FlowSecundario"])
  ;

const flowGracias = addKeyword([
  "gracias",
  "Gracias",
  "dale muchas gracias",
  "Muchas Gracias",
]).addAnswer(
  ["🤖 No hay de que, cuando gustes"],
  null,
  null,
  [flowSecundario]
);

const flowAtc = addKeyword([
  "Si",
  "si",
]).addAnswer(
  ["🤖 Estoy transfiriendo a un compañero tu solicitud, favor aguarda un momento que en breve se comunica contigo."],
  null,
  null,
  [flowGracias]
);

const flowSecundarioMotorola = addKeyword(["1", "motorola"])
  .addAnswer(["🤖 Estos son los equipos disponibles de la marca Motorola:"])
  .addAnswer("Opcion 1", {
    media: "./src/img/celulares/motorola/1.png",
  })
  .addAnswer("Opcion dos", {
    media: "./src/img/celulares/motorola/2.png",
  })
  .addAnswer("Opcion tres", {
    media: "./src/img/celulares/motorola/3.png",
  }, null, [flowGracias])
  .addAnswer("🤖 Si deseas solicitar un equipo escribe Si y te transfiero a un compañero para que te tome el pedido.", null, null, [flowAtc, flowGracias])
  ;

const flowSecundarioSamsung = addKeyword(["2", "samsung"])
  .addAnswer(["🤖 Estos son los equipos disponibles de la marca Samsung:"])
  .addAnswer("Opcion 1", {
    media: "./src/img/celulares/samsung/1.png",
  })
  .addAnswer("Opcion dos", {
    media: "./src/img/celulares/samsung/2.png",
  })
  .addAnswer("Opcion tres", {
    media: "./src/img/celulares/samsung/3.png",
  }, null, [flowGracias])
  .addAnswer("🤖 Si deseas solicitar un equipo escribe Si y te transfiero a un compañero para que te tome el pedido.", null, null, [flowAtc, flowGracias])
  ;

const flowInternet = addKeyword(["inter", "inernet", "intern", "internet", "Internet", "1"]).addAnswer(
  [
    "📄 Aquí encontras las documentación recuerda que puedes mejorarla",
    "ver opciones",
    "\n*2* Para siguiente paso.",
  ],
  null,
  null,
  [flowSecundario]
);

const flowPlanes = addKeyword(["plan", "planes", "plans", "Planes", "PLANES", "2"]).addAnswer(
  [
    "🚀 Aqui te muestro los planes disponibles",
    "[*opencollective*] ",
    "[*buymeacoffee*] ",
    "[*patreon*] ",
    "\n*2* Para siguiente paso.",
  ],
  null,
  null,
  [flowSecundario]
);

const flowEquipos = addKeyword(["equipos", "Equipos", "EQUIPOS", "equips", "3"]).addAnswer(
  ["🤖 Elige una marca",
    "👉 *1 Motorola*",
    "👉 *2 Samsung*",
    "🤖 Escribe el número de la opción que elegiste."],
  null,
  null,
  [flowSecundarioMotorola, flowSecundarioSamsung]
);

const flowPrincipal = addKeyword([
  "hola",
  "ole",
  "alo",
  "Buenas",
  "Hola que tal?",
  "Buen día",
  "Buenas tardes",
  "Buenas noches",
  "Buenos días",
  "Buen dia",
  "Buen día",
])
  .addAnswer("🤖 Hola que tal? mi nombe es BotClaro tu asesor de ventas Claro!")
  .addAnswer(
    [
      "🤖 En qué puedo ayudarte?",
      "👉 *1 Internet* para ver todos los planes de internet",
      "👉 *2 Planes*  para ver todos los planes de telefonía",
      "👉 *3 Equipos* para ver opiones de equipo",
      "🤖 Escribe el número de la opción que elegiste."
    ],
    null,
    null,
    [flowInternet, flowPlanes, flowEquipos, flowGracias]
  );

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(WebWhatsappProvider);
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
  QRPortalWeb();
};

main();
