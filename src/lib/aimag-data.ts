export interface Attraction {
  name: string;
  description: string;
  photoUrl: string;
}

export interface AimagInfo {
  name: string;
  description: string;
  highlights: string[];
  image: string;
  photoUrl: string;
  population: string;
  area: string;
  attractions: Attraction[];
}

export const AIMAG_DATA: AimagInfo[] = [
  {
    name: "Улаанбаатар",
    description: "Монголын нийслэл хот. Орчин үеийн амьдрал, соёл урлаг, бизнесийн төв.",
    highlights: ["Чингис хааны талбай", "Гандантэгчинлэн хийд", "Зайсан толгой", "Богд хааны ордон"],
    image: "🏙️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Ulaanbaatar_CBD_in_2019.jpg/1280px-Ulaanbaatar_CBD_in_2019.jpg",
    population: "1,500,000+",
    area: "4,704 км²",
    attractions: [
      {
        name: "Гандантэгчинлэн хийд",
        description: "Монголын хамгийн том будда шашны сүм хийд. 26.5 метрийн Мэгжид Жанрайсиг бурханы хөшөөтэй.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/ثثف.jpg/1280px-ثثف.jpg",
      },
      {
        name: "Зайсан толгой",
        description: "Улаанбаатар хотын сайхан харагддаг дурсгалт газар. Хоёрдугаар дайны дурсгалт хөшөө.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Zaisan_Memorial_Mural_%2814%29.jpg/1280px-Zaisan_Memorial_Mural_%2814%29.jpg",
      },
      {
        name: "Богд хааны ордны музей",
        description: "Монголын сүүлчийн хаан Богд хааны өвлийн ордон. 1893-1903 онд баригдсан.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Bogd_Khan%27s_Winter_Palace_02.jpg/1280px-Bogd_Khan%27s_Winter_Palace_02.jpg",
      },
      {
        name: "Чингис хааны талбай",
        description: "Улаанбаатар хотын төв талбай. Засгийн газрын ордон, Чингис хааны хөшөөтэй.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Mongolian_Government_Palace.jpg/1280px-Mongolian_Government_Palace.jpg",
      },
    ],
  },
  {
    name: "Архангай",
    description: "Ногоон тал, нуур, гол мөрөн бүхий байгалийн үзэсгэлэнт газар.",
    highlights: ["Тэрхийн цагаан нуур", "Хорго уул", "Өгий нуур", "Цэнхэр халуун рашаан"],
    image: "🏔️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Terkhiin_Tsagaan_Nuur.jpg/1280px-Terkhiin_Tsagaan_Nuur.jpg",
    population: "84,000+",
    area: "55,300 км²",
    attractions: [
      {
        name: "Тэрхийн цагаан нуур",
        description: "Хорго галт уулын лавын урсгалаас үүссэн цэнгэг усны нуур. Далайн түвшнээс 2060м өндөрт оршдог.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Terkhiin_Tsagaan_Nuur.jpg/1280px-Terkhiin_Tsagaan_Nuur.jpg",
      },
      {
        name: "Хорго уул",
        description: "Унтарсан галт уул. Оройн хэсэгт 200м диаметртэй кратертай. Тэрхийн цагаан нуурын ойролцоо.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Khorgo_Crater.jpg/1280px-Khorgo_Crater.jpg",
      },
      {
        name: "Өгий нуур",
        description: "Архангай аймгийн зүүн хэсэгт оршдог цэнгэг усны нуур. Загасчлал, шувуу ажиглалтаар алдартай.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Ugii_lake%2CMongolia.jpg/1280px-Ugii_lake%2CMongolia.jpg",
      },
      {
        name: "Цэнхэр халуун рашаан",
        description: "Байгалийн халуун рашаан. 86.5°C хүртэл халдаг. Эмчилгээний чанартай.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Tsenkher_hot_spring_%283%29.JPG/1280px-Tsenkher_hot_spring_%283%29.JPG",
      },
    ],
  },
  {
    name: "Баян-Өлгий",
    description: "Казах соёл, бүргэдийн ан, нуурс бүхий баруун Монголын аймаг.",
    highlights: ["Бүргэдийн баяр", "Алтай таван богд", "Хотон нуур", "Казах соёл"],
    image: "🦅",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Kazakh_berkutchi.jpg/1280px-Kazakh_berkutchi.jpg",
    population: "100,000+",
    area: "45,700 км²",
    attractions: [
      {
        name: "Алтай таван богд уул",
        description: "Монголын хамгийн өндөр оргил Хүйтэн оргил (4374м) энд оршдог. Мөнх цастай уулс.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Altai_Tavan_Bogd_National_Park.jpg/1280px-Altai_Tavan_Bogd_National_Park.jpg",
      },
      {
        name: "Бүргэдийн баяр",
        description: "Казах бүргэдчдийн уламжлалт баяр. Жил бүрийн 10-р сарын эхээр зохиогддог.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Kazakh_berkutchi.jpg/1280px-Kazakh_berkutchi.jpg",
      },
      {
        name: "Хотон нуур",
        description: "Алтай таван богдын бүсэд оршдог уулын нуур. Тунгалаг цэнгэг ус.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Khoton_Nuur_Bayan-Ölgii.jpg/1280px-Khoton_Nuur_Bayan-Ölgii.jpg",
      },
    ],
  },
  {
    name: "Баянхонгор",
    description: "Говь, уул, нуур зэрэг олон янзын байгалийн бүсүүдтэй аймаг.",
    highlights: ["Орог нуур", "Бөөн цагаан нуур", "Шаргалжуут халуун рашаан", "Их богд уул"],
    image: "🏜️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Orog_Nuur.jpg/1280px-Orog_Nuur.jpg",
    population: "78,000+",
    area: "116,000 км²",
    attractions: [
      {
        name: "Орог нуур",
        description: "Баянхонгор аймагт байрлах давстай нуур. Шувуудын нүүдлийн чухал буудал.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Orog_Nuur.jpg/1280px-Orog_Nuur.jpg",
      },
      {
        name: "Шаргалжуут халуун рашаан",
        description: "300 гаруй жилийн түүхтэй халуун рашаан. Олон төрлийн өвчинд эмчилгээний чанартай.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Tsenkher_hot_spring_%283%29.JPG/1280px-Tsenkher_hot_spring_%283%29.JPG",
      },
      {
        name: "Их богд уул",
        description: "Говь-Алтайн нурууны зүүн хэсэгт оршдог. 3957м өндөр.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Ikh_Bogd.jpg/1280px-Ikh_Bogd.jpg",
      },
    ],
  },
  {
    name: "Булган",
    description: "Ой, мод, голуудаар баялаг хойд Монголын аймаг.",
    highlights: ["Хөгнө хан уул", "Дашчойлон хийд", "Уран тогоо", "Сэлэнгэ мөрөн"],
    image: "🌲",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Uran-Togoo_mountain%2C_Mongolia_01.jpg/1280px-Uran-Togoo_mountain%2C_Mongolia_01.jpg",
    population: "56,000+",
    area: "48,700 км²",
    attractions: [
      {
        name: "Уран тогоо",
        description: "Унтарсан галт уулын кратер. Тусгай хамгаалалттай газар нутгийн хэсэг.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Uran-Togoo_mountain%2C_Mongolia_01.jpg/1280px-Uran-Togoo_mountain%2C_Mongolia_01.jpg",
      },
      {
        name: "Хөгнө хан уул",
        description: "Элсэн манханы дунд оршдог ой модтой уул. Байгалийн цогцолборт газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Khogno_Khan.JPG/1280px-Khogno_Khan.JPG",
      },
    ],
  },
  {
    name: "Говь-Алтай",
    description: "Алтай нурууны баруун хэсгийн говь, уулт аймаг.",
    highlights: ["Их богд уул", "Хасагт хайрхан", "Тахийн тал", "Говийн байгалийн цогцолбор"],
    image: "⛰️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Govi-Altai.jpg/1280px-Govi-Altai.jpg",
    population: "53,000+",
    area: "141,400 км²",
    attractions: [
      {
        name: "Их богд уул",
        description: "Говь-Алтайн нурууны хамгийн өндөр цэг. 3957м. Мөнх цастай оргилуудтай.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Ikh_Bogd.jpg/1280px-Ikh_Bogd.jpg",
      },
      {
        name: "Тахь (Пржевальскийн адуу)",
        description: "Монголд сэргээн нутагшуулсан зэрлэг адуу. Дэлхийн хамгийн ховор зүйл.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Przewalski%27s_horse_02.jpg/1280px-Przewalski%27s_horse_02.jpg",
      },
    ],
  },
  {
    name: "Говьсүмбэр",
    description: "Монголын хамгийн жижиг аймаг, төмөр замын зангилаа.",
    highlights: ["Сүм хөх бурд", "Шивээ-Овоо", "Төмөр замын зангилаа"],
    image: "🚂",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Choir_Mongolia.jpg/1280px-Choir_Mongolia.jpg",
    population: "17,000+",
    area: "5,500 км²",
    attractions: [
      {
        name: "Сүм хөх бурд",
        description: "Хадан дээрх эртний сүмийн балгас. Говьсүмбэр аймгийн түүхийн дурсгалт газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Choir_Mongolia.jpg/1280px-Choir_Mongolia.jpg",
      },
    ],
  },
  {
    name: "Дархан-Уул",
    description: "Монголын хоёр дахь том хот, үйлдвэрлэлийн төв.",
    highlights: ["Хар бухын балгас", "Дарханы музей", "Шарын гол"],
    image: "🏭",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Darkhan_city_center.jpg/1280px-Darkhan_city_center.jpg",
    population: "100,000+",
    area: "3,300 км²",
    attractions: [
      {
        name: "Хар бухын балгас",
        description: "Хятан улсын үеийн хотын балгас. Түүхийн чухал дурсгалт газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Darkhan_city_center.jpg/1280px-Darkhan_city_center.jpg",
      },
    ],
  },
  {
    name: "Дорноговь",
    description: "Говийн элс, динозаврын олдвор бүхий аймаг.",
    highlights: ["Сайншанд", "Хамрын хийд", "Данзанравжаа музей", "Шамбалын ордон"],
    image: "🦕",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Khamar_monastery.JPG/1280px-Khamar_monastery.JPG",
    population: "68,000+",
    area: "109,500 км²",
    attractions: [
      {
        name: "Хамрын хийд",
        description: "Данзанравжаагийн байгуулсан сүм хийд. Сайншанд хотоос баруун хойш 50км зайтай.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Khamar_monastery.JPG/1280px-Khamar_monastery.JPG",
      },
      {
        name: "Данзанравжаа музей",
        description: "V Говийн ноён хутагт Данзанравжаагийн дурсгалт зүйлсийг хадгалсан музей.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Khamar_monastery.JPG/1280px-Khamar_monastery.JPG",
      },
    ],
  },
  {
    name: "Дорнод",
    description: "Их тал нутаг, зэрлэг амьтдаар баялаг зүүн Монголын аймаг.",
    highlights: ["Нүмрэг тэнгис", "Буйр нуур", "Халхын гол", "Монгол дагуурын тал"],
    image: "🦌",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Buir_Lake_Landscape.jpg/1280px-Buir_Lake_Landscape.jpg",
    population: "71,000+",
    area: "123,600 км²",
    attractions: [
      {
        name: "Буйр нуур",
        description: "Монгол, Хятадын хил дээрх цэнгэг усны нуур. 615 км² талбайтай.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Buir_Lake_Landscape.jpg/1280px-Buir_Lake_Landscape.jpg",
      },
      {
        name: "Халхын голын дурсгал",
        description: "1939 оны Халхын голын байлдааны түүхэн газар. Дурсгалт музей байдаг.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Battles_of_Khalkhin_Gol-Mongolian_cavalry.jpg/1280px-Battles_of_Khalkhin_Gol-Mongolian_cavalry.jpg",
      },
      {
        name: "Монгол дагуурын тал",
        description: "ЮНЕСКО-гийн биосферийн нөөц газар. Цагаан зээр, тарвага зэрэг амьтад амьдардаг.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Mongolian_Gazelle_%28Procapra_gutturosa%29.jpg/1280px-Mongolian_Gazelle_%28Procapra_gutturosa%29.jpg",
      },
    ],
  },
  {
    name: "Дундговь",
    description: "Говийн дунд хэсгийн байгалийн гайхамшигтай аймаг.",
    highlights: ["Бага газрын чулуу", "Ихгазрын чулуу", "Цагаан суварга", "Өлзийт"],
    image: "🪨",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Tsagaan_Suvarga_white_stupa_2.JPG/1280px-Tsagaan_Suvarga_white_stupa_2.JPG",
    population: "38,000+",
    area: "74,700 км²",
    attractions: [
      {
        name: "Цагаан суварга",
        description: "30м өндөр шохойн чулуун хаднууд. Эртний далайн ёроолын хурдас.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Tsagaan_Suvarga_white_stupa_2.JPG/1280px-Tsagaan_Suvarga_white_stupa_2.JPG",
      },
      {
        name: "Бага газрын чулуу",
        description: "Гранитан хадан хөндий. Агуй, булаг шанд бүхий байгалийн үзэсгэлэнт газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Baga_Gazriin_Chuluu_01.jpg/1280px-Baga_Gazriin_Chuluu_01.jpg",
      },
    ],
  },
  {
    name: "Завхан",
    description: "Уул, мөстлөг, гол мөрөн бүхий баруун хойд аймаг.",
    highlights: ["Отгонтэнгэр уул", "Тэлмэн нуур", "Завхан гол", "Идэр гол"],
    image: "🏔️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Otgontenger_Mountain.jpg/1280px-Otgontenger_Mountain.jpg",
    population: "66,000+",
    area: "82,500 км²",
    attractions: [
      {
        name: "Отгонтэнгэр уул",
        description: "Хангайн нурууны хамгийн өндөр оргил (4021м). Мөнх цастай, тахилгат уул.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Otgontenger_Mountain.jpg/1280px-Otgontenger_Mountain.jpg",
      },
      {
        name: "Тэлмэн нуур",
        description: "Завхан аймгийн хойд хэсэгт оршдог нуур. Загасчлалаар алдартай.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Telmen_lake.jpg/1280px-Telmen_lake.jpg",
      },
    ],
  },
  {
    name: "Орхон",
    description: "Эрдэнэт хот, уул уурхайн төв.",
    highlights: ["Эрдэнэт уурхай", "Хүннүгийн балгас", "Сэлэнгэ мөрөн"],
    image: "⛏️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Erdenet_Mining_Corporation.jpg/1280px-Erdenet_Mining_Corporation.jpg",
    population: "104,000+",
    area: "840 км²",
    attractions: [
      {
        name: "Эрдэнэт уурхай",
        description: "Дэлхийн 4 дэх том зэсийн уурхай. Монголын эдийн засгийн чухал салбар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Erdenet_Mining_Corporation.jpg/1280px-Erdenet_Mining_Corporation.jpg",
      },
    ],
  },
  {
    name: "Өвөрхангай",
    description: "Монголын түүх, соёлын өлгий нутаг.",
    highlights: ["Хархорин", "Эрдэнэ зуу хийд", "Орхон гол", "Хүйсийн найман нуур"],
    image: "🏛️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Erdene_Zuu.jpg/1280px-Erdene_Zuu.jpg",
    population: "101,000+",
    area: "63,500 км²",
    attractions: [
      {
        name: "Эрдэнэ зуу хийд",
        description: "1585 онд байгуулагдсан Монголын анхны будда шашны сүм хийд. ЮНЕСКО-д бүртгэлтэй.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Erdene_Zuu.jpg/1280px-Erdene_Zuu.jpg",
      },
      {
        name: "Орхоны хүрхрээ",
        description: "Орхон голын 20м өндөр хүрхрээ. Улирлын чанартай (зуны сард).",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Orkhon_Waterfall_2.jpg/1280px-Orkhon_Waterfall_2.jpg",
      },
      {
        name: "Хархорин (Каракорум)",
        description: "XIII зууны Их Монгол гүрний нийслэл. Түүхийн чухал дурсгалт газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Karakorum-RuineTempel.jpg/1280px-Karakorum-RuineTempel.jpg",
      },
    ],
  },
  {
    name: "Өмнөговь",
    description: "Говь нутгийн хамгийн алдартай аялал жуулчлалын аймаг.",
    highlights: ["Хонгорын элс", "Баянзаг", "Ёлын ам", "Хэрмэн цав"],
    image: "🐪",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Khongoryn_Els_04.jpg/1280px-Khongoryn_Els_04.jpg",
    population: "60,000+",
    area: "165,400 км²",
    attractions: [
      {
        name: "Хонгорын элс",
        description: "Монголын хамгийн том элсэн манхан. 180км урт, 27км өргөн, 800м хүртэл өндөр. 'Дуулдаг элс' гэж нэрлэгддэг.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Khongoryn_Els_04.jpg/1280px-Khongoryn_Els_04.jpg",
      },
      {
        name: "Баянзаг (Шатсан хад)",
        description: "1922 онд Рой Чэпмэн Эндрюс динозаврын өндөг анх олсон газар. Улаан шохойн чулуун хад.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Bayanzag_cliffs.JPG/1280px-Bayanzag_cliffs.JPG",
      },
      {
        name: "Ёлын ам",
        description: "Зуны дунд үед ч мөстэй байдаг гүн хавцал. Гурван сайханы байгалийн цогцолборт газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Yolyn_Am_valley.jpg/1280px-Yolyn_Am_valley.jpg",
      },
      {
        name: "Хэрмэн цав",
        description: "Монголын Гранд Каньон гэж нэрлэгддэг 200м гүн хавцал. Өмнөговийн нууц газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Khongoryn_Els_10.jpg/1280px-Khongoryn_Els_10.jpg",
      },
    ],
  },
  {
    name: "Сүхбаатар",
    description: "Зүүн бүсийн тал нутгийн аймаг.",
    highlights: ["Дарамын уул", "Шилийн богд", "Халхгол сум"],
    image: "🐎",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Mongolian_Horse_in_Steppe.jpg/1280px-Mongolian_Horse_in_Steppe.jpg",
    population: "55,000+",
    area: "82,300 км²",
    attractions: [
      {
        name: "Шилийн богд уул",
        description: "Сүхбаатар аймгийн тахилгат уул. 1778м өндөр.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Mongolian_Horse_in_Steppe.jpg/1280px-Mongolian_Horse_in_Steppe.jpg",
      },
      {
        name: "Монгол тал нутаг",
        description: "Дэлхийн хамгийн том бүрэн бүтэн тал нутгийн экосистем. Цагаан зээрийн нүүдэл.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Mongolian_Gazelle_%28Procapra_gutturosa%29.jpg/1280px-Mongolian_Gazelle_%28Procapra_gutturosa%29.jpg",
      },
    ],
  },
  {
    name: "Сэлэнгэ",
    description: "Хөдөө аж ахуйн төв, үр тариалангийн буйдар нутаг.",
    highlights: ["Амарбаясгалант хийд", "Сэлэнгэ мөрөн", "Дүүрэг нуур"],
    image: "🌾",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Amarbayasgalant_Monastery_2.jpg/1280px-Amarbayasgalant_Monastery_2.jpg",
    population: "106,000+",
    area: "41,200 км²",
    attractions: [
      {
        name: "Амарбаясгалант хийд",
        description: "1727-1736 онд баригдсан. Монголын хамгийн том, бүрэн бүтэн хадгалагдсан хийдүүдийн нэг.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Amarbayasgalant_Monastery_2.jpg/1280px-Amarbayasgalant_Monastery_2.jpg",
      },
      {
        name: "Сэлэнгэ мөрөн",
        description: "Монголын хамгийн урт гол (593км). Байгаль нуурт цутгадаг.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Amarbayasgalant_Monastery_2.jpg/1280px-Amarbayasgalant_Monastery_2.jpg",
      },
    ],
  },
  {
    name: "Төв",
    description: "Нийслэлийг тойрсон төв аймаг, түүхийн дурсгалт газрууд.",
    highlights: ["Тэрэлж", "Чингис хааны хөшөө", "Мөнгөнморьт", "Горхи-Тэрэлж"],
    image: "🗿",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Turtle_Rock_in_Terelj.jpg/1280px-Turtle_Rock_in_Terelj.jpg",
    population: "92,000+",
    area: "74,000 км²",
    attractions: [
      {
        name: "Горхи-Тэрэлж",
        description: "Улаанбаатараас 70км зайтай байгалийн цогцолборт газар. Мэлхий хад, Арьяабалын сүм.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Turtle_Rock_in_Terelj.jpg/1280px-Turtle_Rock_in_Terelj.jpg",
      },
      {
        name: "Чингис хааны хөшөө цогцолбор",
        description: "Дэлхийн хамгийн том морьтой хөшөө (40м). Тэрэлжийн замд оршдог.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Chinggis_Khan_Statue_at_Tsonjin_Boldog.jpg/1280px-Chinggis_Khan_Statue_at_Tsonjin_Boldog.jpg",
      },
      {
        name: "Мэлхий хад",
        description: "Мэлхий хэлбэртэй алдартай хадан бүрдэл. Тэрэлж дүүрэгт оршдог.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Turtle_Rock_in_Terelj.jpg/1280px-Turtle_Rock_in_Terelj.jpg",
      },
    ],
  },
  {
    name: "Увс",
    description: "ЮНЕСКО-гийн дэлхийн өвд бүртгэлтэй Увс нуурын аймаг.",
    highlights: ["Увс нуур", "Тэс гол", "Алтан хөх уул", "ЮНЕСКО өв"],
    image: "🌊",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Uvs_Nuur_Basin.jpg/1280px-Uvs_Nuur_Basin.jpg",
    population: "73,000+",
    area: "69,600 км²",
    attractions: [
      {
        name: "Увс нуур",
        description: "Монголын хамгийн том нуур (3350 км²). ЮНЕСКО-гийн дэлхийн өвд бүртгэлтэй.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Uvs_Nuur_Basin.jpg/1280px-Uvs_Nuur_Basin.jpg",
      },
      {
        name: "Үүрэг нуур",
        description: "Уулсаар хүрээлэгдсэн цэнхэр усны нуур. Фотозургийн алдартай газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Uvs_Nuur_Basin.jpg/1280px-Uvs_Nuur_Basin.jpg",
      },
    ],
  },
  {
    name: "Ховд",
    description: "Олон үндэстэн, байгалийн олон янз бүрдлийн аймаг.",
    highlights: ["Хар ус нуур", "Мөнххайрхан уул", "Цамбагарав уул"],
    image: "🏔️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Khar_Us_Nuur.jpg/1280px-Khar_Us_Nuur.jpg",
    population: "76,000+",
    area: "76,100 км²",
    attractions: [
      {
        name: "Хар ус нуур",
        description: "Монголын хоёр дахь том нуур (1578 км²). Шувуудын нүүдлийн чухал буудал.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Khar_Us_Nuur.jpg/1280px-Khar_Us_Nuur.jpg",
      },
      {
        name: "Цамбагарав уул",
        description: "4208м өндөр мөнх цастай уул. Байгалийн цогцолборт газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Khar_Us_Nuur.jpg/1280px-Khar_Us_Nuur.jpg",
      },
    ],
  },
  {
    name: "Хөвсгөл",
    description: "Монголын далай гэгддэг Хөвсгөл нууртай аймаг.",
    highlights: ["Хөвсгөл нуур", "Цаатан ардууд", "Мурэн хот", "Дэлгэрмөрөн гол"],
    image: "💎",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Khuvsgul.jpg/1280px-Khuvsgul.jpg",
    population: "120,000+",
    area: "100,600 км²",
    attractions: [
      {
        name: "Хөвсгөл нуур",
        description: "Монголын хамгийн гүн нуур (262м). Дэлхийн цэнгэг усны нөөцийн 0.4%. 'Монголын далай'.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Khuvsgul.jpg/1280px-Khuvsgul.jpg",
      },
      {
        name: "Цаатан ардууд",
        description: "Цаа бугаар амьдралаа залгуулдаг цөөн тооны бүлэг. Дэлхийн хамгийн ховор соёл.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Mongolian_arats_at_the_lake.jpg/1280px-Mongolian_arats_at_the_lake.jpg",
      },
      {
        name: "Хөвсгөл нуурын өвлийн дүр зураг",
        description: "Өвлийн улиралд нуур бүрэн мөсөрдөг. Мөсөн баяр зохиогддог.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Hovsgol.jpg/1280px-Hovsgol.jpg",
      },
    ],
  },
  {
    name: "Хэнтий",
    description: "Чингис хааны төрсөн нутаг, түүхт газар.",
    highlights: ["Бурхан халдун", "Онон гол", "Хэрлэн гол", "Балдан Бэрээвэн хийд"],
    image: "⚔️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Burkhan_Khaldun_Strictly_Protected_Area.jpg/1280px-Burkhan_Khaldun_Strictly_Protected_Area.jpg",
    population: "68,000+",
    area: "80,300 км²",
    attractions: [
      {
        name: "Бурхан халдун уул",
        description: "Чингис хааны төрсөн нутаг. ЮНЕСКО-гийн дэлхийн өвд бүртгэлтэй тахилгат уул.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Burkhan_Khaldun_Strictly_Protected_Area.jpg/1280px-Burkhan_Khaldun_Strictly_Protected_Area.jpg",
      },
      {
        name: "Балдан Бэрээвэн хийд",
        description: "1700 онд байгуулагдсан. Хэнтий аймгийн хамгийн том сүм хийд.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Burkhan_Khaldun_Strictly_Protected_Area.jpg/1280px-Burkhan_Khaldun_Strictly_Protected_Area.jpg",
      },
      {
        name: "Онон гол",
        description: "Чингис хааны төрсөн газрын ойролцоох гол. Амур мөрний эх.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Burkhan_Khaldun_Strictly_Protected_Area.jpg/1280px-Burkhan_Khaldun_Strictly_Protected_Area.jpg",
      },
    ],
  },
];
