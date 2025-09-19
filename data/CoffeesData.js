//imagenes de empaques de cafe:
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
//*imágenes de cada sección para cada café:
import serenidadBck from '../assets/backgrounds/serenidad2-movil.jpg';
import supremoBck from '../assets/backgrounds/supremo-pc.jpg';
import amuccBck from '../assets/backgrounds/amucc-movil.jpg';
import relaxBck from '../assets/backgrounds/relax2-movi.jpg';
import victoriaBck from '../assets/backgrounds/esencia-victoria.jpg';
import bendecidoBck from '../assets/backgrounds/el-bendecido.png';
import origenBck from '../assets/backgrounds/el-origen.png';
import nocheBck from '../assets/backgrounds/noche-movil.jpg';
import geishaBck from '../assets/backgrounds/geisha-mobile.jpg';
import bourbonBck from '../assets/backgrounds/bourbon-movil.jpg';
import keniaBck from '../assets/backgrounds/kenia-movil.jpg';
import caracolilloBck from '../assets/backgrounds/caracolillo.png';
import totalRelaxBck from '../assets/backgrounds/relax-movil.jpg';
import brasilBck from '../assets/backgrounds/brasil.jpg';
import goldenSunsetBck from '../assets/backgrounds/golden-sunset.jpg'
import panamaBck from '../assets/backgrounds/panama.jpg';
import nicaraguaBck from '../assets/backgrounds/nicaragua.png';
import peruBck from '../assets/backgrounds/peru.png';
import hawaiBck from '../assets/backgrounds/hawai.png';
import puertoRicoBck from '../assets/backgrounds/puertorico.jpg';
import costaRicaBck from '../assets/backgrounds/costarica.png';

