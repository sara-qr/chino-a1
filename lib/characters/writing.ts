import ni from "./你.json";
import hao from "./好.json";
import bu from "./不.json";

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
  character: "不", pinyin: "bù", meaning: "no (negación)", geometry: bu,
  components: "Observa la horizontal superior y los tres trazos que quedan debajo. Aprende este carácter como una unidad.",
  note: "Ya lo has visto en 不客气 y 不谢. Su forma de diccionario es bù; en estas expresiones, delante de un cuarto tono, se pronuncia bú.",
  steps: [
    "Horizontal superior: de izquierda a derecha (→).",
    "Oblicuo largo: desde la zona central superior hacia abajo a la izquierda (↙).",
    "Vertical central: de arriba hacia abajo (↓).",
    "Punto alargado derecho: hacia abajo a la derecha (↘).",
  ],
}];
