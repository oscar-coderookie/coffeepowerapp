import serenidadIcon from '../assets/coffees/serenidad.png';
import supremoIcon from '../assets/coffees/supremo.png';
import amuccIcon from '../assets/coffees/AMUCC.png';
import relaxIcon from '../assets/coffees/relax.png';
import victoriaIcon from '../assets/coffees/esencia-de-victoria.png';
import bendecidoIcon from '../assets/coffees/el-bendecido.png';
import origenIcon from '../assets/coffees/el-origen.png';
import nightIcon from '../assets/coffees/night-edition.png';
import geishaIcon from '../assets/coffees/geisha.png';
import bourbonIcon from '../assets/coffees/bourbon-supremo.png';
import keniaIcon from '../assets/coffees/kenia-premium.png';
import caracolilloIcon from '../assets/coffees/caracolillo.png';
import totalRelax from '../assets/coffees/total-relax.png';
import brasil from '../assets/coffees/brasil.png';
import goldenSunset from '../assets/coffees/golden-sunset.png'
import panama from '../assets/coffees/panama.png';
import nicaragua from '../assets/coffees/nicaragua.png';
import peru from '../assets/coffees/peru.png';
import hawai from '../assets/coffees/hawaii.png';
import puertoRico from '../assets/coffees/puerto-rico.png';
import costaRica from '../assets/coffees/costa-rica.png';

const coffeesCatalogue = [
    {
        name: "🇵🇦 Panama: Geisha Esmeralda",
        image: panama,
        url: '/nuestroscafes/panama',
        description: '“La joya de las alturas. Un perfume en taza... y el café más elegante del mundo.”',
        tags: ["viajar", "tesoros"],
    },
    {
        name: "🇳🇮 nicaragua: oro Volcánico",
        image: nicaragua,
        url: '/nuestroscafes/nicaragua',
        description: '“Un tesoro en calma, Café con alma suave, raíces profundas y final dorado.”',
        tags: ["viajar"],

    },
    {
        name: "🇵🇪 Perú: andino orgánico ",
        image: peru,
        url: '/nuestroscafes/peru',
        description: '“El alma de los Andes en una taza”',
        tags: ["viajar"],
    },
    {
        name: "hawái:kona élite",
        image: hawai,
        url: '/nuestroscafes/hawai',
        description: '“Lujo volcánico entre olas y flores. Un viaje sensorial al paraíso”',
        tags: ["viajar"],
    },
    {
        name: "🇵🇷 puerto rico: reserva del caribe",
        image: puertoRico,
        url: '/nuestroscafes/puertorico',
        description: '“Café con corazón isleño. Un clásico caribeño ”',
        tags: ["viajar"],
    },
    {
        name: "🇨🇷 costa rica: valle central",
        image: costaRica,
        url: '/nuestroscafes/costarica',
        description: '“Donde la pureza se transforma en sabor”',
        tags: ["viajar"],

    },

    {
        name: "🇧🇷 Brasil: cerrado mineiro",
        image: brasil,
        url: '/nuestroscafes/brasil',
        description: '"Sabor que conquista el mundo"',
        tags: ["viajar"],

    },
    {
        name: "Golden Sunset: sídamo edition",
        description: '"Cae el sol, sube tu energia. Sin prisas, sin cafeína, solo placer."',
        image: goldenSunset,
        url: "/nuestroscafes/goldensunset",
        tags: ["tesoros", "exclusive", "descafeinado"],
    },
    {
        name: "Coffee Power Total Relax",
        description: '"Descansa sin renunciar al placer. Cafe suave para cerrar el dia con calma y alma."',
        image: totalRelax,
        url: "/nuestroscafes/totalrelax",
        tags: ["power-selection", "exclusive", "descafeinado", "tesoros"],

    },
    {
        name: "🇨🇴 Coffee Power Serenidad",
        description: '“Swiss Water descafeinado Especialidad Colombia”',
        image: serenidadIcon,
        url: "/nuestroscafes/serenidad",
        tags: ["descafeinado", "mas-vendido", "colombia", "ecologico"],
    },
    {
        name: "🇨🇴 Coffee Power Supremo",
        description: '“La excelencia de nuestro café insignia”',
        image: supremoIcon,
        url: "/nuestroscafes/supremo",
        tags: ["mas-vendido", "colombia"],
    },
    {
        name: "🇨🇴 Coffee Power AMUCC",
        description: '“El sabor del empoderamiento femenino en el Cauca colombiano”',
        image: amuccIcon,
        url: "/nuestroscafes/amucc",
        tags: ["ecologico", "colombia", "power-selection"],
    },
    {
        name: "🇲🇽 Coffee Power Relax",
        image: relaxIcon,
        url: '/nuestroscafes/relax',
        description: '"Swiss Water Descafeinado México"',
        tags: ["descafeinado", "mas-vendido", "favoritos-chef","power-selection"],

    },
    {
        name: "🇨🇴 Esencia de Victoria",
        image: victoriaIcon,
        url: '/nuestroscafes/esenciavictoria',
        description: '"🌺 Un tributo al amor, a lo dulce… y a lo verdaderamente inolvidable."',
        tags: ["mas-vendido", "favoritos-chef", "colombia", "exclusive"],

    },
    {
        name: "🇩🇴 El bendecido",
        image: bendecidoIcon,
        url: '/nuestroscafes/elbendecido',
        description: '"🇩🇴 La vibra de una tierra sagrada, el sabor de un pueblo lleno de AMOR."',
        tags: ["mas-vendido", "viajar"],

    },
    {
        name: "🇪🇹 El Origen",
        image: origenIcon,
        url: '/nuestroscafes/elorigen',
        description: '"🌍 Donde todo comenzó. Donde aún se siente la magia."',
        tags: ["mas-vendido", "favoritos-chef", "viajar"],

    },
    {
        name: "Night Edition",
        description: '"Descafeinado 100% natural Swiss Water"',
        image: nightIcon,
        url: '/nuestroscafes/noche',
        tags: []
    },
    {
        name: "🇰🇪 SL28 Kenia Premium ",
        description: '"El fuego brillante de África"',
        image: keniaIcon,
        url: "/nuestroscafes/kenia",
        tags: ["favoritos-chef"]
    },
    {
        name: "🇨🇴 Coffee Power Geisha",
        description: '"La joya de la corona Coffee Power Selection. El café preferido del chef de la casa; Chris Rosas"',
        image: geishaIcon,
        url: "/nuestroscafes/geisha",
        tags: ["mas-vendido", "favoritos-chef", "power-selection", "colombia"],

    },
    {
        name: "🇨🇴 Bourbon Supremo",
        description: '“El alma eterna del café”',
        image: bourbonIcon,
        url: "/nuestroscafes/bourbon",
        tags: ["mas-vendido", "favoritos-chef", "power-selection", "tesoros", "colombia", "ecologico"],

    },
    {
        name: "Caracolillo",
        description: '"El secreto mejor guardado de la naturaleza"',
        image: caracolilloIcon,
        url: "/nuestroscafes/caracolillo",
        tags: ["mas-vendido", "viajar"],
    },

];

