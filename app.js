const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const WebWhatsappProvider = require('@bot-whatsapp/provider/web-whatsapp')
const MockAdapter = require('@bot-whatsapp/database/mock')

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

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowInternet = addKeyword(['inter', 'inernet', 'intern', 'internet', 'Internet']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'ver opciones',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowEquipos = addKeyword(['equipos', 'Equipos', 'EQUIPOS', 'equips']).addAnswer(
    [
        '🙌 Aquí te muestro los que más se venden',
        'Ejemplos',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowPlanes = addKeyword(['plan', 'planes', 'plans', 'Planes', 'PLANES']).addAnswer(
    [
        '🚀 Aqui te muestro los planes disponibles',
        '[*opencollective*] ',
        '[*buymeacoffee*] ',
        '[*patreon*] ',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowGracias = addKeyword(['gracias', 'Gracias', 'dale muchas gracias', 'Muchas Gracias']).addAnswer(
    ['🤪 No hay de que, cuando gustes', 'visita mi sitio web', '\n*2* Para siguiente paso.'],
    null,
    null,
    [flowSecundario]
)

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola que tal? mi nombe es Alejandro tu asesor de ventas Claro!')
    .addAnswer(
        [
            'En qué puedo ayudarte?',
            '👉 *Internet* para ver todos los planes de internet',
            '👉 *Planes*  para ver todos los planes de telefonía',
            '👉 *Equipos* para ver opiones de equipo',
        ],
        null,
        null,
        [flowInternet, flowPlanes, flowEquipos, flowGracias]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(WebWhatsappProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()
