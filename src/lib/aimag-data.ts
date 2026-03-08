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
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ulaanbaatar_2020.jpg/1280px-Ulaanbaatar_2020.jpg",
    population: "1,500,000+",
    area: "4,704 км²",
    attractions: [
      {
        name: "Гандантэгчинлэн хийд",
        description: "Монголын хамгийн том будда шашны сүм хийд. 26.5 метрийн Мэгжид Жанрайсиг бурханы хөшөөтэй.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Gandan_Monastery%2C_Ulaanbaatar.jpg/1280px-Gandan_Monastery%2C_Ulaanbaatar.jpg",
      },
      {
        name: "Зайсан толгой",
        description: "Улаанбаатар хотын сайхан харагддаг дурсгалт газар. Хоёрдугаар дайны дурсгалт хөшөө.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Zaisan_Memorial_%2810%29.jpg/1280px-Zaisan_Memorial_%2810%29.jpg",
      },
      {
        name: "Богд хааны ордны музей",
        description: "Монголын сүүлчийн хаан Богд хааны өвлийн ордон. 1893-1903 онд баригдсан.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Bogd_Khan_Palace_01.jpg/1280px-Bogd_Khan_Palace_01.jpg",
      },
      {
        name: "Чингис хааны талбай",
        description: "Улаанбаатар хотын төв талбай. Засгийн газрын ордон, Чингис хааны хөшөөтэй.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Government_Palace_Ulaanbaatar_2.jpg/1280px-Government_Palace_Ulaanbaatar_2.jpg",
      },
    ],
  },
  {
    name: "Архангай",
    description: "Ногоон тал, нуур, гол мөрөн бүхий байгалийн үзэсгэлэнт газар.",
    highlights: ["Тэрхийн цагаан нуур", "Хорго уул", "Өгий нуур", "Цэнхэр халуун рашаан"],
    image: "🏔️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Terkhiin_Tsagaan_Lake.jpg/1280px-Terkhiin_Tsagaan_Lake.jpg",
    population: "84,000+",
    area: "55,300 км²",
    attractions: [
      {
        name: "Тэрхийн цагаан нуур",
        description: "Хорго галт уулын лавын урсгалаас үүссэн цэнгэг усны нуур. Далайн түвшнээс 2060м өндөрт оршдог.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Terkhiin_Tsagaan_Lake.jpg/1280px-Terkhiin_Tsagaan_Lake.jpg",
      },
      {
        name: "Хорго уул",
        description: "Унтарсан галт уул. Оройн хэсэгт 200м диаметртэй кратертай. Тэрхийн цагаан нуурын ойролцоо.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Khorgo_volcano.jpg/1280px-Khorgo_volcano.jpg",
      },
      {
        name: "Өгий нуур",
        description: "Архангай аймгийн зүүн хэсэгт оршдог цэнгэг усны нуур. Загасчлал, шувуу ажиглалтаар алдартай.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/%C3%96gii_Lake.jpg/1280px-%C3%96gii_Lake.jpg",
      },
      {
        name: "Цэнхэр халуун рашаан",
        description: "Байгалийн халуун рашаан. 86.5°C хүртэл халдаг. Эмчилгээний чанартай.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tsenkher_Hot_Spring.jpg/1280px-Tsenkher_Hot_Spring.jpg",
      },
    ],
  },
  {
    name: "Баян-Өлгий",
    description: "Казах соёл, бүргэдийн ан, нуурс бүхий баруун Монголын аймаг.",
    highlights: ["Бүргэдийн баяр", "Алтай таван богд", "Хотон нуур", "Казах соёл"],
    image: "🦅",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Eagle_hunter_Mongolia.jpg/1280px-Eagle_hunter_Mongolia.jpg",
    population: "100,000+",
    area: "45,700 км²",
    attractions: [
      {
        name: "Алтай таван богд уул",
        description: "Монголын хамгийн өндөр оргил Хүйтэн оргил (4374м) энд оршдог. Мөнх цастай уулс.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Altai_Tavan_Bogd.jpg/1280px-Altai_Tavan_Bogd.jpg",
      },
      {
        name: "Бүргэдийн баяр",
        description: "Казах бүргэдчдийн уламжлалт баяр. Жил бүрийн 10-р сарын эхээр зохиогддог.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Kazakh_Eagle_Hunter.jpg/1280px-Kazakh_Eagle_Hunter.jpg",
      },
      {
        name: "Хотон нуур",
        description: "Алтай тавын богдын бүсэд оршдог уулын нуур. Тунгалаг цэнгэг ус.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Khoton_Lake_Mongolia.jpg/1280px-Khoton_Lake_Mongolia.jpg",
      },
    ],
  },
  {
    name: "Баянхонгор",
    description: "Говь, уул, нуур зэрэг олон янзын байгалийн бүсүүдтэй аймаг.",
    highlights: ["Орог нуур", "Бөөн цагаан нуур", "Шаргалжуут халуун рашаан", "Их богд уул"],
    image: "🏜️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Orog_Lake_Mongolia.jpg/1280px-Orog_Lake_Mongolia.jpg",
    population: "78,000+",
    area: "116,000 км²",
    attractions: [
      {
        name: "Орог нуур",
        description: "Баянхонгор аймагт байрлах давстай нуур. Шувуудын нүүдлийн чухал буудал.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Orog_Lake_Mongolia.jpg/1280px-Orog_Lake_Mongolia.jpg",
      },
      {
        name: "Шаргалжуут халуун рашаан",
        description: "300 гаруй жилийн түүхтэй халуун рашаан. Олон төрлийн өвчинд эмчилгээний чанартай.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Shargaljuut.jpg/1280px-Shargaljuut.jpg",
      },
      {
        name: "Их богд уул",
        description: "Говь-Алтайн нурууны зүүн хэсэгт оршдог. 3957м өндөр.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Ikh_Bogd_Mountain.jpg/1280px-Ikh_Bogd_Mountain.jpg",
      },
    ],
  },
  {
    name: "Булган",
    description: "Ой, мод, голуудаар баялаг хойд Монголын аймаг.",
    highlights: ["Хөгнө хан уул", "Дашчойлон хийд", "Уран тогоо", "Сэлэнгэ мөрөн"],
    image: "🌲",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Uran-Togoo_Tulga_Uul.jpg/1280px-Uran-Togoo_Tulga_Uul.jpg",
    population: "56,000+",
    area: "48,700 км²",
    attractions: [
      {
        name: "Уран тогоо",
        description: "Унтарсан галт уулын кратер. Тусгай хамгаалалттай газар нутгийн хэсэг.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Uran-Togoo_Tulga_Uul.jpg/1280px-Uran-Togoo_Tulga_Uul.jpg",
      },
      {
        name: "Хөгнө хан уул",
        description: "Элсэн манханы дунд оршдог ой модтой уул. Байгалийн цогцолборт газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Khogno_Khan.jpg/1280px-Khogno_Khan.jpg",
      },
    ],
  },
  {
    name: "Говь-Алтай",
    description: "Алтай нурууны баруун хэсгийн говь, уулт аймаг.",
    highlights: ["Их богд уул", "Хасагт хайрхан", "Тахийн тал", "Говийн байгалийн цогцолбор"],
    image: "⛰️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Gobi_Altai_landscape.jpg/1280px-Gobi_Altai_landscape.jpg",
    population: "53,000+",
    area: "141,400 км²",
    attractions: [
      {
        name: "Их богд уул",
        description: "Говь-Алтайн нурууны хамгийн өндөр цэг. 3957м. Мөнх цастай оргилуудтай.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Ikh_Bogd_Mountain.jpg/1280px-Ikh_Bogd_Mountain.jpg",
      },
      {
        name: "Хасагт хайрхан уул",
        description: "ЮНЕСКО-д бүртгэлтэй тахилгат уул. 2680м өндөр.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Khasagt_Khairkhan.jpg/1280px-Khasagt_Khairkhan.jpg",
      },
      {
        name: "Тахийн тал",
        description: "Тахь адуу амьдардаг бүс нутаг. Байгалийн хамгаалалтын бүс.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Przewalski%27s_Horse_in_Mongolia.jpg/1280px-Przewalski%27s_Horse_in_Mongolia.jpg",
      },
    ],
  },
  {
    name: "Говьсүмбэр",
    description: "Монголын хамгийн жижиг аймаг, төмөр замын зангилаа.",
    highlights: ["Сүм хөх бурд", "Шивээ-Овоо", "Төмөр замын зангилаа"],
    image: "🚂",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Govisumber_landscape.jpg/1280px-Govisumber_landscape.jpg",
    population: "17,000+",
    area: "5,500 км²",
    attractions: [
      {
        name: "Сүм хөх бурд",
        description: "Хадан дээрх эртний сүмийн балгас. Говьсүмбэр аймгийн түүхийн дурсгалт газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Sum_Khokh_Burd.jpg/1280px-Sum_Khokh_Burd.jpg",
      },
    ],
  },
  {
    name: "Дархан-Уул",
    description: "Монголын хоёр дахь том хот, үйлдвэрлэлийн төв.",
    highlights: ["Хар бухын балгас", "Дарханы музей", "Шарын гол"],
    image: "🏭",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Darkhan_city.jpg/1280px-Darkhan_city.jpg",
    population: "100,000+",
    area: "3,300 км²",
    attractions: [
      {
        name: "Хар бухын балгас",
        description: "Хятан улсын үеийн хотын балгас. Түүхийн чухал дурсгалт газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Khar_Bukh_Balgas.jpg/1280px-Khar_Bukh_Balgas.jpg",
      },
    ],
  },
  {
    name: "Дорноговь",
    description: "Говийн элс, динозаврын олдвор бүхий аймаг.",
    highlights: ["Сайншанд", "Хамрын хийд", "Данзанравжаа музей", "Шамбалын ордон"],
    image: "🦕",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Khamariin_Khiid_Monastery.jpg/1280px-Khamariin_Khiid_Monastery.jpg",
    population: "68,000+",
    area: "109,500 км²",
    attractions: [
      {
        name: "Хамрын хийд",
        description: "Данзанравжаагийн байгуулсан сүм хийд. Сайншанд хотоос баруун хойш 50км зайтай.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Khamariin_Khiid_Monastery.jpg/1280px-Khamariin_Khiid_Monastery.jpg",
      },
      {
        name: "Данзанравжаа музей",
        description: "V Говийн ноён хутагт Данзанравжаагийн дурсгалт зүйлсийг хадгалсан музей.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Danzan_Ravjaa_Museum.jpg/1280px-Danzan_Ravjaa_Museum.jpg",
      },
      {
        name: "Шамбалын ордон",
        description: "Данзанравжаагийн бүтээсэн энерги төвүүд. Бясалгалын газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Shambala_Land.jpg/1280px-Shambala_Land.jpg",
      },
    ],
  },
  {
    name: "Дорнод",
    description: "Их тал нутаг, зэрлэг амьтдаар баялаг зүүн Монголын аймаг.",
    highlights: ["Нүмрэг тэнгис", "Буйр нуур", "Халхын гол", "Монгол дагуурын тал"],
    image: "🦌",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Buir_Lake.jpg/1280px-Buir_Lake.jpg",
    population: "71,000+",
    area: "123,600 км²",
    attractions: [
      {
        name: "Буйр нуур",
        description: "Монгол, Хятадын хил дээрх цэнгэг усны нуур. 615 км² талбайтай.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Buir_Lake.jpg/1280px-Buir_Lake.jpg",
      },
      {
        name: "Халхын гол",
        description: "1939 оны Халхын голын байлдааны түүхэн газар. Дурсгалт музей байдаг.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Khalkhin_Gol_Monument.jpg/1280px-Khalkhin_Gol_Monument.jpg",
      },
      {
        name: "Монгол дагуурын тал",
        description: "ЮНЕСКО-гийн биосферийн нөөц газар. Цагаан зээр, тарвага зэрэг амьтад амьдардаг.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Mongolian_Gazelle.jpg/1280px-Mongolian_Gazelle.jpg",
      },
    ],
  },
  {
    name: "Дундговь",
    description: "Говийн дунд хэсгийн байгалийн гайхамшигтай аймаг.",
    highlights: ["Бага газрын чулуу", "Ихгазрын чулуу", "Цагаан суварга", "Өлзийт"],
    image: "🪨",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Tsagaan_Suvarga.jpg/1280px-Tsagaan_Suvarga.jpg",
    population: "38,000+",
    area: "74,700 км²",
    attractions: [
      {
        name: "Цагаан суварга",
        description: "30м өндөр шохойн чулуун хаднууд. Эртний далайн ёроолын хурдас.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Tsagaan_Suvarga.jpg/1280px-Tsagaan_Suvarga.jpg",
      },
      {
        name: "Бага газрын чулуу",
        description: "Гранитан хадан хөндий. Агуй, булаг шанд бүхий байгалийн үзэсгэлэнт газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Baga_Gazriin_Chuluu.jpg/1280px-Baga_Gazriin_Chuluu.jpg",
      },
      {
        name: "Ихгазрын чулуу",
        description: "Гранитан хадан бүрдэл. Аялал жуулчлалын алдартай газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Ikh_Gazriin_Chuluu.jpg/1280px-Ikh_Gazriin_Chuluu.jpg",
      },
    ],
  },
  {
    name: "Завхан",
    description: "Уул, мөстлөг, гол мөрөн бүхий баруун хойд аймаг.",
    highlights: ["Отгонтэнгэр уул", "Тэлмэн нуур", "Завхан гол", "Идэр гол"],
    image: "🏔️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Otgontenger.jpg/1280px-Otgontenger.jpg",
    population: "66,000+",
    area: "82,500 км²",
    attractions: [
      {
        name: "Отгонтэнгэр уул",
        description: "Хангайн нурууны хамгийн өндөр оргил (4021м). Мөнх цастай, тахилгат уул.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Otgontenger.jpg/1280px-Otgontenger.jpg",
      },
      {
        name: "Тэлмэн нуур",
        description: "Завхан аймгийн хойд хэсэгт оршдог нуур. Загасчлалаар алдартай.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Telmen_Lake.jpg/1280px-Telmen_Lake.jpg",
      },
    ],
  },
  {
    name: "Орхон",
    description: "Эрдэнэт хот, уул уурхайн төв.",
    highlights: ["Эрдэнэт уурхай", "Хүннүгийн балгас", "Сэлэнгэ мөрөн"],
    image: "⛏️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Erdenet_mine.jpg/1280px-Erdenet_mine.jpg",
    population: "104,000+",
    area: "840 км²",
    attractions: [
      {
        name: "Эрдэнэт уурхай",
        description: "Дэлхийн 4 дэх том зэсийн уурхай. Монголын эдийн засгийн чухал салбар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Erdenet_mine.jpg/1280px-Erdenet_mine.jpg",
      },
    ],
  },
  {
    name: "Өвөрхангай",
    description: "Монголын түүх, соёлын өлгий нутаг.",
    highlights: ["Хархорин", "Эрдэнэ зуу хийд", "Орхон гол", "Хүйсийн найман нуур"],
    image: "🏛️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Erdene_Zuu_Monastery.jpg/1280px-Erdene_Zuu_Monastery.jpg",
    population: "101,000+",
    area: "63,500 км²",
    attractions: [
      {
        name: "Эрдэнэ зуу хийд",
        description: "1585 онд байгуулагдсан Монголын анхны будда шашны сүм хийд. ЮНЕСКО-д бүртгэлтэй.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Erdene_Zuu_Monastery.jpg/1280px-Erdene_Zuu_Monastery.jpg",
      },
      {
        name: "Орхоны хүрхрээ",
        description: "Орхон голын 20м өндөр хүрхрээ. Улирлын чанартай (зуны сард).",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Orkhon_Waterfall.jpg/1280px-Orkhon_Waterfall.jpg",
      },
      {
        name: "Хархорин (Каракорум)",
        description: "XIII зууны Их Монгол гүрний нийслэл. Түүхийн чухал дурсгалт газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Karakorum_turtle.jpg/1280px-Karakorum_turtle.jpg",
      },
      {
        name: "Хүйсийн найман нуур",
        description: "Орхон голын хөндийд оршдог 8 нуурын бүлэг. Галт уулын лавын урсгалаас үүссэн.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Khuisiin_naiman_nuur.jpg/1280px-Khuisiin_naiman_nuur.jpg",
      },
    ],
  },
  {
    name: "Өмнөговь",
    description: "Говь нутгийн хамгийн алдартай аялал жуулчлалын аймаг.",
    highlights: ["Хонгорын элс", "Баянзаг", "Ёлын ам", "Хэрмэн цав"],
    image: "🐪",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Khongoryn_Els.jpg/1280px-Khongoryn_Els.jpg",
    population: "60,000+",
    area: "165,400 км²",
    attractions: [
      {
        name: "Хонгорын элс",
        description: "Монголын хамгийн том элсэн манхан. 180км урт, 27км өргөн, 800м хүртэл өндөр. 'Дуулдаг элс' гэж нэрлэгддэг.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Khongoryn_Els.jpg/1280px-Khongoryn_Els.jpg",
      },
      {
        name: "Баянзаг (Шатсан хад)",
        description: "1922 онд Рой Чэпмэн Эндрюс динозаврын өндөг анх олсон газар. Улаан шохойн чулуун хад.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Bayanzag_flaming_cliffs.jpg/1280px-Bayanzag_flaming_cliffs.jpg",
      },
      {
        name: "Ёлын ам",
        description: "Зуны дунд үед ч мөстэй байдаг гүн хавцал. Гурван сайханы байгалийн цогцолборт газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Yolyn_Am.jpg/1280px-Yolyn_Am.jpg",
      },
      {
        name: "Хэрмэн цав",
        description: "Монголын Гранд Каньон гэж нэрлэгддэг 200м гүн хавцал. Өмнөговийн нууц газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Khermen_Tsav.jpg/1280px-Khermen_Tsav.jpg",
      },
    ],
  },
  {
    name: "Сүхбаатар",
    description: "Зүүн бүсийн тал нутгийн аймаг.",
    highlights: ["Дарамын уул", "Шилийн богд", "Халхгол сум"],
    image: "🐎",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Mongolian_steppe.jpg/1280px-Mongolian_steppe.jpg",
    population: "55,000+",
    area: "82,300 км²",
    attractions: [
      {
        name: "Шилийн богд уул",
        description: "Сүхбаатар аймгийн тахилгат уул. 1778м өндөр.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Shiliin_Bogd.jpg/1280px-Shiliin_Bogd.jpg",
      },
      {
        name: "Монгол тал нутаг",
        description: "Дэлхийн хамгийн том бүрэн бүтэн тал нутгийн экосистем. Цагаан зээрийн нүүдэл.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Mongolian_steppe.jpg/1280px-Mongolian_steppe.jpg",
      },
    ],
  },
  {
    name: "Сэлэнгэ",
    description: "Хөдөө аж ахуйн төв, үр тариалангийн буйдар нутаг.",
    highlights: ["Амарбаясгалант хийд", "Сэлэнгэ мөрөн", "Дүүрэг нуур"],
    image: "🌾",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Amarbayasgalant_Monastery.jpg/1280px-Amarbayasgalant_Monastery.jpg",
    population: "106,000+",
    area: "41,200 км²",
    attractions: [
      {
        name: "Амарбаясгалант хийд",
        description: "1727-1736 онд баригдсан. Монголын хамгийн том, бүрэн бүтэн хадгалагдсан хийдүүдийн нэг.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Amarbayasgalant_Monastery.jpg/1280px-Amarbayasgalant_Monastery.jpg",
      },
      {
        name: "Сэлэнгэ мөрөн",
        description: "Монголын хамгийн урт гол (593км). Байгаль нуурт цутгадаг.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Selenge_River.jpg/1280px-Selenge_River.jpg",
      },
    ],
  },
  {
    name: "Төв",
    description: "Нийслэлийг тойрсон төв аймаг, түүхийн дурсгалт газрууд.",
    highlights: ["Тэрэлж", "Чингис хааны хөшөө", "Мөнгөнморьт", "Горхи-Тэрэлж"],
    image: "🗿",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Terelj_Mongolia.jpg/1280px-Terelj_Mongolia.jpg",
    population: "92,000+",
    area: "74,000 км²",
    attractions: [
      {
        name: "Горхи-Тэрэлж",
        description: "Улаанбаатараас 70км зайтай байгалийн цогцолборт газар. Мэлхий хад, Арьяабалын сүм.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Terelj_Mongolia.jpg/1280px-Terelj_Mongolia.jpg",
      },
      {
        name: "Чингис хааны хөшөө цогцолбор",
        description: "Дэлхийн хамгийн том морьтой хөшөө (40м). Тэрэлжийн замд оршдог.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Chinggis_Khaan_Statue_Complex.jpg/1280px-Chinggis_Khaan_Statue_Complex.jpg",
      },
      {
        name: "Мэлхий хад",
        description: "Мэлхий хэлбэртэй алдартай хадан бүрдэл. Тэрэлж дүүрэгт оршдог.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Turtle_Rock_Mongolia.jpg/1280px-Turtle_Rock_Mongolia.jpg",
      },
    ],
  },
  {
    name: "Увс",
    description: "ЮНЕСКО-гийн дэлхийн өвд бүртгэлтэй Увс нуурын аймаг.",
    highlights: ["Увс нуур", "Тэс гол", "Алтан хөх уул", "ЮНЕСКО өв"],
    image: "🌊",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Uvs_Lake.jpg/1280px-Uvs_Lake.jpg",
    population: "73,000+",
    area: "69,600 км²",
    attractions: [
      {
        name: "Увс нуур",
        description: "Монголын хамгийн том нуур (3350 км²). ЮНЕСКО-гийн дэлхийн өвд бүртгэлтэй.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Uvs_Lake.jpg/1280px-Uvs_Lake.jpg",
      },
      {
        name: "Үүрэг нуур",
        description: "Уулсаар хүрээлэгдсэн цэнхэр усны нуур. Фотозургийн алдартай газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Uureg_Lake.jpg/1280px-Uureg_Lake.jpg",
      },
    ],
  },
  {
    name: "Ховд",
    description: "Олон үндэстэн, байгалийн олон янз бүрдлийн аймаг.",
    highlights: ["Хар ус нуур", "Мөнххайрхан уул", "Цамбагарав уул"],
    image: "🏔️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Khar_Us_Lake.jpg/1280px-Khar_Us_Lake.jpg",
    population: "76,000+",
    area: "76,100 км²",
    attractions: [
      {
        name: "Хар ус нуур",
        description: "Монголын хоёр дахь том нуур (1578 км²). Шувуудын нүүдлийн чухал буудал.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Khar_Us_Lake.jpg/1280px-Khar_Us_Lake.jpg",
      },
      {
        name: "Цамбагарав уул",
        description: "4208м өндөр мөнх цастай уул. Байгалийн цогцолборт газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tsambagarav_Mountain.jpg/1280px-Tsambagarav_Mountain.jpg",
      },
      {
        name: "Мөнххайрхан уул",
        description: "4204м өндөр. Мөнх цас, мөсөн голтой. Тусгай хамгаалалттай газар.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Munkh_Khairkhan.jpg/1280px-Munkh_Khairkhan.jpg",
      },
    ],
  },
  {
    name: "Хөвсгөл",
    description: "Монголын далай гэгддэг Хөвсгөл нууртай аймаг.",
    highlights: ["Хөвсгөл нуур", "Цаатан ардууд", "Мурэн хот", "Дэлгэрмөрөн гол"],
    image: "💎",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Khovsgol_Lake.jpg/1280px-Khovsgol_Lake.jpg",
    population: "120,000+",
    area: "100,600 км²",
    attractions: [
      {
        name: "Хөвсгөл нуур",
        description: "Монголын хамгийн гүн нуур (262м). Дэлхийн цэнгэг усны нөөцийн 0.4%. 'Монголын далай'.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Khovsgol_Lake.jpg/1280px-Khovsgol_Lake.jpg",
      },
      {
        name: "Цаатан ардууд",
        description: "Цаа бугаар амьдралаа залгуулдаг цөөн тооны бүлэг. Дэлхийн хамгийн ховор соёл.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Tsaatan_reindeer_herder.jpg/1280px-Tsaatan_reindeer_herder.jpg",
      },
      {
        name: "Хөвсгөл нуурын мөсөн баяр",
        description: "Жил бүрийн 3-р сард зохиогддог мөсөн баяр. Мөсөн чарга, цана зэрэг тэмцээнүүд.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Ice_festival_Khovsgol.jpg/1280px-Ice_festival_Khovsgol.jpg",
      },
    ],
  },
  {
    name: "Хэнтий",
    description: "Чингис хааны төрсөн нутаг, түүхт газар.",
    highlights: ["Бурхан халдун", "Онон гол", "Хэрлэн гол", "Балдан Бэрээвэн хийд"],
    image: "⚔️",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Burkhan_Khaldun.jpg/1280px-Burkhan_Khaldun.jpg",
    population: "68,000+",
    area: "80,300 км²",
    attractions: [
      {
        name: "Бурхан халдун уул",
        description: "Чингис хааны төрсөн нутаг. ЮНЕСКО-гийн дэлхийн өвд бүртгэлтэй тахилгат уул.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Burkhan_Khaldun.jpg/1280px-Burkhan_Khaldun.jpg",
      },
      {
        name: "Балдан Бэрээвэн хийд",
        description: "1700 онд байгуулагдсан. Хэнтий аймгийн хамгийн том сүм хийд.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Baldan_Bereeven.jpg/1280px-Baldan_Bereeven.jpg",
      },
      {
        name: "Онон гол",
        description: "Чингис хааны төрсөн газрын ойролцоох гол. Амур мөрний эх.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Onon_River.jpg/1280px-Onon_River.jpg",
      },
    ],
  },
];