const coffeeCategories = [
    {
        key: "mas-vendido",
        name: "⭐ Más Vendidos",
        legend: '"No se agotan por casualidad. ¡Descubre por que todos los eligen!"',
    },
    {
        key: "power-selection",
        name: "Coffee Power Selection",
        legend: '"Nuestra élite secreta. Café para los que buscan lo más potente."',
    },
    {
        key: "ecologico",
        name: "🌱 Ecológicos",
        legend: '"Cuidamos el planeta, sin renunciar al placer. Elige consciente, saborea mejor."',
    },
    {
        key: "tesoros",
        name: "💎 Tesoros Escondidos",
        legend: '"Cafés que nadie conoce... aún. Solo para exploradores de verdad."'
    },
    {
        key: "exclusive",
        name: "✨ Recetas Exclusivas del día",
        legend: '"Ediciones limitadas. Sabor único que no se repite. ¿Te atreves hoy?"'
    },
    {
        key: "descafeinado",
        name: "🌙 Descafeinados de Élite",
        legend: '"Sin cafeína, con todo el carácter. Descubre lo que nadie te contó."'
    },
    {
        key: "colombia",
        name: "🇨🇴 Esencia de Colombia",
        legend:  '"Sabor auténtico desde el corazón cafetero del mundo."',
    },
    {
        key: "favoritos-chef",
        name: "👨‍🍳 Favoritos del Chef",
        legend: '"Si el chef los prefiere... será por algo. Pura excelencia en taza."'

    },
    {
        key: "viajar",
        name: "✈️ Viajar por el Mundo",
        legend: '"Explora el mundo sin moverte de tu taza. Cada país, una historia. Cada sorbo, un destino."'

    },
];

// 3. Función para filtrar cafés de cada categoría
const getCoffeesByTag = (tag) => {
    return coffeesCatalogue.filter((coffee) => coffee.tags.includes(tag));
};

export { coffeesCatalogue, coffeeCategories, getCoffeesByTag };
