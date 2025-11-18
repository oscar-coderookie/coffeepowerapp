import { drawerIcons } from "./icons";

export const screensConfig = [
  {
    name: "Nuestros Cafés",
    component: "CoffeesStack",
    icon: drawerIcons.cafe,
  },
  {
    name: "¿Quiénes Somos?",
    component: "AboutUsTabs",
    icon: drawerIcons.about,
  },
  {
    name: "Área personal",
    component: "UserStack",
    icon: drawerIcons.user,
  },
  {
    name: "Eventos",
    component: "EventsTabs",
    icon: drawerIcons.events,
  },
  {
    name: "Accesorios Pro",
    component: "AccesoriesPro",
    icon: drawerIcons.accesories,
  },
  {
    name: "Legal",
    component: "LegalStack",
    icon: drawerIcons.cafe,
  },
  {
    name: "CartScreen",
    component: "CartStack",
    hidden: true, // se oculta automáticamente
  },
];
