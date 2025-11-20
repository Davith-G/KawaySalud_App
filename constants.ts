import { Plant, EmergencyContact } from './types';

export const MOCK_PLANTS: Plant[] = [
  {
    id: 1,
    nameKichwa: "Matico",
    nameSpanish: "Matico",
    description: "Arbusto nativo de los Andes con hojas alargadas y textura rugosa.",
    uses: "Cicatrizante, infecciones externas, dolor de estómago.",
    imageUrl: "https://images.unsplash.com/photo-1610725663727-087950a922e7?auto=format&fit=crop&w=800&q=80",
    ingredients: ["5 hojas frescas de matico", "1 litro de agua hirviendo"],
    preparation: "1. Lavar bien las hojas.\n2. Colocar las hojas en un recipiente y verter el agua hirviendo.\n3. Tapar y dejar reposar por 10 minutos.\n4. Para heridas: Usar el agua tibia para lavar la zona afectada.\n5. Para beber: Tomar 1 taza 3 veces al día.",
    contraindications: "No usar en embarazo sin supervisión."
  },
  {
    id: 2,
    nameKichwa: "Manzanilla",
    nameSpanish: "Manzanilla",
    description: "Hierba aromática de flores blancas con centro amarillo, fácil de conseguir.",
    uses: "Calmante, digestivo, antiinflamatorio ocular.",
    imageUrl: "https://images.unsplash.com/photo-1595863475168-f3c447b91380?auto=format&fit=crop&w=800&q=80",
    ingredients: ["1 cucharada de flores secas o frescas", "1 taza de agua"],
    preparation: "1. Hervir el agua.\n2. Retirar del fuego y agregar las flores.\n3. Tapar por 5 minutos.\n4. Cernir y beber caliente.",
    contraindications: "Personas alérgicas al polen."
  },
  {
    id: 3,
    nameKichwa: "Santa María",
    nameSpanish: "Santa María",
    description: "Planta herbácea de olor fuerte, común en huertos andinos.",
    uses: "Dolores menstruales, golpes de aire, 'limpias'.",
    imageUrl: "https://images.unsplash.com/photo-1628519586379-641d54b69875?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Un manojo pequeño de hojas y tallos", "1 litro de agua"],
    preparation: "1. Hervir el agua con la planta por 5 minutos.\n2. Dejar entibiar.\n3. Beber media taza si es para dolor de barriga o usar el agua para baño si es para malestar general.",
    contraindications: "No usar durante el embarazo (puede ser abortiva)."
  },
  {
    id: 4,
    nameKichwa: "Eucalipto",
    nameSpanish: "Eucalipto",
    description: "Árbol grande de hojas aromáticas, muy común en la sierra.",
    uses: "Respiratorio, tos, gripe, descongestionante.",
    imageUrl: "https://images.unsplash.com/photo-1558695786-512db5613401?auto=format&fit=crop&w=800&q=80",
    ingredients: ["10 hojas maduras de eucalipto", "2 litros de agua"],
    preparation: "1. Poner a hervir el agua con las hojas en una olla grande.\n2. Cuando salga bastante vapor, retirar del fuego.\n3. Cubrirse la cabeza con una toalla e inhalar el vapor (vahos) por 10 minutos con cuidado de no quemarse.",
    contraindications: "No ingerir el aceite esencial. Cuidado con niños asmáticos."
  },
  {
    id: 5,
    nameKichwa: "Chini Panga",
    nameSpanish: "Ortiga",
    description: "Planta con pelos urticantes que pican al tacto.",
    uses: "Circulación, dolores musculares, artritis, purificación de sangre.",
    imageUrl: "https://images.unsplash.com/photo-1612189536067-545741102a4e?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Un ramo de ortiga fresca (usar guantes)", "Agua caliente para té"],
    preparation: "Para dolor muscular: \n1. Golpear suavemente la zona adolorida con la planta fresca (ortigamiento) para activar circulación.\n\nPara infusión:\n1. Usar 3 hojas en una taza de agua hirviendo, dejar reposar y beber.",
    contraindications: "Puede irritar la piel sensible. Usar con respeto."
  },
  {
    id: 6,
    nameKichwa: "Valeriana",
    nameSpanish: "Valeriana",
    description: "Planta pequeña cuyas raíces tienen propiedades sedantes.",
    uses: "Insomnio, nervios, ansiedad, estrés.",
    imageUrl: "https://images.unsplash.com/photo-1585662237143-88d381221d96?auto=format&fit=crop&w=800&q=80",
    ingredients: ["1 cucharadita de raíz triturada seca", "1 taza de agua"],
    preparation: "1. Hervir el agua.\n2. Agregar la raíz y dejar hervir a fuego lento 3 minutos.\n3. Dejar reposar tapado.\n4. Beber 30 minutos antes de dormir.",
    contraindications: "No mezclar con alcohol ni pastillas para dormir."
  },
  {
    id: 7,
    nameKichwa: "Orégano",
    nameSpanish: "Orégano",
    description: "Hierba de cocina muy fácil de encontrar en tiendas.",
    uses: "Cólicos estomacales, gases, digestión pesada.",
    imageUrl: "https://images.unsplash.com/photo-1627530339407-03e98e61d150?auto=format&fit=crop&w=800&q=80",
    ingredients: ["1 cucharada de orégano seco o fresco", "1 taza de agua hirviendo"],
    preparation: "1. Poner el orégano en la taza.\n2. Agregar agua hirviendo.\n3. Tapar con un plato por 5 minutos.\n4. Beber tibio, especialmente después de comer.",
    contraindications: "Ninguna en dosis alimenticias."
  },
  {
    id: 8,
    nameKichwa: "Verbena",
    nameSpanish: "Verbena",
    description: "Planta silvestre de flores moradas pequeñas.",
    uses: "Fiebre, hígado, depresión leve.",
    imageUrl: "https://images.unsplash.com/photo-1620153747129-6141d89e9a4c?auto=format&fit=crop&w=800&q=80",
    ingredients: ["1 rama pequeña de verbena", "1 taza de agua"],
    preparation: "1. Hervir el agua.\n2. Añadir la planta y apagar el fuego.\n3. Dejar reposar 5 minutos.\n4. Beber con un poco de limón (es amarga).",
    contraindications: "No usar en embarazo."
  },
  {
    id: 9,
    nameKichwa: "Yawar Wiki",
    nameSpanish: "Sangre de Drago",
    description: "Látex rojizo extraído de la corteza de un árbol amazónico, muy usado en la sierra.",
    uses: "Cicatrizante potente, úlceras gástricas, heridas profundas.",
    imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Gotas de látex de Sangre de Drago puro"],
    preparation: "1. Para heridas externas: Aplicar directamente sobre el corte limpio y frotar hasta que se vuelva una pasta blanca.\n2. Para gastritis: Diluir 5 gotas en medio vaso de agua tibia y tomar en ayunas.",
    contraindications: "No exceder la dosis. Puede causar estreñimiento."
  },
  {
    id: 10,
    nameKichwa: "Paiku",
    nameSpanish: "Paico",
    description: "Hierba aromática de olor penetrante, crece como maleza.",
    uses: "Parásitos intestinales, dolor de estómago.",
    imageUrl: "https://images.unsplash.com/photo-1638809315512-078929665128?auto=format&fit=crop&w=800&q=80",
    ingredients: ["1 rama de paico", "1 taza de agua"],
    preparation: "1. Exprimir el jugo de las hojas frescas (para parásitos) y tomar una cucharadita en ayunas (solo adultos).\n2. Infusión suave para dolor de barriga.",
    contraindications: "Muy fuerte. No dar a niños pequeños ni embarazadas (tóxico en altas dosis)."
  },
  {
    id: 11,
    nameKichwa: "Cedrón",
    nameSpanish: "Cedrón",
    description: "Arbusto de hojas largas con aroma a limón.",
    uses: "Nervios, insomnio, digestión, dolor de corazón (emocional).",
    imageUrl: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=800&q=80",
    ingredients: ["3 hojas frescas o secas de cedrón", "1 taza de agua caliente"],
    preparation: "1. Colocar las hojas en la taza.\n2. Agregar agua hirviendo.\n3. Dejar reposar 5 minutos.\n4. Tomar caliente después de las comidas o antes de dormir.",
    contraindications: "Ninguna conocida en uso moderado."
  },
  {
    id: 12,
    nameKichwa: "Ruda",
    nameSpanish: "Ruda",
    description: "Arbusto de hojas pequeñas, carnosas y de olor muy fuerte y penetrante.",
    uses: "Mal aire, cólicos menstruales, dolores de cabeza, limpieza energética.",
    imageUrl: "https://images.unsplash.com/photo-1620215176167-5a73711104c2?auto=format&fit=crop&w=800&q=80",
    ingredients: ["1 ramita pequeña de ruda", "1 litro de agua (para baño) o 1 taza (para beber con precaución)"],
    preparation: "1. Para el 'mal aire': Hervir un manojo en 2 litros de agua y bañarse con el agua tibia.\n2. Para cólicos (con cuidado): Una hojita en una taza de agua hirviendo por 2 minutos.",
    contraindications: "TOTALMENTE PROHIBIDA en el embarazo (abortiva) y lactancia. Tóxica en dosis altas."
  },
  {
    id: 13,
    nameKichwa: "Llantén",
    nameSpanish: "Llantén",
    description: "Hierba de hojas anchas y nervaduras marcadas, crece en lugares húmedos.",
    uses: "Inflamación, úlceras, gastritis, heridas externas.",
    imageUrl: "https://images.unsplash.com/photo-1635421255608-72098aa9144b?auto=format&fit=crop&w=800&q=80",
    ingredients: ["3 hojas de llantén lavadas", "1 taza de agua"],
    preparation: "1. Hervir el agua.\n2. Añadir las hojas y dejar reposar 10 minutos.\n3. Para heridas: Machacar las hojas frescas y poner sobre la herida.\n4. Para gastritis: Tomar la infusión tibia.",
    contraindications: "Ninguna en dosis normales."
  },
  {
    id: 14,
    nameKichwa: "Chilca",
    nameSpanish: "Chilca",
    description: "Arbusto de hojas resinosas y pegajosas, flores blancas pequeñas.",
    uses: "Golpes, torceduras, inflamación, frío en los huesos.",
    imageUrl: "https://images.unsplash.com/photo-1611735341450-74d61e66ee62?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Un manojo de ramas de chilca", "Aguardiente o trago (opcional)"],
    preparation: "1. Calentar las ramas en el fuego o en una sartén sin quemarlas.\n2. Colocar las ramas calientes sobre la zona adolorida o golpeada.\n3. Vendar con una tela limpia y dejar actuar toda la noche.",
    contraindications: "Solo uso externo. No ingerir."
  },
  {
    id: 15,
    nameKichwa: "Marku",
    nameSpanish: "Marco",
    description: "Planta de olor fuerte y amargo, hojas verdes grisáceas.",
    uses: "Frío, dolor de estómago, artritis, limpieza de parásitos.",
    imageUrl: "https://images.unsplash.com/photo-1597822735518-828e5d86a85e?auto=format&fit=crop&w=800&q=80",
    ingredients: ["1 rama de marco", "1 litro de agua"],
    preparation: "1. Hervir el agua con la planta por 5 minutos.\n2. Usar el agua caliente para baños de asiento o lavar las piernas si hay dolor de huesos.\n3. Para beber (parásitos): Solo media taza en ayunas (es muy fuerte).",
    contraindications: "No usar en embarazo. Dosis altas son tóxicas."
  }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { name: "Emergencias General", number: "911", type: "general" },
  { name: "Policía Nacional", number: "101", type: "police" },
  { name: "Centro Salud Cruz Loma", number: "171", type: "health" }
];

