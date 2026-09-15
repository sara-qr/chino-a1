import ni from "./你.json";
import hao from "./好.json";
import bu from "./不.json";
import xie from "./谢.json";
import ke from "./客.json";
import qi from "./气.json";

export type WritingCharacter = {
  character: string; pinyin: string; meaning: string; components: string; note?: string;
  geometry: { strokes: string[]; medians: number[][][] };
  steps: string[];
};

export const lesson1Writing: WritingCharacter[] = [
  {
    character: "你", pinyin: "nǐ", meaning: "tú", geometry: ni,
    components: "亻 (forma de 人, persona) a la izquierda y 尔 a la derecha. Escribe primero el lado izquierdo.",
    steps: [
      "Trazo oblicuo de 亻: de arriba a la derecha hacia abajo a la izquierda (↙).",
      "Vertical de 亻: de arriba hacia abajo (↓).",
      "Trazo oblicuo superior de 尔: hacia abajo a la izquierda (↙).",
      "Horizontal con gancho: avanza a la derecha (→) y termina con un gancho hacia abajo a la izquierda, sin levantar el lápiz.",
      "Vertical con gancho: baja (↓) y termina con un pequeño gancho hacia arriba a la izquierda.",
      "Trazo corto inferior izquierdo: hacia abajo a la izquierda (↙).",
      "Punto alargado inferior derecho: hacia abajo a la derecha (↘).",
    ],
  },
  {
    character: "好", pinyin: "hǎo", meaning: "bien / bueno", geometry: hao,
    components: "女 a la izquierda y 子 a la derecha. Termina los tres trazos del lado izquierdo antes de pasar al derecho.",
    steps: [
      "Oblicuo con giro de 女: baja a la izquierda (↙), gira y continúa abajo a la derecha (↘), sin levantar el lápiz.",
      "Oblicuo largo de 女: desde arriba a la derecha, baja hacia la izquierda (↙).",
      "Trazo ascendente de 女: de izquierda a derecha, subiendo ligeramente (↗).",
      "Horizontal con giro de 子: hacia la derecha (→) y después abajo a la izquierda (↙), sin levantar el lápiz.",
      "Curva con gancho de 子: baja curvando hacia la derecha y termina con un gancho hacia arriba a la izquierda.",
      "Horizontal de 子: de izquierda a derecha (→), cruzando el trazo central.",
    ],
  },
];

export const lesson2Writing: WritingCharacter[] = [{
  character: "谢", pinyin: "xiè", meaning: "agradecer", geometry: xie,
  components: "De izquierda a derecha: 讠 (habla), 身 y 寸. Completa cada componente antes de pasar al siguiente.",
  note: "En 谢谢, la segunda sílaba se pronuncia suave: xièxie. El carácter se escribe igual las dos veces.",
  steps: [
    "Punto de 讠: baja hacia la derecha (↘).",
    "Horizontal, giro y ascenso de 讠: derecha (→), abajo (↓) y arriba a la derecha (↗), sin levantar el lápiz.",
    "Oblicuo superior de 身: abajo a la izquierda (↙).",
    "Vertical izquierda de 身: de arriba abajo (↓).",
    "Horizontal con giro y gancho de 身: derecha (→), abajo (↓) y pequeño gancho arriba a la izquierda, sin levantar el lápiz.",
    "Primera horizontal interior de 身: izquierda a derecha (→).",
    "Segunda horizontal interior de 身: izquierda a derecha (→).",
    "Base ascendente de 身: izquierda a derecha, subiendo ligeramente (↗).",
    "Oblicuo de 身: baja desde la derecha hacia la izquierda (↙).",
    "Horizontal de 寸: izquierda a derecha (→).",
    "Vertical con gancho de 寸: baja (↓) y termina con un gancho arriba a la izquierda.",
    "Punto de 寸: abajo a la derecha (↘).",
  ],
}, {
  character: "不", pinyin: "bù", meaning: "no (negación)", geometry: bu,
  components: "Observa la horizontal superior y los tres trazos que quedan debajo. Aprende este carácter como una unidad.",
  note: "Ya lo has visto en 不客气 y 不谢. Su forma de diccionario es bù; en estas expresiones, delante de un cuarto tono, se pronuncia bú.",
  steps: [
    "Horizontal superior: de izquierda a derecha (→).",
    "Oblicuo largo: desde la zona central superior hacia abajo a la izquierda (↙).",
    "Vertical central: de arriba hacia abajo (↓).",
    "Punto alargado derecho: hacia abajo a la derecha (↘).",
  ],
}, {
  character: "客", pinyin: "kè", meaning: "invitado / cliente", geometry: ke,
  components: "宀 (techo) arriba y 各 debajo. Escribe primero el techo; termina con la boca 口 de la parte inferior.",
  note: "Aquí aparece dentro de 不客气, que como expresión significa «de nada».",
  steps: [
    "Punto superior del techo: abajo a la derecha (↘).",
    "Punto izquierdo del techo: baja hacia la izquierda (↙).",
    "Horizontal con gancho del techo: derecha (→), luego gancho abajo a la izquierda, sin levantar el lápiz.",
    "Oblicuo bajo el techo: abajo a la izquierda (↙).",
    "Horizontal con giro: derecha (→), luego abajo a la izquierda (↙), sin levantar el lápiz.",
    "Trazo extendido: desde la izquierda hacia abajo a la derecha (↘).",
    "Lado izquierdo de 口: de arriba abajo (↓).",
    "Parte superior y lado derecho de 口: derecha (→) y abajo (↓), sin levantar el lápiz.",
    "Base de 口: de izquierda a derecha (→), cerrando la forma.",
  ],
}, {
  character: "气", pinyin: "qì", meaning: "aire / aliento", geometry: qi,
  components: "Dos horizontales cortas y una línea exterior larga. El último trazo incluye todos sus giros y el gancho final.",
  note: "En 不客气 la sílaba qi se pronuncia suave. La forma de diccionario del carácter es qì.",
  steps: [
    "Oblicuo superior: de arriba a la derecha hacia abajo a la izquierda (↙).",
    "Horizontal superior: de izquierda a derecha (→).",
    "Horizontal intermedia: de izquierda a derecha (→).",
    "Horizontal con giro, curva y gancho: derecha (→), baja por el lado derecho, curva hacia la derecha y acaba con un gancho hacia arriba. Todo sin levantar el lápiz.",
  ],
}];
