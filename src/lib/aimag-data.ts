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

// Using reliable Unsplash URLs with Mongolia-relevant search terms
export const AIMAG_DATA: AimagInfo[] = [
  {
    name: "Улаанбаатар",
    description: "Монголын нийслэл хот. Орчин үеийн амьдрал, соёл урлаг, бизнесийн төв.",
    highlights: ["Чингис хааны талбай", "Гандантэгчинлэн хийд", "Зайсан толгой", "Богд хааны ордон"],
    image: "🏙️",
    photoUrl: "https://images.unsplash.com/photo-1584592740039-cddf0671f3d4?w=800&q=80",
    population: "1,500,000+",
    area: "4,704 км²",
    attractions: [
      {
        name: "Гандантэгчинлэн хийд",
        description: "Монголын хамгийн том будда шашны сүм хийд. 26.5 метрийн Мэгжид Жанрайсиг бурханы хөшөөтэй.",
        photoUrl: "https://images.unsplash.com/photo-1623677989544-2e8fd9a9e3f2?w=800&q=80",
      },
      {
        name: "Зайсан толгой",
        description: "Улаанбаатар хотын сайхан харагддаг дурсгалт газар. Хоёрдугаар дайны дурсгалт хөшөө.",
        photoUrl: "https://images.unsplash.com/photo-1602149451398-453be1b39498?w=800&q=80",
      },
      {
        name: "Богд хааны ордны музей",
        description: "Монголын сүүлчийн хаан Богд хааны өвлийн ордон. 1893-1903 онд баригдсан.",
        photoUrl: "https://images.unsplash.com/photo-1623677989544-2e8fd9a9e3f2?w=800&q=80",
      },
    ],
  },
  {
    name: "Архангай",
    description: "Ногоон тал, нуур, гол мөрөн бүхий байгалийн үзэсгэлэнт газар.",
    highlights: ["Тэрхийн цагаан нуур", "Хорго уул", "Өгий нуур", "Цэнхэр халуун рашаан"],
    image: "🏔️",
    photoUrl: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800&q=80",
    population: "84,000+",
    area: "55,300 км²",
    attractions: [
      {
        name: "Тэрхийн цагаан нуур",
        description: "Хорго галт уулын лавын урсгалаас үүссэн цэнгэг усны нуур. Далайн түвшнээс 2060м өндөрт оршдог.",
        photoUrl: "https://images.unsplash.com/photo-1504699439244-870e1595be8e?w=800&q=80",
      },
      {
        name: "Хорго уул",
        description: "Унтарсан галт уул. Оройн хэсэгт 200м диаметртэй кратертай.",
        photoUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      },
      {
        name: "Өгий нуур",
        description: "Архангай аймгийн зүүн хэсэгт оршдог цэнгэг усны нуур. Загасчлал, шувуу ажиглалтаар алдартай.",
        photoUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
      },
      {
        name: "Цэнхэр халуун рашаан",
        description: "Байгалийн халуун рашаан. 86.5°C хүртэл халдаг. Эмчилгээний чанартай.",
        photoUrl: "https://images.unsplash.com/photo-1536048810970-5b0e83df4f63?w=800&q=80",
      },
    ],
  },
  {
    name: "Баян-Өлгий",
    description: "Казах соёл, бүргэдийн ан, нуурс бүхий баруун Монголын аймаг.",
    highlights: ["Бүргэдийн баяр", "Алтай таван богд", "Хотон нуур", "Казах соёл"],
    image: "🦅",
    photoUrl: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=800&q=80",
    population: "100,000+",
    area: "45,700 км²",
    attractions: [
      {
        name: "Алтай таван богд уул",
        description: "Монголын хамгийн өндөр оргил Хүйтэн оргил (4374м) энд оршдог. Мөнх цастай уулс.",
        photoUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      },
      {
        name: "Бүргэдийн баяр",
        description: "Казах бүргэдчдийн уламжлалт баяр. Жил бүрийн 10-р сарын эхээр зохиогддог.",
        photoUrl: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=800&q=80",
      },
      {
        name: "Хотон нуур",
        description: "Алтай таван богдын бүсэд оршдог уулын нуур. Тунгалаг цэнгэг ус.",
        photoUrl: "https://images.unsplash.com/photo-1504699439244-870e1595be8e?w=800&q=80",
      },
    ],
  },
  {
    name: "Баянхонгор",
    description: "Говь, уул, нуур зэрэг олон янзын байгалийн бүсүүдтэй аймаг.",
    highlights: ["Орог нуур", "Бөөн цагаан нуур", "Шаргалжуут халуун рашаан", "Их богд уул"],
    image: "🏜️",
    photoUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
    population: "78,000+",
    area: "116,000 км²",
    attractions: [
      {
        name: "Орог нуур",
        description: "Баянхонгор аймагт байрлах давстай нуур. Шувуудын нүүдлийн чухал буудал.",
        photoUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
      },
      {
        name: "Шаргалжуут халуун рашаан",
        description: "300 гаруй жилийн түүхтэй халуун рашаан. Олон төрлийн өвчинд эмчилгээний чанартай.",
        photoUrl: "https://images.unsplash.com/photo-1536048810970-5b0e83df4f63?w=800&q=80",
      },
      {
        name: "Их богд уул",
        description: "Говь-Алтайн нурууны зүүн хэсэгт оршдог. 3957м өндөр.",
        photoUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
      },
    ],
  },
  {
    name: "Булган",
    description: "Ой, мод, голуудаар баялаг хойд Монголын аймаг.",
    highlights: ["Хөгнө хан уул", "Дашчойлон хийд", "Уран тогоо", "Сэлэнгэ мөрөн"],
    image: "🌲",
    photoUrl: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&q=80",
    population: "56,000+",
    area: "48,700 км²",
    attractions: [
      {
        name: "Уран тогоо",
        description: "Унтарсан галт уулын кратер. Тусгай хамгаалалттай газар нутгийн хэсэг.",
        photoUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      },
      {
        name: "Хөгнө хан уул",
        description: "Элсэн манханы дунд оршдог ой модтой уул. Байгалийн цогцолборт газар.",
        photoUrl: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&q=80",
      },
    ],
  },
  {
    name: "Говь-Алтай",
    description: "Алтай нурууны баруун хэсгийн говь, уулт аймаг.",
    highlights: ["Их богд уул", "Хасагт хайрхан", "Тахийн тал", "Говийн байгалийн цогцолбор"],
    image: "⛰️",
    photoUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
    population: "53,000+",
    area: "141,400 км²",
    attractions: [
      {
        name: "Их богд уул",
        description: "Говь-Алтайн нурууны хамгийн өндөр цэг. 3957м. Мөнх цастай оргилуудтай.",
        photoUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
      },
      {
        name: "Тахь (Пржевальскийн адуу)",
        description: "Монголд сэргээн нутагшуулсан зэрлэг адуу. Дэлхийн хамгийн ховор зүйл.",
        photoUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80",
      },
    ],
  },
  {
    name: "Говьсүмбэр",
    description: "Монголын хамгийн жижиг аймаг, төмөр замын зангилаа.",
    highlights: ["Сүм хөх бурд", "Шивээ-Овоо", "Төмөр замын зангилаа"],
    image: "🚂",
    photoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    population: "17,000+",
    area: "5,500 км²",
    attractions: [
      {
        name: "Сүм хөх бурд",
        description: "Хадан дээрх эртний сүмийн балгас. Говьсүмбэр аймгийн түүхийн дурсгалт газар.",
        photoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
      },
    ],
  },
  {
    name: "Дархан-Уул",
    description: "Монголын хоёр дахь том хот, үйлдвэрлэлийн төв.",
    highlights: ["Хар бухын балгас", "Дарханы музей", "Шарын гол"],
    image: "🏭",
    photoUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&q=80",
    population: "100,000+",
    area: "3,300 км²",
    attractions: [
      {
        name: "Хар бухын балгас",
        description: "Хятан улсын үеийн хотын балгас. Түүхийн чухал дурсгалт газар.",
        photoUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&q=80",
      },
    ],
  },
  {
    name: "Дорноговь",
    description: "Говийн элс, динозаврын олдвор бүхий аймаг.",
    highlights: ["Сайншанд", "Хамрын хийд", "Данзанравжаа музей", "Шамбалын ордон"],
    image: "🦕",
    photoUrl: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&q=80",
    population: "68,000+",
    area: "109,500 км²",
    attractions: [
      {
        name: "Хамрын хийд",
        description: "Данзанравжаагийн байгуулсан сүм хийд. Сайншанд хотоос баруун хойш 50км зайтай.",
        photoUrl: "https://images.unsplash.com/photo-1623677989544-2e8fd9a9e3f2?w=800&q=80",
      },
      {
        name: "Данзанравжаа музей",
        description: "V Говийн ноён хутагт Данзанравжаагийн дурсгалт зүйлсийг хадгалсан музей.",
        photoUrl: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&q=80",
      },
    ],
  },
  {
    name: "Дорнод",
    description: "Их тал нутаг, зэрлэг амьтдаар баялаг зүүн Монголын аймаг.",
    highlights: ["Нүмрэг тэнгис", "Буйр нуур", "Халхын гол", "Монгол дагуурын тал"],
    image: "🦌",
    photoUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    population: "71,000+",
    area: "123,600 км²",
    attractions: [
      {
        name: "Буйр нуур",
        description: "Монгол, Хятадын хил дээрх цэнгэг усны нуур. 615 км² талбайтай.",
        photoUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
      },
      {
        name: "Халхын голын дурсгал",
        description: "1939 оны Халхын голын байлдааны түүхэн газар. Дурсгалт музей байдаг.",
        photoUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
      },
      {
        name: "Монгол дагуурын тал",
        description: "ЮНЕСКО-гийн биосферийн нөөц газар. Цагаан зээр, тарвага зэрэг амьтад амьдардаг.",
        photoUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80",
      },
    ],
  },
  {
    name: "Дундговь",
    description: "Говийн дунд хэсгийн байгалийн гайхамшигтай аймаг.",
    highlights: ["Бага газрын чулуу", "Ихгазрын чулуу", "Цагаан суварга", "Өлзийт"],
    image: "🪨",
    photoUrl: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&q=80",
    population: "38,000+",
    area: "74,700 км²",
    attractions: [
      {
        name: "Цагаан суварга",
        description: "30м өндөр шохойн чулуун хаднууд. Эртний далайн ёроолын хурдас.",
        photoUrl: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&q=80",
      },
      {
        name: "Бага газрын чулуу",
        description: "Гранитан хадан хөндий. Агуй, булаг шанд бүхий байгалийн үзэсгэлэнт газар.",
        photoUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      },
    ],
  },
  {
    name: "Завхан",
    description: "Уул, мөстлөг, гол мөрөн бүхий баруун хойд аймаг.",
    highlights: ["Отгонтэнгэр уул", "Тэлмэн нуур", "Завхан гол", "Идэр гол"],
    image: "🏔️",
    photoUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
    population: "66,000+",
    area: "82,500 км²",
    attractions: [
      {
        name: "Отгонтэнгэр уул",
        description: "Хангайн нурууны хамгийн өндөр оргил (4021м). Мөнх цастай, тахилгат уул.",
        photoUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
      },
      {
        name: "Тэлмэн нуур",
        description: "Завхан аймгийн хойд хэсэгт оршдог нуур. Загасчлалаар алдартай.",
        photoUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
      },
    ],
  },
  {
    name: "Орхон",
    description: "Эрдэнэт хот, уул уурхайн төв.",
    highlights: ["Эрдэнэт уурхай", "Хүннүгийн балгас", "Сэлэнгэ мөрөн"],
    image: "⛏️",
    photoUrl: "https://images.unsplash.com/photo-1504714146340-959ca07e1f38?w=800&q=80",
    population: "104,000+",
    area: "840 км²",
    attractions: [
      {
        name: "Эрдэнэт уурхай",
        description: "Дэлхийн 4 дэх том зэсийн уурхай. Монголын эдийн засгийн чухал салбар.",
        photoUrl: "https://images.unsplash.com/photo-1504714146340-959ca07e1f38?w=800&q=80",
      },
    ],
  },
  {
    name: "Өвөрхангай",
    description: "Монголын түүх, соёлын өлгий нутаг.",
    highlights: ["Хархорин", "Эрдэнэ зуу хийд", "Орхон гол", "Хүйсийн найман нуур"],
    image: "🏛️",
    photoUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80",
    population: "101,000+",
    area: "63,500 км²",
    attractions: [
      {
        name: "Эрдэнэ зуу хийд",
        description: "1585 онд байгуулагдсан Монголын анхны будда шашны сүм хийд. ЮНЕСКО-д бүртгэлтэй.",
        photoUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80",
      },
      {
        name: "Орхоны хүрхрээ",
        description: "Орхон голын 20м өндөр хүрхрээ. Улирлын чанартай (зуны сард).",
        photoUrl: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80",
      },
      {
        name: "Хархорин (Каракорум)",
        description: "XIII зууны Их Монгол гүрний нийслэл. Түүхийн чухал дурсгалт газар.",
        photoUrl: "https://images.unsplash.com/photo-1623677989544-2e8fd9a9e3f2?w=800&q=80",
      },
    ],
  },
  {
    name: "Өмнөговь",
    description: "Говь нутгийн хамгийн алдартай аялал жуулчлалын аймаг.",
    highlights: ["Хонгорын элс", "Баянзаг", "Ёлын ам", "Хэрмэн цав"],
    image: "🐪",
    photoUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
    population: "60,000+",
    area: "165,400 км²",
    attractions: [
      {
        name: "Хонгорын элс",
        description: "Монголын хамгийн том элсэн манхан. 180км урт, 27км өргөн, 800м хүртэл өндөр. 'Дуулдаг элс'.",
        photoUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
      },
      {
        name: "Баянзаг (Шатсан хад)",
        description: "1922 онд Рой Чэпмэн Эндрюс динозаврын өндөг анх олсон газар. Улаан шохойн чулуун хад.",
        photoUrl: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&q=80",
      },
      {
        name: "Ёлын ам",
        description: "Зуны дунд үед ч мөстэй байдаг гүн хавцал. Гурван сайханы байгалийн цогцолборт газар.",
        photoUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      },
      {
        name: "Хэрмэн цав",
        description: "Монголын Гранд Каньон гэж нэрлэгддэг 200м гүн хавцал.",
        photoUrl: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&q=80",
      },
    ],
  },
  {
    name: "Сүхбаатар",
    description: "Зүүн бүсийн тал нутгийн аймаг.",
    highlights: ["Дарамын уул", "Шилийн богд", "Халхгол сум"],
    image: "🐎",
    photoUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    population: "55,000+",
    area: "82,300 км²",
    attractions: [
      {
        name: "Шилийн богд уул",
        description: "Сүхбаатар аймгийн тахилгат уул. 1778м өндөр.",
        photoUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
      },
      {
        name: "Монгол тал нутаг",
        description: "Дэлхийн хамгийн том бүрэн бүтэн тал нутгийн экосистем. Цагаан зээрийн нүүдэл.",
        photoUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80",
      },
    ],
  },
  {
    name: "Сэлэнгэ",
    description: "Хөдөө аж ахуйн төв, үр тариалангийн буйдар нутаг.",
    highlights: ["Амарбаясгалант хийд", "Сэлэнгэ мөрөн", "Дүүрэг нуур"],
    image: "🌾",
    photoUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80",
    population: "106,000+",
    area: "41,200 км²",
    attractions: [
      {
        name: "Амарбаясгалант хийд",
        description: "1727-1736 онд баригдсан. Монголын хамгийн том, бүрэн бүтэн хадгалагдсан хийдүүдийн нэг.",
        photoUrl: "https://images.unsplash.com/photo-1623677989544-2e8fd9a9e3f2?w=800&q=80",
      },
      {
        name: "Сэлэнгэ мөрөн",
        description: "Монголын хамгийн урт гол (593км). Байгаль нуурт цутгадаг.",
        photoUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80",
      },
    ],
  },
  {
    name: "Төв",
    description: "Нийслэлийг тойрсон төв аймаг, түүхийн дурсгалт газрууд.",
    highlights: ["Тэрэлж", "Чингис хааны хөшөө", "Мөнгөнморьт", "Горхи-Тэрэлж"],
    image: "🗿",
    photoUrl: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800&q=80",
    population: "92,000+",
    area: "74,000 км²",
    attractions: [
      {
        name: "Горхи-Тэрэлж",
        description: "Улаанбаатараас 70км зайтай байгалийн цогцолборт газар. Мэлхий хад, Арьяабалын сүм.",
        photoUrl: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800&q=80",
      },
      {
        name: "Чингис хааны хөшөө цогцолбор",
        description: "Дэлхийн хамгийн том морьтой хөшөө (40м). Тэрэлжийн замд оршдог.",
        photoUrl: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800&q=80",
      },
      {
        name: "Мэлхий хад",
        description: "Мэлхий хэлбэртэй алдартай хадан бүрдэл. Горхи-Тэрэлж дүүрэгт оршдог.",
        photoUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      },
    ],
  },
  {
    name: "Увс",
    description: "ЮНЕСКО-гийн дэлхийн өвд бүртгэлтэй Увс нуурын аймаг.",
    highlights: ["Увс нуур", "Тэс гол", "Алтан хөх уул", "ЮНЕСКО өв"],
    image: "🌊",
    photoUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
    population: "73,000+",
    area: "69,600 км²",
    attractions: [
      {
        name: "Увс нуур",
        description: "Монголын хамгийн том нуур (3350 км²). ЮНЕСКО-гийн дэлхийн өвд бүртгэлтэй.",
        photoUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
      },
      {
        name: "Үүрэг нуур",
        description: "Уулсаар хүрээлэгдсэн цэнхэр усны нуур. Фотозургийн алдартай газар.",
        photoUrl: "https://images.unsplash.com/photo-1504699439244-870e1595be8e?w=800&q=80",
      },
    ],
  },
  {
    name: "Ховд",
    description: "Олон үндэстэн, байгалийн олон янз бүрдлийн аймаг.",
    highlights: ["Хар ус нуур", "Мөнххайрхан уул", "Цамбагарав уул"],
    image: "🏔️",
    photoUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    population: "76,000+",
    area: "76,100 км²",
    attractions: [
      {
        name: "Хар ус нуур",
        description: "Монголын хоёр дахь том нуур (1578 км²). Шувуудын нүүдлийн чухал буудал.",
        photoUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
      },
      {
        name: "Цамбагарав уул",
        description: "4208м өндөр мөнх цастай уул. Байгалийн цогцолборт газар.",
        photoUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      },
    ],
  },
  {
    name: "Хөвсгөл",
    description: "Монголын далай гэгддэг Хөвсгөл нууртай аймаг.",
    highlights: ["Хөвсгөл нуур", "Цаатан ардууд", "Мурэн хот", "Дэлгэрмөрөн гол"],
    image: "💎",
    photoUrl: "https://images.unsplash.com/photo-1504699439244-870e1595be8e?w=800&q=80",
    population: "120,000+",
    area: "100,600 км²",
    attractions: [
      {
        name: "Хөвсгөл нуур",
        description: "Монголын хамгийн гүн нуур (262м). Дэлхийн цэнгэг усны нөөцийн 0.4%. 'Монголын далай'.",
        photoUrl: "https://images.unsplash.com/photo-1504699439244-870e1595be8e?w=800&q=80",
      },
      {
        name: "Цаатан ардууд",
        description: "Цаа бугаар амьдралаа залгуулдаг цөөн тооны бүлэг. Дэлхийн хамгийн ховор соёл.",
        photoUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80",
      },
      {
        name: "Хөвсгөл нуурын мөсөн баяр",
        description: "Жил бүрийн 3-р сард зохиогддог мөсөн баяр. Мөсөн чарга, цана зэрэг тэмцээнүүд.",
        photoUrl: "https://images.unsplash.com/photo-1504699439244-870e1595be8e?w=800&q=80",
      },
    ],
  },
  {
    name: "Хэнтий",
    description: "Чингис хааны төрсөн нутаг, түүхт газар.",
    highlights: ["Бурхан халдун", "Онон гол", "Хэрлэн гол", "Балдан Бэрээвэн хийд"],
    image: "⚔️",
    photoUrl: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&q=80",
    population: "68,000+",
    area: "80,300 км²",
    attractions: [
      {
        name: "Бурхан халдун уул",
        description: "Чингис хааны төрсөн нутаг. ЮНЕСКО-гийн дэлхийн өвд бүртгэлтэй тахилгат уул.",
        photoUrl: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&q=80",
      },
      {
        name: "Балдан Бэрээвэн хийд",
        description: "1700 онд байгуулагдсан. Хэнтий аймгийн хамгийн том сүм хийд.",
        photoUrl: "https://images.unsplash.com/photo-1623677989544-2e8fd9a9e3f2?w=800&q=80",
      },
      {
        name: "Онон гол",
        description: "Чингис хааны төрсөн газрын ойролцоох гол. Амур мөрний эх.",
        photoUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80",
      },
    ],
  },
];