const coffeesCatalogue = [
    {
        name: "🇵🇦 Panama: Geisha Esmeralda",
        image: panama,
        url: '/nuestroscafes/panama',
        description: '“La joya de las alturas. Un perfume en taza... y el café más elegante del mundo.”',
        tags: ["viajar", "tesoros"],
        background: panamaBck
    },
    {
        name: "🇳🇮 nicaragua: oro Volcánico",
        image: nicaragua,
        url: '/nuestroscafes/nicaragua',
        description: '“Un tesoro en calma, Café con alma suave, raíces profundas y final dorado.”',
        tags: ["viajar"],
        background: nicaraguaBck

    },
    {
        name: "🇵🇪 Perú: andino orgánico ",
        image: peru,
        url: '/nuestroscafes/peru',
        description: '“El alma de los Andes en una taza”',
        tags: ["viajar"],
        background: peruBck
    },
    {
        name: "hawái:kona élite",
        image: hawai,
        url: '/nuestroscafes/hawai',
        description: '“Lujo volcánico entre olas y flores. Un viaje sensorial al paraíso”',
        tags: ["viajar"],
        background: hawaiBck
    },
    {
        name: "🇵🇷 puerto rico: reserva del caribe",
        image: puertoRico,
        url: '/nuestroscafes/puertorico',
        description: '“Café con corazón isleño. Un clásico caribeño ”',
        tags: ["viajar"],
        background:puertoRicoBck
    },
    {
        name: "🇨🇷 costa rica: valle central",
        image: costaRica,
        url: '/nuestroscafes/costarica',
        description: '“Donde la pureza se transforma en sabor”',
        tags: ["viajar"],
        background:costaRicaBck

    },

    {
        name: "🇧🇷 Brasil: cerrado mineiro",
        image: brasil,
        url: '/nuestroscafes/brasil',
        description: '"Sabor que conquista el mundo"',
        tags: ["viajar"],
        background:brasilBck

    },
    {
        name: "Golden Sunset: sídamo edition",
        description: '"Cae el sol, sube tu energia. Sin prisas, sin cafeína, solo placer."',
        image: goldenSunset,
        url: "/nuestroscafes/goldensunset",
        tags: ["tesoros", "exclusive", "descafeinado"],
        background:goldenSunsetBck
    },
    {
        name: "Coffee Power Total Relax",
        description: '"Descansa sin renunciar al placer. Cafe suave para cerrar el dia con calma y alma."',
        image: totalRelax,
        url: "/nuestroscafes/totalrelax",
        tags: ["power-selection", "exclusive", "descafeinado", "tesoros"],
        background:totalRelaxBck

    },
    {
        name: "🇨🇴 Coffee Power Serenidad",
        description: '“Swiss Water descafeinado Especialidad Colombia”',
        image: serenidadIcon,
        url: "/nuestroscafes/serenidad",
        tags: ["descafeinado", "mas-vendido", "colombia", "ecologico"],
        background:serenidadBck
    },
    {
        name: "🇨🇴 Coffee Power Supremo",
        description: '“La excelencia de nuestro café insignia”',
        image: supremoIcon,
        url: "/nuestroscafes/supremo",
        tags: ["mas-vendido", "colombia"],
        background:supremoBck
    },
    {
        name: "🇨🇴 Coffee Power AMUCC",
        description: '“El sabor del empoderamiento femenino en el Cauca colombiano”',
        image: amuccIcon,
        url: "/nuestroscafes/amucc",
        tags: ["ecologico", "colombia", "power-selection"],
        background:amuccBck
    },
    {
        name: "🇲🇽 Coffee Power Relax",
        image: relaxIcon,
        url: '/nuestroscafes/relax',
        description: '"Swiss Water Descafeinado México"',
        tags: ["descafeinado", "mas-vendido", "favoritos-chef", "power-selection"],
        background:relaxBck

    },
    {
        name: "🇨🇴 Esencia de Victoria",
        image: victoriaIcon,
        url: '/nuestroscafes/esenciavictoria',
        description: '"🌺 Un tributo al amor, a lo dulce… y a lo verdaderamente inolvidable."',
        tags: ["mas-vendido", "favoritos-chef", "colombia", "exclusive"],
        background:victoriaBck

    },
    {
        name: "🇩🇴 El bendecido",
        image: bendecidoIcon,
        url: '/nuestroscafes/elbendecido',
        description: '"🇩🇴 La vibra de una tierra sagrada, el sabor de un pueblo lleno de AMOR."',
        tags: ["mas-vendido", "viajar"],
        background:bendecidoBck

    },
    {
        name: "🇪🇹 El Origen",
        image: origenIcon,
        url: '/nuestroscafes/elorigen',
        description: '"🌍 Donde todo comenzó. Donde aún se siente la magia."',
        tags: ["mas-vendido", "favoritos-chef", "viajar"],
        background:origenBck

    },
    {
        name: "Night Edition",
        description: '"Descafeinado 100% natural Swiss Water"',
        image: nightIcon,
        url: '/nuestroscafes/noche',
        tags: [`descafeinado`],
        background:nocheBck
    },
    {
        name: "🇰🇪 SL28 Kenia Premium ",
        description: '"El fuego brillante de África"',
        image: keniaIcon,
        url: "/nuestroscafes/kenia",
        tags: ["favoritos-chef"],
        background:keniaBck
    },
    {
        name: "🇨🇴 Coffee Power Geisha",
        description: '"La joya de la corona Coffee Power Selection. El café preferido del chef de la casa; Chris Rosas"',
        image: geishaIcon,
        url: "/nuestroscafes/geisha",
        tags: ["mas-vendido", "favoritos-chef", "power-selection", "colombia"],
        background:geishaBck

    },
    {
        name: "🇨🇴 Bourbon Supremo",
        description: '“El alma eterna del café”',
        image: bourbonIcon,
        url: "/nuestroscafes/bourbon",
        tags: ["mas-vendido", "favoritos-chef", "power-selection", "tesoros", "colombia", "ecologico"],
        background:bourbonBck

    },
    {
        name: "Caracolillo",
        description: '"El secreto mejor guardado de la naturaleza"',
        image: caracolilloIcon,
        url: "/nuestroscafes/caracolillo",
        tags: ["mas-vendido", "viajar"],
        background:caracolilloBck
    },

];

const coffeeCategories = [
    {
        key: "mas-vendido",
        name: "Los Más Vendidos",
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
        legend: '"Sabor auténtico desde el corazón cafetero del mundo."',
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