export const FIRST_AID_GUIDES = [
  { 
    id: 'rcp', 
    title: 'RCP (Reanimación)', 
    icon: '🫀',
    image: 'https://images.unsplash.com/photo-1584516150909-c43483ee7932?auto=format&fit=crop&w=800&q=80',
    content: '1. Verifique si la persona responde y respira.\n2. Llame inmediatamente al 911.\n3. Coloque la base de una mano en el centro del pecho.\n4. Comprima fuerte y rápido (100-120 veces por minuto).\n5. No se detenga hasta que llegue ayuda.' 
  },
  { 
    id: 'choking', 
    title: 'Atragantamiento', 
    icon: '🤢',
    image: 'https://images.unsplash.com/photo-1531945837087-6112b144d507?auto=format&fit=crop&w=800&q=80',
    content: '1. Párese detrás de la persona y abrácela por la cintura.\n2. Cierre una mano en puño y colóquela sobre el ombligo.\n3. Cubra el puño con la otra mano.\n4. Presione hacia adentro y hacia arriba con fuerza rápida.\n5. Repita hasta que expulse el objeto.' 
  },
  { 
    id: 'burns', 
    title: 'Quemaduras', 
    icon: '🔥',
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1b98?auto=format&fit=crop&w=800&q=80',
    content: '1. Enfríe la zona quemada con agua fría corriente (no helada) por 10-20 minutos.\n2. Cubra con un paño limpio o gasa estéril.\n3. NO aplique hielo directo, pasta dental, aceite ni remedios caseros.\n4. Si hay ampollas, no las reviente.' 
  },
  { 
    id: 'cuts', 
    title: 'Cortes y Sangrado', 
    icon: '🩸',
    image: 'https://images.unsplash.com/photo-1613310023042-ad79320c00fc?auto=format&fit=crop&w=800&q=80',
    content: '1. Lave la herida con agua limpia y jabón si es superficial.\n2. Aplique presión directa sobre la herida con una gasa o tela limpia para detener el sangrado.\n3. Eleve la parte afectada si es posible.\n4. Si no para de sangrar, acuda al médico.' 
  },
  { 
    id: 'fever', 
    title: 'Fiebre Alta', 
    icon: '🌡️',
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80',
    content: '1. Mantenga a la persona con ropa ligera.\n2. Ofrezca líquidos constantemente (agua, suero oral).\n3. Coloque paños de agua tibia (no fría) en la frente y axilas.\n4. Si la fiebre persiste por más de 2 días o es muy alta, busque ayuda médica.' 
  }
];