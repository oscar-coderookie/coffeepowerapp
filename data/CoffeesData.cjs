const coffeesCatalogue = [
    {
        name: "🇵🇦 Panama: Geisha Esmeralda",
        id: 1,
        quantity:1,
        image:  "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fpanama.png?alt=media&token=7f250e29-bd3f-469f-a599-f22a605e7c06",
        description: '“La joya de las alturas. Un perfume en taza... y el café más elegante del mundo.”',
        tags: ["viajar", "tesoros"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fpanama.jpg?alt=media&token=bb9e7001-cad2-4939-926a-0fa860aa20f8",
        profile: [
            '🌱100% Arábica, variedad Geisha cultivada entre 1.600 y 2.000 msnm en la finca Esmeralda, Boquete - Panamá.',
            'Suelos volcánicos, sombra natural y microclimas constantes en las faldas del Volcán Barú.',
            'Proceso lavado o natural (según lote), con manejo extremo del detalle desde la cosecha hasta el secado.',
            'Perfil extraordinariamente floral, limpio, con acidez brillante y dulzor refinado.',
            'Ideal para métodos filtrados como V60, Chemex o sifón. Prohibido opacarlo: este café no se mezcla, se respeta.'
        ],
        tasteNotes: [
            'Entrada: Potente y perfumada, con notas de jazmín, bergamota y durazno maduro.',
            'Cuerpo: Ligero y sedoso como la seda, pero con presencia y estructura.',
            'Final: Larguísimo, limpio y etéreo, con recuerdos a miel floral, té verde, y flor de azahar.'
        ],
        emotionalDescription: [
            'Panamá Geisha Esmeralda" es más que un café: es el estándar del lujo. Una obra de arte en taza. El grano que cambió la historia del café de especialidad y elevó a Panamá como la cuna del sabor más exquisito del planeta.',
            'Cada grano es recolectado a mano con precisión quirúrgica, cultivado con devoción y procesado como si fuera oro. Su perfil no se describe, se contempla. Es el perfume del café. El susurro de las flores. La elegancia líquida.',
            'Para los paladares más exigentes del mundo. Para los que saben que hay cafés... y hay leyendas.'
        ],
        price: 10
    },
    {
        name: "🇳🇮 nicaragua: oro Volcánico",
        image:  "",
        id: 2,
        quantity:1,
        url: '/nuestroscafes/nicaragua',
        description: '“Un tesoro en calma, Café con alma suave, raíces profundas y final dorado.”',
        tags: ["viajar"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fnicaragua.png?alt=media&token=d46ff73d-bc10-45f1-a036-cced19021812",
        profile: [
            '🌱100% Arábica, mezcla de Caturra y Maragogipe cultivadas entre 1.200 y 1.500 msnm en Nueva Segovia y Matagalpa.',
            'Suelos volcánicos jóvenes, ricos en nutrientes, rodeados de sombra natural y biodiversidad.',
            'Proceso honey o lavado, dependiendo del lote, con fermentación suave y secado en patios.',
            'Perfil cálido, especiado y dulce, con equilibrio entre cuerpo, acidez leve y un toque mineral.',
            'Ideal para prensa francesa, moka o V60, donde revela su suavidad terrosa y su elegancia sutil.'
        ],
        tasteNotes: [
            'Entrada: Amable y terrosa, con notas de canela, manzana cocida y nuez moscada.',
            'Cuerpo: Medio, con textura envolvente y cremosa, como seda tostada.',
            'Final: Largo y meloso, con recuerdos a azúcar moreno, cacao ligero y madera dulce.'
        ],
        emotionalDescription: [
            '"Nicaragua Oro Volcánico" es un café que no busca brillar... pero brilla. Es la elegancia discreta, el oro escondido en la tierra, la voz suave de una historia larga. Cada grano es cultivado con paciencia por manos sabias que entienden que el café se hace con tiempo y amor.',
            'Este origen es para los que valoran lo auténtico. Para quienes encuentran belleza en lo silencioso. Es un café que no pretende conquistar: te seduce sin que lo notes.'
        ], 
        price: 10

    },
    {
        name: "🇵🇪 Perú: andino orgánico ",
        image: "https://storage.googleapis.com/coffee-power-app.appspot.com/coffees/peru.png?GoogleAccessId=firebase-adminsdk-bgoh6%40aroma-king-web.iam.gserviceaccount.com&Expires=1790972866&Signature=0Le0T8B853u3EKPveRr5%2BDuGXwp06MsLNA1E7%2BEjtIGugl7S83LCcC8sY4nR7NUMVtgt2tAnyqnrbJT%2BuEDThDcvMltRXZp7dJ6RQIXZyNYZ4TdWgXf%2BBmHWl2L10JyVRQFjHmhuPh19gN1mOEYTH82UOPD3vLBaeqTeS2ZWGwJcau4bdjv5fD%2BPG3tww4cK2AGmSJRMBEO62SPEa%2BTtCBLGkLc6BV19i6eFqE5OzgTVYFQOBMM89JV7oVXbGPxEreXrm8hb6kCCW2YTP%2B8bQvO%2BbJ61CXzrsUdTSsc4JlwxHxjiBeF2iRy7iH3NyDtF59XoW8MKSeFlJRdrh3MDHg%3D%3D",
        id: 3,
        quantity:1,
        url: '/nuestroscafes/peru',
        description: '“El alma de los Andes en una taza”',
        tags: ["viajar"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fperu.png?alt=media&token=2601f223-3fdf-423e-8d07-a28017477319",
        profile: [
            '🌱 100% Arábica, variedades Bourbon y Typica cultivadas en la región de Cajamarca entre 1.600 y 2.000 msnm.',
            'Suelos ricos en materia orgánica, rodeados de bosques nubosos y biodiversidad sagrada.',
            'Cultivo orgánico certificado por cooperativas de pequeños caficultores andinos.',
            'Proceso lavado con secado al sol, respetando prácticas ancestrales y sostenibles.',
            'Perfil aromático, dulce y armónico, con cuerpo medio y acidez suave.',
            'Perfecto para métodos como prensa francesa, V60 o espresso suave.'
        ],
        tasteNotes: [
            'Entrada: Dulce y fragante, con notas de panela, albaricoque seco y flor de cacao.',
            'Cuerpo: Medio, sedoso y con textura de miel ligera.',
            'Final: Persistente y espiritual, con notas de nuez, vainilla silvestre y una sensación cálida a tierra mojada.'
        ],
        emotionalDescription: [
            '"Perú Andino Orgánico" es un café con alma indígena. Cada grano crece en armonía con la Pachamama, bajo el cuidado de comunidades que cultivan con sabiduría ancestral y respeto profundo por la naturaleza.',
            'Este café no grita: susurra. Habla con dulzura, con calma, con propósito. Es un abrazo de montaña, una caminata entre neblinas, una historia contada al calor del fuego.',
            'Para quienes buscan más que sabor: buscan conexión. Para los que sienten que el verdadero lujo... está en lo auténtico.'
        ], 
        price: 10
    },
    {
        name: "hawái:kona élite",
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fhawaii.png?alt=media&token=09a58b8f-d4b2-4990-bc01-8c61f86647cf",
        id: 4,
        quantity:1,
        url: '/nuestroscafes/hawai',
        description: '“Lujo volcánico entre olas y flores. Un viaje sensorial al paraíso”',
        tags: ["viajar"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fhawai.png?alt=media&token=70c1bf4d-e507-48ff-a341-03ed9769d65f",
        profile: [
            '🌱100% Arábica, variedad Typica Kona, cultivado en las laderas volcánicas del Mauna Loa entre 600 y 1.000 msnm.',
            'Suelos negros de origen volcánico, microclima tropical con niebla matinal y tardes soleadas que maduran el grano lentamente.',
            'Proceso lavado con secado al sol en patios de piedra, siguiendo métodos tradicionales hawaianos.',
            'Perfil suave, elegante y exótico, con una acidez brillante perfectamente balanceada y una textura sedosa.',
            'Ideal para Chemex, V60 o sifón japonés que exalten su sutileza y profundidad aromática.'
        ],
        tasteNotes: [
            'Entrada: Floral y tropical, con toques de jazmín, papaya fresca y vainilla suave.',
            'Cuerpo: Ligero pero untuoso, con estructura satinada que llena la boca sin pesar.',
            'Final: Persistente y refinado, con ecos de almendra blanca, néctar de piña y toque a mantequilla tostada.'
        ],
        emotionalDescription: [
            '"Hawái Kona Elite" es una postal que se bebe. Una fantasía líquida que nace entre olas, volcanes y flores exóticas. Cada grano es cultivado como si fuera una perla en la isla, en fincas pequeñas que miman la calidad por encima de la cantidad.',
            'Este café es símbolo de sofisticación tropical, de elegancia sin prisa, de experiencias que solo se viven una vez. Su sabor evoca el viento cálido, el perfume de las gardenias y el susurro del océano.',
            'No es una taza, es un destino. Y cada sorbo... una luna de miel con el paladar.'
        ], 
        price: 10
    },
    {
        name: "🇵🇷 puerto rico: reserva del caribe",
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fpuerto-rico.png?alt=media&token=4b53074f-009d-4885-ad1d-278e03383f57",
        id: 5,
        quantity:1,
        url: '/nuestroscafes/puertorico',
        description: '“Café con corazón isleño. Un clásico caribeño ”',
        tags: ["viajar"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fpuertorico.jpg?alt=media&token=8e570ba1-2c80-4e0d-a130-7cea1679c3d0",
        profile: [
            '🌱100% Arábica, variedad Bourbon y Typica cultivado entre 700 y 1.200 msnm en las montañas de Adjuntas y Yauco.',
            'Suelos volcánicos y clima tropical húmedo con noches frescas que maduran lentamente el grano.',
            'Proceso lavado tradicional, con fermentación lenta y secado en patios al sol.',
            'Perfil denso, tostado, con notas cálidas y cuerpo firme.',
            'Ideal para espresso y moka, donde despliega todo su carácter clásico, o en prensa para disfrutar su redondez.'
        ],
        tasteNotes: [
            'Entrada: Rica y profunda, con notas de nuez tostada, tabaco suave y caramelo oscuro.',
            'Cuerpo: Medio-alto, robusto y envolvente, con textura cremosa que abraza el paladar.',
            'Final: Persistente, cálido y especiado, con ecos de cacao amargo, vainilla negra y ron añejo.'
        ],
        emotionalDescription: [
            '"Puerto Rico Reserva del Caribe" es más que café. Es historia líquida. Es una taza que habla de orgullo, de lucha, de raíces. Cultivado en una isla que ha resistido huracanes y olvidos, este grano es símbolo de resiliencia y sabor con alma.',
            'Cada sorbo lleva la pasión boricua: fuerte pero dulce, firme pero vibrante. Un café con carácter de pueblo, con corazón de abuela, con sabor de fiesta.',
            'Para los que entienden que una isla entera cabe en una taza... y que el sabor del Caribe no se olvida, se celebra.'
        ], 
        price: 10
    },
    {
        name: "🇨🇷 costa rica: valle central",
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fcosta-rica.png?alt=media&token=36f9d933-9aa9-494c-8f2a-e1726610eeae",
        id: 6,
        quantity:1,
        url: '/nuestroscafes/costarica',
        description: '“Donde la pureza se transforma en sabor”',
        tags: ["viajar"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fcostarica.png?alt=media&token=a9497380-2bf5-4067-8ec6-56fb6a9c2356",
        profile: [
            '🌱 100% Arábica, variedad Caturra y Catuai cultivadas entre 1.200 y 1.650 msnm en el Valle Central costarricense.',
            'Suelos volcánicos y clima balanceado con lluvias suaves y brisas frescas.',
            'Proceso honey (miel) con fermentación natural parcial que equilibra dulzor y acidez.',
            'Perfil limpio, vibrante y sedoso, con un equilibrio impecable entre cuerpo y frescura.',
            'Perfecto para métodos filtrados como Chemex, V60 o Kalita, donde su transparencia aromática brilla.'
        ],
        tasteNotes: [
            'Entrada: Amable y terrosa, con notas de canela, manzana cocida y nuez moscada.',
            'Cuerpo: Medio, con textura envolvente y cremosa, como seda tostada.',
            'Final: Largo y meloso, con recuerdos a azúcar moreno, cacao ligero y madera dulce.'
        ],
        emotionalDescription: [
            '"Costa Rica Valle Central" es una sinfonía de pureza. Nace en un país que lo ha apostado todo a la sostenibilidad y la excelencia, y cada grano refleja esa filosofía de respeto y equilibrio con la tierra.',
            'Este café es la definición de claridad en taza. Cada sorbo es como una caminata por senderos de montaña: fresco, limpio, armonioso. No necesita exagerar para brillar. Su fuerza está en su elegancia sutil, en su ligereza envolvente, en su carácter natural.',
            'Ideal para quienes aman lo puro. Para los que encuentran la perfección en lo simple... y la magia en lo real.'
        ], 
        price: 10

    },
    {
        name: "🇧🇷 Brasil: cerrado mineiro",
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fbrasil.png?alt=media&token=ebc2be34-dcd9-469a-a6c2-6c4e577ae7a4",
        id: 21,
        quantity:1,
        url: '/nuestroscafes/brasil',
        description: '"Sabor que conquista el mundo"',
        tags: ["viajar"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fbrasil.jpg?alt=media&token=04b35382-8c30-46c3-b17e-8749fe4db85b",
        profile: [
            '🌱100% Arábica, variedades Mundo Novo y Catuai cultivadas en la región del Cerrado Mineiro entre 900 y 1.200 msnm.',
            'Suelos fértiles, clima seco y soleado durante la cosecha, lo que permite una maduración perfecta y un secado natural en patios.',
            'Proceso natural (sin lavado), conservando los azúcares del fruto en cada grano.',
            'Perfil redondo, dulce, con baja acidez y cuerpo cremoso.',
            'Ideal para espresso, moka italiana y cápsulas. También funciona muy bien como base de mezclas gourmet.'
        ],
        tasteNotes: [
            'Entrada: Suave y envolvente, con notas de cacao, avellana tostada y azúcar moreno.',
            'Cuerpo: Medio-alto, muy cremoso y uniforme, como un bombón derretido.',
            'Final: Largo, achocolatado y limpio, con recuerdo a nuez, caramelo y mantequilla dorada.'
        ],
        emotionalDescription: [
            '"Brasil Cerrado Mineiro" es ese café que nunca falla. Tiene alma de campeón y corazón de hogar. Es el sabor que acompaña conversaciones, madrugadas, sobremesas y grandes ideas.',
            'Este grano es la base sólida de muchas mezclas... pero por sí solo ya brilla. Tiene ese algo que no se explica pero se siente: calidez, profundidad y una redondez que abraza el alma.',
            'Para los que buscan equilibrio, sabor clásico y textura cremosa. Para los que saben que un buen café no necesita gritar para enamorar... solo necesita ser Brasil.'
        ], 
        price: 10

    },
    {
        name: "Golden Sunset: sídamo edition",
        description: '"Cae el sol, sube tu energia. Sin prisas, sin cafeína, solo placer."',
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fgolden-sunset.png?alt=media&token=b95fc3d0-94dd-4343-978d-558088bd9fc2",
        id: 7,
        quantity:1,
        url: "/nuestroscafes/goldensunset",
        tags: ["tesoros", "exclusive", "descafeinado"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fgolden-sunset.jpg?alt=media&token=3dee2020-81b0-4591-bea8-43ff9e522e6d",
        profile: [
            'Base suave y achocolatada con notas de doble chocolate del Swiss Water colombiano',
            'Toque frutal del Sidamo, cultivado entre plantaciones de cacao y arboles tropicales',
            'Final sedoso y especiado con canela de Ceylan molida al momento'
        ],
        tasteNotes: [],
        emotionalDescription: [], 
        price: 10
    },
    {
        name: "Coffee Power Total Relax",
        description: '"Descansa sin renunciar al placer. Cafe suave para cerrar el dia con calma y alma."',
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Ftotal-relax.png?alt=media&token=eaf19987-fdad-429a-8a67-119e8e192f2b",
        id: 8,
        quantity:1,
        url: "/nuestroscafes/totalrelax",
        tags: ["power-selection", "exclusive", "descafeinado", "tesoros"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Frelax-movil.jpg?alt=media&token=888aa04d-1edf-4d8b-bf9f-97e70f0a4894",
        profile: [
            'Base 100% Swiss Water Colombiano descafeinado al 99.9%',
            'Notas achocolatadas con cuerpo sedoso y tostado suave',
            'Final redondo y reconfortante que acaricia el paladar'
        ],
        tasteNotes: [],
        emotionalDescription: [], 
        price: 10

    },
    {
        name: "🇨🇴 Coffee Power Serenidad",
        description: '“Swiss Water descafeinado Especialidad Colombia”',
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fserenidad.png?alt=media",
        id: 9,
        quantity:1,
        url: "/nuestroscafes/serenidad",
        tags: ["descafeinado", "mas-vendido", "colombia", "ecologico"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fserenidad1-movil.jpg?alt=media&token=e0bb5951-bc46-4894-b254-be177e50a002",
        profile: [
            '🌱 100% Arábica — Café de Especialidad',
            'Aroma a chocolate suave que evoca el mejor chocolate suizo del mundo, pero en café.',
            'Sabor equilibrado, dulce y sedoso, con un final limpio que invita a relajarte y disfrutar cada sorbo con tranquilidad.'
        ],
        tasteNotes: [
            'Entrada suave con dulzura natural que recuerda al chocolate suizo.',
            'Cuerpo medio y textura sedosa.',
            'Sutiles notas de frutos secos y caramelo ligero.',
            'Final limpio y relajante que invita a cada sorbo con tranquilidad.'
        ],
        emotionalDescription: [
            '“Coffee Power Serenidad” no es solo un descafeinado. Es una experiencia que equilibra placer y bienestar. Un café creado para quienes aman el sabor auténtico y cuidan su salud y descanso.',
            'Cada grano proviene de fincas de altura en Colombia, donde el respeto por el cultivo y el amor por el café se sienten en cada cosecha. Ha sido descafeinado con el método Swiss Water, el más natural y puro, sin químicos ni disolventes, solo agua y paciencia.',
            'Tostado con maestría por un experto con más de 40 años de experiencia, utilizando tecnología de precisión que permite mantener intacta su esencia.',
            'Serenidad no solo es su nombre. Es lo que sentirás en cada sorbo.'
        ], 
        price: 10
    },
    {
        name: "🇨🇴 Coffee Power Supremo",
        description: '“La excelencia de nuestro café insignia”',
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fsupremo.png?alt=media&token=cde68894-51c4-4f06-a75a-7368a37630f3",
        url: "/nuestroscafes/supremo",
        tags: ["mas-vendido", "colombia"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fsupremo-pc.jpg?alt=media&token=b4dfbe23-cd33-486d-b93e-3208ad9aaf45",
        id: 10,
        quantity:1,
        profile: [
            '🌱 100% Arábica — Café de Especialidad',
            'Aroma floral y frutal con toques de caña de azúcar.',
            'Sabor equilibrado con notas de panela, frutos rojos y una acidez cítrica vibrante.',
            '¡Cuerpo medio-alto y un final dulce que permanece en el paladar.'
        ],
        tasteNotes: [
            'Entrada dulce con notas de caña de azúcar y frutas rojas.',
            'Cuerpo sedoso con balance entre dulzura y acidez.',
            'Final prolongado con matices florales y cítricos.'
        ],
        emotionalDescription: [
            'Nuestro café colombiano es mucho más que un origen. Es la expresión de una relación cercana y directa con productores de élite, donde cada grano ha sido seleccionado con el mismo criterio con el que elegirías lo mejor para tu familia.',
            ' Trabajamos codo a codo con expertos de confianza, para garantizar que cada lote que recibimos cumpla con los más altos estándares de calidad, sostenibilidad y sabor.',
            'Es el café que mejor representa la filosofía Coffee Power: autenticidad, excelencia y respeto por el arte de cultivar.',
            'Cuando eliges este café, no solo disfrutas un origen legendario. Te llevas a casa el resultado de años de colaboración, pasión y una búsqueda incansable por ofrecer lo mejor.'
        ], 
        price: 10
    },
    {
        name: "🇨🇴 Coffee Power AMUCC",
        description: '“El sabor del empoderamiento femenino en el Cauca colombiano”',
        image:"https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2FAMUCC.png?alt=media",
        id: 11,
        quantity:1,
        url: "/nuestroscafes/amucc",
        tags: ["ecologico", "colombia", "power-selection"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Famucc-movil.jpg?alt=media&token=b85baa1a-54f0-4af3-8b7e-b522f0d121fb",
        profile: [
            '🌱 100% Arábica — Café de Especialidad',
            'Aroma intenso con notas de frutas dulces, cacao y panela.',
            'Sabor equilibrado con toques de almendra y avellana.',
            'Acidez brillante y cuerpo medio que culmina en un final limpio y persistente.'
        ],
        tasteNotes: [
            'Entrada dulce con notas de frutas maduras y panela.',
            'Cuerpo medio con textura suave.',
            'Final largo con matices de frutos secos y cacao.'
        ],
        emotionalDescription: [
            '“Coffee Power AMUCC” no es solo un café; es el fruto del esfuerzo y la resiliencia de mujeres caficultoras en el Cauca. Producido por la Asociación de Mujeres Caficultoras del Cauca (AMUCC), este café representa una historia de superación y compromiso con la calidad y la sostenibilidad.',
            'Cada grano es cultivado en pequeñas fincas a altitudes entre 1.700 y 1.900 metros, en suelos volcánicos que aportan riqueza y carácter al café.',
            'El proceso de producción se realiza bajo prácticas ecológicas y de comercio justo, garantizando un impacto positivo en las comunidades y el medio ambiente.',
            'Al elegir este café, apoyas el empoderamiento de mujeres que, a través del café, han transformado sus vidas y las de sus comunidades.'
        ], 
        price: 10
    },
    {
        name: "🇲🇽 Coffee Power Relax",
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Frelax.png?alt=media&token=f50a6871-14eb-441b-9e0b-80c9a1a8e865",
        id: 12,
        quantity:1,
        url: '/nuestroscafes/relax',
        description: '"Swiss Water Descafeinado México"',
        tags: ["descafeinado", "mas-vendido", "favoritos-chef", "power-selection"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Frelax2-movi.jpg?alt=media&token=e530888b-22a4-4d0c-b02f-dc9390722e0d",
        profile: [
            '🌱 100% Arábica — Café de Especialidad',
            'Aroma suave con notas de nuez y cacao.',
            'Sabor ligero con dulzura natural y un final sencillo y refrescante.'
        ],
        tasteNotes: [
            'Entrada ligera con notas de nuez y caramelo suave.',
            'Cuerpo ligero y textura amable.',
            'Final corto y limpio que invita a la calma.'
        ],
        emotionalDescription: [
            '“Coffee Power Relax” es el café para quienes buscan tranquilidad sin renunciar al sabor. Una opción accesible y natural para disfrutar tu ritual diario con equilibrio y sin preocupaciones.',
            'Cada grano ha sido descafeinado con el método Swiss Water, libre de químicos y disolventes, manteniendo su esencia natural.',
            'Cultivado en tierras mexicanas que le aportan su sabor suave y amigable.',
            'Coffee Power Relax es el descanso que te mereces en cada taza.'
        ], 
        price: 10

    },
    {
        name: "🇨🇴 Esencia de Victoria",
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fesencia-de-victoria.png?alt=media&token=e49d3236-e22e-473a-86ac-072a70ee91bd",
        id: 13,
        quantity:1,
        url: '/nuestroscafes/esenciavictoria',
        description: '"🌺 Un tributo al amor, a lo dulce… y a lo verdaderamente inolvidable."',
        tags: ["mas-vendido", "favoritos-chef", "colombia", "exclusive"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fesencia-victoria.jpg?alt=media&token=ea1ae57c-7283-4141-942a-c74f2f4d908f" ,
        profile: [
            '🌱 Elixir 100% Arábica.',
            '📍 Composición exclusiva de: Cafetales colombianos abrazados por árboles de mango, que transfieren al grano una esencia frutal única, alegre y exótica.',
            'Desde las tierras altas de Etiopía, este café aporta un fondo achocolatado que realza el dulzor tropical.',
            'Café dominicano de altura, con cuerpo sedoso, perfil meloso y un final encantador, digno de una princesa caribeña.'
        ],
        tasteNotes: [
            '☕ Entrada frutal intensa con carácter tropical, dominada por la dulzura del mango maduro que acaricia el paladar desde el primer sorbo.',
            '🍫 Cuerpo medio-alto, sedoso, con un fondo achocolatado profundo que se entrelaza suavemente con la fruta.',
            '💫 Final largo, redondo y jugoso, con ecos melosos que permanecen, dejando una sensación cálida y elegante.',
            '🔬 Diseñada para revelar su complejidad tanto en espresso como en métodos filtrados, esta composición expresa lo mejor de tres tierras y una intención clara: transformar una taza en una experiencia emocional.'
        ],
        emotionalDescription: [
            '"Esencia de Victoria" no es solo café —es un homenaje. Inspirada en la hija del fundador de Coffee Power, una joven dulce, alegre y enamorada de República Dominicana, esta creación refleja su carácter: encantadora, vibrante y adictiva.',
            'Desde los cafetales bañados por mangos en Colombia, pasando por la profundidad ancestral de Etiopía, hasta el encanto meloso del Caribe, esta composición nace del amor familiar y el arte de crear experiencias únicas en una taza.',
            'Un elixir que transforma cada sorbo en un recuerdo, en una emoción. Es la fusion perfecta entre ternura y carácter. Entre lo dulce… y lo inolvidable.'
        ], 
        price: 10

    },
    {
        name: "🇩🇴 El bendecido",
        id: 14,
        quantity:1,
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fel-bendecido.png?alt=media&token=6e1d3d61-7bbe-48b3-8dd8-db9c3701f01a",
        url: '/nuestroscafes/elbendecido',
        description: '"🇩🇴 La vibra de una tierra sagrada, el sabor de un pueblo lleno de AMOR."',
        tags: ["mas-vendido", "viajar"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fel-bendecido.png?alt=media&token=70d3886f-bb3b-4b91-861b-15f578a9ba7b" ,
        profile: [
            '🌱 Café de Especialidad 100% Arábica',
            '📍 Origen único: República Dominicana – Finca Premium de altura',
            'Cultivado en tierras ricas en minerales, bajo el sol caribeño y el amor dominicano.',
            'Cosecha manual, fermentación natural lenta y secado al sol caribeño.',
            'Tueste desarrollado especialmente por un Maestro para resaltar su identidad: alegre, vibrante y poderoso.'
        ],
        tasteNotes: [
            'Entrada vibrante, con una dulzura melosa que recuerda a la caña de azúcar y el azúcar moreno artesanal.',
            'Notas tropicales de piña madura y mandarina, envueltas en una textura cremosa que acaricia el paladar.',
            'Toques sutiles de cacao y canela dominicana, que aportan equilibrio y carácter al conjunto.',
            'Final persistente y limpio, con una sensación cálida que te deja sonriendo… como un abrazo en la isla.'
        ],
        emotionalDescription: [
            'Es una declaración de amor a República Dominicana, tierra fértil, alegre, vibrante y poderosa. Cada grano nace entre montañas, brisa tropical y plantaciones de banano, donde el sol no solo calienta la tierra… la llena de energía.',
            'Esta creación honra al pueblo dominicano: su espíritu trabajador, su sonrisa eterna y su conexión única con la naturaleza. Es el café que vibra alto, que te abraza con fuerza y te hace sonreír.',
            'Y sí, también lleva el ADN de una leyenda: 💪 Plátano Power, como el de los beisbolistas dominicanos que conquistan el mundo. Aquí, esa energía se bebe. Natural. Auténtica. Bendecida. Porque lo bendecido no se improvisa… se cultiva. Y en esta taza, se celebra.'
        ], 
        price: 10

    },
    {
        name: "🇪🇹 El Origen",
        id: 15,
        quantity:1,
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fel-origen.png?alt=media&token=79427b02-4232-4af0-8e28-3d2b398a0ad8",
        url: '/nuestroscafes/elorigen',
        description: '"🌍 Donde todo comenzó. Donde aún se siente la magia."',
        tags: ["mas-vendido", "favoritos-chef", "viajar"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fel-origen.png?alt=media&token=5170f390-2222-44cb-a7e2-99165aa6a893",
        profile: [
            '🌱 Café de Especialidad 100% Arábica – Altura Extrema',
            '📍 Origen: 🇪🇹 Tierras Altas de Etiopía – Región de Sidamo',
            ' Cultivado por encima de los 2.700 metros sobre el nivel del mar, donde la altura extrema potencia la acidez natural del grano.',
            'Suelo volcánico, sombra natural y recolección manual en pequeñas parcelas familiares.',
            'Perfil con bajo contenido en cafeína, ideal para consumir desde la tarde sin alterar el sueño.',
            'Tueste suave y desarrollado con precisión para resaltar notas achocolatadas y una textura aterciopelada.'
        ],
        tasteNotes: [
            'Entrada delicada y envolvente, con una acidez fina y luminosa que despierta los sentidos sin alterar la calma.',
            'Notas achocolatadas suaves, que recuerdan al chocolate con leche y dan una sensación reconfortante desde el primer sorbo.',
            'Cuerpo ligero y textura aterciopelada, ideal para cappuccinos y cafés con leche sedosos, sin amargor.',
            'Final limpio y redondo, con un retrogusto dulce que se mantiene sin saturar el paladar.'
        ],
        emotionalDescription: [
            '“El Origen” es una joya nacida en las tierras altas de Etiopía, cuna ancestral del café. Un grano cultivado en altitud extrema, donde el aire es más puro, el tiempo más lento, y el alma del café más viva que nunca.',
            'Este café ha sido creado para los momentos donde el cuerpo pide calma, pero el paladar aún desea magia. Su baja cafeína lo convierte en el compañero perfecto para las tardes, cuando el cuerpo humano, guiado por su ciclo circadiano, comienza a prepararse para el descanso. Ligero en energía, profundo en sensaciones.',
            'Su color recuerda al chocolate con leche, su sabor acaricia el alma. Y su textura… convierte cada cappuccino en un ritual suave, sedoso e inolvidable. “El Origen” es más que un café. Es el equilibrio perfecto entre tradición, salud y placer.'
        ], 
        price: 10

    },
    {
        name: "Night Edition",
        id:20,
        quantity:1,
        description: '"Descafeinado 100% natural Swiss Water"',
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fnight-edition.png?alt=media&token=7e0264a9-4be6-4d0a-abac-1f34b3812a26",
        profile:[],
        tasteNotes: [],
        emotionalDescription:[],
        url: '/nuestroscafes/noche',
        tags: [`descafeinado`],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fnoche-movil.jpg?alt=media&token=9c2d9419-7fae-43b2-95f7-8642e24b2b36",
    },
    {
        name: "🇰🇪 SL28 Kenia Premium ",
        id: 16,
        quantity:1,
        description: '"El fuego brillante de África"',
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fkenia-premium.png?alt=media&token=6f07f144-59a3-4fff-8feb-11bc638d7f88",
        url: "/nuestroscafes/kenia",
        tags: ["favoritos-chef"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fkenia-movil.jpg?alt=media&token=17879b28-4e6b-48a4-9aa1-3ab5fad87534",
        profile: [
            '🌱 100% Arábica, varietal SL28, cultivado en altitudes entre 1.700 y 2.100 msnm en las laderas volcánicas del Monte Kenia.',
            'Proceso lavado tradicional con doble fermentación, técnica clave en su perfil brillante.',
            'Un café explosivo, con acidez vibrante y estructura compleja.',
            'Ideal para métodos filtrados que revelen sus capas de sabor con precisión y elegancia.'
        ],
        tasteNotes: [
            'Entrada: Fresca, eléctrica, con estallido de toronja, grosella negra y un toque de lima.',
            'Cuerpo: Medio, sedoso y jugoso, con estructura viva y chispeante.',
            'Final: Persistente, limpio y floral, con recuerdos a té negro dulce y piel de naranja.'
        ],
        emotionalDescription: [
            '"Kenia SL28" es un canto a la intensidad. Una danza salvaje de frutas rojas, acidez jugosa y elegancia africana. Este café representa lo indomable, lo puro, lo que no se puede domar.',
            'Cultivado en tierras volcánicas, bajo un cielo que respira historia y leyenda, este café es como el rugido de un león en la sabana: inolvidable. Cada sorbo es una travesía que despierta el alma, transportando a quien lo prueba a un lugar donde la energía se convierte en sabor y el café se convierte en fuego líquido.',
            'No es para todos. Es para quienes buscan algo más que una taza: una experiencia feroz, brillante y auténtica.'
        ], 
        price: 10
    },
    {
        name: "🇨🇴 Coffee Power Geisha",
        id: 17,
        quantity:1,
        description: '"La joya de la corona Coffee Power Selection. El café preferido del chef de la casa; Chris Rosas"',
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fgeisha.png?alt=media&token=cdff954b-bb72-4738-97a0-edeb817a9ba4",
        url: "/nuestroscafes/geisha",
        tags: ["mas-vendido", "favoritos-chef", "power-selection", "colombia"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fgeisha-mobile.jpg?alt=media&token=ebe504dd-9a77-47dd-a7a5-8fe6171d5ccf",
        profile: [
            '🌱 100% Arábica — Variedad Geisha de especialidad.',
            'Cada grano ha sido seleccionado manualmente, asegurando que solo las cosechas con el equilibrio perfecto de aroma, dulzura y acidez formen parte de esta edición icónica.',
            'El tueste medio ha sido desarrollado por un maestro tostador con más de 40 años de experiencia, utilizando tecnología de precisión valorada en más de 3 millones de euros. Este sistema de tueste de última generación permite resaltar las complejas notas florales y frutales del Geisha sin comprometer su pureza ni su elegancia natural.',
            'Este Geisha se presenta como un microlote exclusivo cosecha 2024/2025, cuidadosamente limitado a 999 unidades de 300 gramos / unidad de la colección privada cosecha 2024/2025.',
            'Cada unidad ha sido diseñada bajo estrictos controles de conservación, garantizando una frescura impecable, con tueste reciente y una humedad óptima para preservar su perfil sensorial único.',
        ],
        tasteNotes: [
            'Notas florales de jazmín y rosa.',
            'Matices dulces de miel y frutas exóticas como maracuyá y papaya.',
            'Cuerpo sedoso con una acidez brillante y elegante.',
            'Final largo, limpio y persistente, que deja una huella inolvidable en cada sorbo.'
        ],
        emotionalDescription: [
            'No todos los cafés nacen para ser leyenda. Coffee Power Geisha es el resultado de años de búsqueda, catas en los rincones más exóticos del mundo y la pasión incansable del chef de la casa, Chris Rosas, por encontrar la experiencia cafetera suprema.',
            'Este Geisha no solo destaca por su linaje y perfección sensorial, sino por haber conquistado el corazón y el paladar de quien lidera cada receta en Coffee Power.',
            'Cada grano es un testimonio de excelencia, tradición y el compromiso de ofrecer solo lo mejor a los amantes del café de especialidad.',
            'No es un café más. Es una declaración de maestría. Una experiencia reservada solo para los verdaderos conocedores.'
        ], 
        price: 10

    },
    {
        name: "🇨🇴 Bourbon Supremo",
        description: '“El alma eterna del café”',
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fbourbon-supremo.png?alt=media&token=acef31cc-aea2-43f7-b8f1-7aa589693254",
        id: 18,
        quantity:0,
        url: "/nuestroscafes/bourbon",
        tags: ["mas-vendido", "favoritos-chef", "power-selection", "tesoros", "colombia", "ecologico"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fbourbon-movil.jpg?alt=media&token=692916ea-5d42-42c7-83d3-7c2c113df7d0",
        profile: [
            '100% Arábica, variedad Bourbon rojo cultivado entre 1.500 y 1.800 metros sobre el nivel del mar',
            'Suelos volcánicos ricos en minerales que realzan su perfil dulce y redondo.',
            'Proceso lavado artesanal, con fermentación controlada y secado solar en camas africanas.',
            'Este café ofrece una estructura noble, con equilibrio perfecto entre acidez suave, dulzor natural y aromas envolventes.'
        ],
        tasteNotes: [],
        emotionalDescription: [], 
        price: 10

    },
    {
        name: "Caracolillo",
        id: 19,
        quantity:1,
        description: '"El secreto mejor guardado de la naturaleza"',
        image: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/coffees%2Fcaracolillo.png?alt=media&token=03813fee-b228-4726-8e4c-88c4098e9d5f",
        url: "/nuestroscafes/caracolillo",
        tags: ["mas-vendido", "viajar"],
        background: "https://firebasestorage.googleapis.com/v0/b/aroma-king-web.appspot.com/o/backgrounds%2Fcaracolillo.png?alt=media&token=416fff1b-ccce-4289-a882-8a505998d996",
        profile: [
            '🌱100% Arábica, grano tipo peaberry (caracolillo), una mutación natural donde solo se desarrolla una semilla redonda en lugar de dos planas.',
            'Cultivado en altitudes entre 1.400 y 1.800 msnm, seleccionado manualmente por su rareza y concentración de sabor.',
            'Proceso lavado con fermentación tradicional y secado lento al sol.',
            'Su forma redonda permite una tueste uniforme, potenciando su perfil dulce, vibrante y cremoso.',
            'Perfecto para métodos que respetan su complejidad: espresso, aeropress o V60.'
        ],
        tasteNotes: [
            'Entrada: Explosiva y dulce, con notas de cereza negra, toffee y un sutil toque cítrico.',
            'Cuerpo: Medio, muy redondo y aterciopelado, con una sensación cremosa envolvente.',
            'Final: Largo, jugoso y delicado, con ecos de frutos rojos confitados y nuez caramelizada'
        ],
        emotionalDescription: [
            '"Caracolillo" es un hallazgo. Es ese tesoro inesperado que la naturaleza regala solo a quienes miran más allá de lo evidente. Cada grano es una joya diminuta, pero poderosa; un unverso concentrado en una sola semilla.',
            'Este café no solo es raro. Es especial por cómo vibra en boca, por la intensidad de sus matices y por la armonía que transmite en cada sorbo. Su rareza no es capricho, es identidad. Su sabor, un susurro elegante que acaricia el alma.',
            'Para quienes creen que lo más valioso viene en frascos pequeños. Para los que saben que una taza puede guardar magia.'
        ], 
        price: 10
    },

];

module.exports = coffeesCatalogue;


