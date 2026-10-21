const songs = [
  {
    "id": 1,
    "title": "Always",
    "artist": "Daniel Caesar",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//1.%20Always.mp3"
  },
  {
    "id": 2,
    "title": "My Heart",
    "artist": "Acha Septriasa/Irwansyah",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//1.%20My%20Heart.mp3"
  },
  {
    "id": 3,
    "title": "Serana",
    "artist": "For Revenge",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//1.%20Serana.mp3"
  },
  {
    "id": 4,
    "title": "Sesi Potret",
    "artist": "eńau/Ari Lesmana",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//1.%20Sesi%20Potret.mp3"
  },
  {
    "id": 5,
    "title": "Jakarta Hari Ini",
    "artist": "For Revenge/Stereo Wall",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//10.%20Jakarta%20Hari%20Ini.mp3"
  },
  {
    "id": 6,
    "title": "Kehilangan",
    "artist": "Christina The",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//10.%20Kehilangan.mp3"
  },
  {
    "id": 7,
    "title": "Mendung",
    "artist": "Idgitaf",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//10.%20Mendung.mp3"
  },
  {
    "id": 8,
    "title": "Until I Found You",
    "artist": "Stephen Sanchez",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//10.%20Until%20I%20Found%20You.mp3"
  },
  {
    "id": 9,
    "title": "a thousand years",
    "artist": "Christina Perri",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//100.%20a%20thousand%20years.mp3"
  },
  {
    "id": 10,
    "title": "Pelangi",
    "artist": "Hivi!",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//100.%20Pelangi.mp3"
  },
  {
    "id": 11,
    "title": "Duka",
    "artist": "Last Child",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//11.%20Duka.mp3"
  },
  {
    "id": 12,
    "title": "SHOPPING PARIS",
    "artist": "Mc Morena/ILYAH/T-Koor/DINASTICA",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//11.%20SHOPPING%20PARIS.mp3"
  },
  {
    "id": 13,
    "title": "When You're Gone - Acoustic",
    "artist": "Shawn Mendes",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//11.%20When%20You're%20Gone%20-%20Acoustic.mp3"
  },
  {
    "id": 14,
    "title": "A Thousand Years",
    "artist": "James Arthur",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//12.%20A%20Thousand%20Years.mp3"
  },
  {
    "id": 15,
    "title": "Ada titik-titik di ujung doa",
    "artist": "Sal Priadi",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//12.%20Ada%20titik-titik%20di%20ujung%20doa.mp3"
  },
  {
    "id": 16,
    "title": "Sadrah",
    "artist": "For Revenge",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//12.%20Sadrah.mp3"
  },
  {
    "id": 17,
    "title": "Rumah Ke Rumah",
    "artist": "Hindia",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//13.%20Rumah%20Ke%20Rumah.mp3"
  },
  {
    "id": 18,
    "title": "Strong",
    "artist": "One Direction",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//13.%20Strong.mp3"
  },
  {
    "id": 19,
    "title": "Cincin",
    "artist": "Hindia",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//14.%20Cincin.mp3"
  },
  {
    "id": 20,
    "title": "Outro",
    "artist": "T-Koor/DINASTICA",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//14.%20Outro.mp3"
  },
  {
    "id": 21,
    "title": "Rewrite The Stars (with James Arthur & Anne-Marie)",
    "artist": "James Arthur/Anne-Marie",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//14.%20Rewrite%20The%20Stars%20(with%20James%20Arthur%20%26%20Anne-Marie).mp3"
  },
  {
    "id": 22,
    "title": "Monolog",
    "artist": "Pamungkas",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//15.%20Monolog.mp3"
  },
  {
    "id": 23,
    "title": "Payphone",
    "artist": "Maroon 5/Wiz Khalifa",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//15.%20Payphone.mp3"
  },
  {
    "id": 24,
    "title": "Penyangkalan",
    "artist": "For Revenge",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//15.%20Penyangkalan.mp3"
  },
  {
    "id": 25,
    "title": "Demons",
    "artist": "Imagine Dragons",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//16.%20Demons.mp3"
  },
  {
    "id": 26,
    "title": "Rahasia Hati",
    "artist": "Nidji",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//16.%20Rahasia%20Hati.mp3"
  },
  {
    "id": 27,
    "title": "Tell Me Now",
    "artist": "Dauble",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//16.%20Tell%20Me%20Now.mp3"
  },
  {
    "id": 28,
    "title": "Bahagia Lagi",
    "artist": "Piche Kota",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//17.%20Bahagia%20Lagi.mp3"
  },
  {
    "id": 29,
    "title": "Nanti Kita Seperti Ini",
    "artist": "Batas Senja",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//17.%20Nanti%20Kita%20Seperti%20Ini.mp3"
  },
  {
    "id": 30,
    "title": "7 Years",
    "artist": "Lukas Graham",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//18.%207%20Years.mp3"
  },
  {
    "id": 31,
    "title": "Platine",
    "artist": "Blasko/T-Koor/DINASTICA",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//18.%20Platine.mp3"
  },
  {
    "id": 32,
    "title": "Seandainya",
    "artist": "Vierra",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//18.%20Seandainya.mp3"
  },
  {
    "id": 33,
    "title": "December",
    "artist": "Neck Deep",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//19.%20December.mp3"
  },
  {
    "id": 34,
    "title": "Kembali Pulang",
    "artist": "Suara Kayu/Feby Putri",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//19.%20Kembali%20Pulang.mp3"
  },
  {
    "id": 35,
    "title": "Nina",
    "artist": ".Feast",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//19.%20Nina.mp3"
  },
  {
    "id": 36,
    "title": "Here With Me",
    "artist": "d4vd",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//2.%20Here%20With%20Me.mp3"
  },
  {
    "id": 37,
    "title": "Menepi - Cover",
    "artist": "Guyon Waton",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//2.%20Menepi%20-%20Cover.mp3"
  },
  {
    "id": 38,
    "title": "Pencinta Wanita",
    "artist": "Irwansyah",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//2.%20Pencinta%20Wanita.mp3"
  },
  {
    "id": 39,
    "title": "Teh Hijau",
    "artist": "Tulus",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//2.%20Teh%20Hijau.mp3"
  },
  {
    "id": 40,
    "title": "Body On Mine",
    "artist": "Dauble",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//20.%20Body%20On%20Mine.mp3"
  },
  {
    "id": 41,
    "title": "Selamat (Selamat Tinggal)",
    "artist": "Virgoun/Audy",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//20.%20Selamat%20(Selamat%20Tinggal).mp3"
  },
  {
    "id": 42,
    "title": "Wish You Were Here",
    "artist": "Neck Deep",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//20.%20Wish%20You%20Were%20Here.mp3"
  },
  {
    "id": 43,
    "title": "back to friends",
    "artist": "sombr",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//21.%20back%20to%20friends.mp3"
  },
  {
    "id": 44,
    "title": "Disenchanted",
    "artist": "My Chemical Romance",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//21.%20Disenchanted.mp3"
  },
  {
    "id": 45,
    "title": "Runtuh",
    "artist": "Feby Putri/Fiersa Besari",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//21.%20Runtuh.mp3"
  },
  {
    "id": 46,
    "title": "Blank Space",
    "artist": "Twenty One Two",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//22.%20Blank%20Space.mp3"
  },
  {
    "id": 47,
    "title": "Karena Kamu",
    "artist": "Geisha",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//22.%20Karena%20Kamu.mp3"
  },
  {
    "id": 48,
    "title": "Time Feels so Slow",
    "artist": "Dauble",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//22.%20Time%20Feels%20so%20Slow.mp3"
  },
  {
    "id": 49,
    "title": "Merindukanmu",
    "artist": "Dash Uciha",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//23.%20Merindukanmu.mp3"
  },
  {
    "id": 50,
    "title": "Monokrom",
    "artist": "Tulus",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//23.%20Monokrom.mp3"
  },
  {
    "id": 51,
    "title": "No Surprises",
    "artist": "Radiohead",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//23.%20No%20Surprises.mp3"
  },
  {
    "id": 52,
    "title": "drunk text",
    "artist": "Henry Moodie",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//24.%20drunk%20text.mp3"
  },
  {
    "id": 53,
    "title": "Sesuatu Di Jogja",
    "artist": "Mitty Zasia",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//24.%20Sesuatu%20Di%20Jogja.mp3"
  },
  {
    "id": 54,
    "title": "Treat You Better",
    "artist": "Shawn Mendes",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//24.%20Treat%20You%20Better.mp3"
  },
  {
    "id": 55,
    "title": "Another Love",
    "artist": "Tom Odell",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//25.%20Another%20Love.mp3"
  },
  {
    "id": 56,
    "title": "Lifeline - sped up",
    "artist": "Dauble",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//25.%20Lifeline%20-%20sped%20up.mp3"
  },
  {
    "id": 57,
    "title": "Tetap Dalam Jiwa",
    "artist": "Isyana Sarasvati",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//25.%20Tetap%20Dalam%20Jiwa.mp3"
  },
  {
    "id": 58,
    "title": "bergema sampai selamanya",
    "artist": "Nadhif Basalamah",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//26.%20bergema%20sampai%20selamanya.mp3"
  },
  {
    "id": 59,
    "title": "Can I Be Him",
    "artist": "James Arthur",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//26.%20Can%20I%20Be%20Him.mp3"
  },
  {
    "id": 60,
    "title": "Kesepian",
    "artist": "Vierra",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//26.%20Kesepian.mp3"
  },
  {
    "id": 61,
    "title": "Homage",
    "artist": "Mild High Club",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//27.%20Homage.mp3"
  },
  {
    "id": 62,
    "title": "Separuh Aku",
    "artist": "Noah",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//27.%20Separuh%20Aku.mp3"
  },
  {
    "id": 63,
    "title": "Tarot",
    "artist": ".Feast",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//27.%20Tarot.mp3"
  },
  {
    "id": 64,
    "title": "Monokrom",
    "artist": "Tulus",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//28.%20Monokrom.mp3"
  },
  {
    "id": 65,
    "title": "Stay With Me",
    "artist": "1nonly",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//28.%20Stay%20With%20Me.mp3"
  },
  {
    "id": 66,
    "title": "TÚ",
    "artist": "ILYAH/Peter Pann/Yael/T-Koor",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//28.%20T%C3%9A.mp3"
  },
  {
    "id": 67,
    "title": "Bukan Pujangga",
    "artist": "Base Jam",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//29.%20Bukan%20Pujangga.mp3"
  },
  {
    "id": 68,
    "title": "Jiwa Yang Bersedih",
    "artist": "Ghea Indrawari",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//29.%20Jiwa%20Yang%20Bersedih.mp3"
  },
  {
    "id": 69,
    "title": "Line Without a Hook",
    "artist": "Ricky Montgomery",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//29.%20Line%20Without%20a%20Hook.mp3"
  },
  {
    "id": 70,
    "title": "Garam & Madu (Sakit Dadaku) [Sped Up]",
    "artist": "Tenxi/Jemsii/Naykilla",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//3.%20Garam%20%26%20Madu%20(Sakit%20Dadaku)%20%5BSped%20Up%5D.mp3"
  },
  {
    "id": 71,
    "title": "iqro'",
    "artist": "Raim Laode",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//3.%20iqro'.mp3"
  },
  {
    "id": 72,
    "title": "Kehilangan - Instrumental",
    "artist": "Heart",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//3.%20Kehilangan%20-%20Instrumental.mp3"
  },
  {
    "id": 73,
    "title": "Night Changes",
    "artist": "One Direction",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//3.%20Night%20Changes.mp3"
  },
  {
    "id": 74,
    "title": "Lesung Pipi",
    "artist": "Raim Laode",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//30.%20Lesung%20Pipi.mp3"
  },
  {
    "id": 75,
    "title": "Those Eyes",
    "artist": "New West",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//30.%20Those%20Eyes.mp3"
  },
  {
    "id": 76,
    "title": "Glimpse of Us",
    "artist": "Joji",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//31.%20Glimpse%20of%20Us.mp3"
  },
  {
    "id": 77,
    "title": "Masa ini, Nanti, dan Masa Indah Lainnya",
    "artist": "Nuca",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//31.%20Masa%20ini%2C%20Nanti%2C%20dan%20Masa%20Indah%20Lainnya.mp3"
  },
  {
    "id": 78,
    "title": "End of Beginning",
    "artist": "Djo",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//32.%20End%20of%20Beginning.mp3"
  },
  {
    "id": 79,
    "title": "Kesalahan Terbesar",
    "artist": "Farelio",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//32.%20Kesalahan%20Terbesar.mp3"
  },
  {
    "id": 80,
    "title": "novocaine",
    "artist": "GenriX/CORBAL/Shiloh Dynasty",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//32.%20novocaine.mp3"
  },
  {
    "id": 81,
    "title": "About You",
    "artist": "The 1975",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//33.%20About%20You.mp3"
  },
  {
    "id": 82,
    "title": "Sunroof",
    "artist": "Nicky Youre/hey daisy",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//33.%20Sunroof.mp3"
  },
  {
    "id": 83,
    "title": "This Side of Paradise",
    "artist": "Coyote Theory",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//33.%20This%20Side%20of%20Paradise.mp3"
  },
  {
    "id": 84,
    "title": "As It Was",
    "artist": "Harry Styles",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//34.%20As%20It%20Was.mp3"
  },
  {
    "id": 85,
    "title": "Better Off Alone",
    "artist": "Bailey Perrie",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//34.%20Better%20Off%20Alone.mp3"
  },
  {
    "id": 86,
    "title": "Heat Waves",
    "artist": "Glass Animals",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//34.%20Heat%20Waves.mp3"
  },
  {
    "id": 87,
    "title": "Locked out of Heaven",
    "artist": "Bruno Mars",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//35.%20Locked%20out%20of%20Heaven.mp3"
  },
  {
    "id": 88,
    "title": "penjaga hati",
    "artist": "Nadhif Basalamah",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//35.%20penjaga%20hati.mp3"
  },
  {
    "id": 89,
    "title": "The Night We Met",
    "artist": "Lord Huron",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//35.%20The%20Night%20We%20Met.mp3"
  },
  {
    "id": 90,
    "title": "I Wanna Be Yours",
    "artist": "Arctic Monkeys",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//36.%20I%20Wanna%20Be%20Yours.mp3"
  },
  {
    "id": 91,
    "title": "Ruang Dihatimu",
    "artist": "Lea Simanjuntak",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//36.%20Ruang%20Dihatimu.mp3"
  },
  {
    "id": 92,
    "title": "Somewhere Only We Know",
    "artist": "Keane",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//36.%20Somewhere%20Only%20We%20Know.mp3"
  },
  {
    "id": 93,
    "title": "505",
    "artist": "Arctic Monkeys",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//37.%20505.mp3"
  },
  {
    "id": 94,
    "title": "Serana",
    "artist": "For Revenge",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//37.%20Serana.mp3"
  },
  {
    "id": 95,
    "title": "WILDFLOWER",
    "artist": "Billie Eilish",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//37.%20WILDFLOWER.mp3"
  },
  {
    "id": 96,
    "title": "Cincin",
    "artist": "Hindia",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//38.%20Cincin.mp3"
  },
  {
    "id": 97,
    "title": "Space Song",
    "artist": "Beach House",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//38.%20Space%20Song.mp3"
  },
  {
    "id": 98,
    "title": "Where We Are",
    "artist": "Westlife",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//38.%20Where%20We%20Are.mp3"
  },
  {
    "id": 99,
    "title": "Die With A Smile",
    "artist": "Lady Gaga/Bruno Mars",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//39.%20Die%20With%20A%20Smile.mp3"
  },
  {
    "id": 100,
    "title": "How You Won Me Over",
    "artist": "Bailey Perrie",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//39.%20How%20You%20Won%20Me%20Over.mp3"
  },
  {
    "id": 101,
    "title": "Mau Dibawa Kemana",
    "artist": "Armada",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//39.%20Mau%20Dibawa%20Kemana.mp3"
  },
  {
    "id": 102,
    "title": "Hope",
    "artist": "XXXTENTACION",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//4.%20Hope.mp3"
  },
  {
    "id": 103,
    "title": "Jangan Paksa Rindu",
    "artist": "Ifan Seventeen",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//4.%20Jangan%20Paksa%20Rindu.mp3"
  },
  {
    "id": 104,
    "title": "Right Now",
    "artist": "One Direction",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//4.%20Right%20Now.mp3"
  },
  {
    "id": 105,
    "title": "Sampai Menutup Mata",
    "artist": "Acha Septriasa",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//4.%20Sampai%20Menutup%20Mata.mp3"
  },
  {
    "id": 106,
    "title": "Asal Kau Bahagia",
    "artist": "Armada",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//40.%20Asal%20Kau%20Bahagia.mp3"
  },
  {
    "id": 107,
    "title": "Dan...",
    "artist": "Sheila On 7",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//40.%20Dan....mp3"
  },
  {
    "id": 108,
    "title": "Viva La Vida",
    "artist": "Coldplay",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//40.%20Viva%20La%20Vida.mp3"
  },
  {
    "id": 109,
    "title": "sayang,",
    "artist": "satchi!",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//41.%20sayang%2C.mp3"
  },
  {
    "id": 110,
    "title": "Separuh Aku",
    "artist": "Noah",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//41.%20Separuh%20Aku.mp3"
  },
  {
    "id": 111,
    "title": "There Is a Light That Never Goes Out - 2011 Remaster",
    "artist": "The Smiths",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//41.%20There%20Is%20a%20Light%20That%20Never%20Goes%20Out%20-%202011%20Remaster.mp3"
  },
  {
    "id": 112,
    "title": "Cinta Itu Buta",
    "artist": "Armada",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//42.%20Cinta%20Itu%20Buta.mp3"
  },
  {
    "id": 113,
    "title": "Nanti Kita Seperti Ini",
    "artist": "Batas Senja",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//42.%20Nanti%20Kita%20Seperti%20Ini.mp3"
  },
  {
    "id": 114,
    "title": "Santeria",
    "artist": "Sublime",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//42.%20Santeria.mp3"
  },
  {
    "id": 115,
    "title": "Beg U",
    "artist": "Weird Genius/Jessy Alexa",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//43.%20Beg%20U.mp3"
  },
  {
    "id": 116,
    "title": "Coffee",
    "artist": "beabadoobee",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//43.%20Coffee.mp3"
  },
  {
    "id": 117,
    "title": "My Heart",
    "artist": "Acha Septriasa/Irwansyah",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//43.%20My%20Heart.mp3"
  },
  {
    "id": 118,
    "title": "Cinta Sejati",
    "artist": "Bunga Citra Lestari",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//44.%20Cinta%20Sejati.mp3"
  },
  {
    "id": 119,
    "title": "I Love You So",
    "artist": "The Walters",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//44.%20I%20Love%20You%20So.mp3"
  },
  {
    "id": 120,
    "title": "Ini Abadi",
    "artist": "Perunggu",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//44.%20Ini%20Abadi.mp3"
  },
  {
    "id": 121,
    "title": "Hanya Rindu",
    "artist": "Andmesh",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//45.%20Hanya%20Rindu.mp3"
  },
  {
    "id": 122,
    "title": "Harmoni Semesta",
    "artist": "Limaraya",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//45.%20Harmoni%20Semesta.mp3"
  },
  {
    "id": 123,
    "title": "This Side of Paradise",
    "artist": "Coyote Theory",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//45.%20This%20Side%20of%20Paradise.mp3"
  },
  {
    "id": 124,
    "title": "Kembali Pulang",
    "artist": "Ariyo Wahab",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//46.%20Kembali%20Pulang.mp3"
  },
  {
    "id": 125,
    "title": "Menunggumu",
    "artist": "Noah",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//46.%20Menunggumu.mp3"
  },
  {
    "id": 126,
    "title": "Prom Queen",
    "artist": "Beach Bunny",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//46.%20Prom%20Queen.mp3"
  },
  {
    "id": 127,
    "title": "Menerima Luka",
    "artist": "Natasya Sabella",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//47.%20Menerima%20Luka.mp3"
  },
  {
    "id": 128,
    "title": "penjaga hati",
    "artist": "Nadhif Basalamah",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//47.%20penjaga%20hati.mp3"
  },
  {
    "id": 129,
    "title": "Television / So Far So Good",
    "artist": "Rex Orange County",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//47.%20Television%20_%20So%20Far%20So%20Good.mp3"
  },
  {
    "id": 130,
    "title": "Iris",
    "artist": "The Goo Goo Dolls",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//48.%20Iris.mp3"
  },
  {
    "id": 131,
    "title": "Senyum Senyum",
    "artist": "Sparkle",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//48.%20Senyum%20Senyum.mp3"
  },
  {
    "id": 132,
    "title": "Sesi Potret",
    "artist": "eńau/Ari Lesmana",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//48.%20Sesi%20Potret.mp3"
  },
  {
    "id": 133,
    "title": "iqro'",
    "artist": "Raim Laode",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//49.%20iqro'.mp3"
  },
  {
    "id": 134,
    "title": "Memories",
    "artist": "Conan Gray",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//49.%20Memories.mp3"
  },
  {
    "id": 135,
    "title": "Penyangkalan",
    "artist": "For Revenge",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//49.%20Penyangkalan.mp3"
  },
  {
    "id": 136,
    "title": "Best Day Of My Life",
    "artist": "American Authors",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//5.%20Best%20Day%20Of%20My%20Life.mp3"
  },
  {
    "id": 137,
    "title": "Hingga Tua Bersama",
    "artist": "Rizky Febian",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//5.%20Hingga%20Tua%20Bersama.mp3"
  },
  {
    "id": 138,
    "title": "Mendung",
    "artist": "Yura Yunita/Idgitaf",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//5.%20Mendung.mp3"
  },
  {
    "id": 139,
    "title": "Perempuanku",
    "artist": "Irwansyah",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//5.%20Perempuanku.mp3"
  },
  {
    "id": 140,
    "title": "Nothing's New",
    "artist": "Rio Romeo",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//50.%20Nothing's%20New.mp3"
  },
  {
    "id": 141,
    "title": "Rindu ini tak pulang",
    "artist": "Deep Soul",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//50.%20Rindu%20ini%20tak%20pulang.mp3"
  },
  {
    "id": 142,
    "title": "SNAP",
    "artist": "Rosa Linn",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//50.%20SNAP.mp3"
  },
  {
    "id": 143,
    "title": "Tek It",
    "artist": "Cafuné",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//51.%20Tek%20It.mp3"
  },
  {
    "id": 144,
    "title": "Timpang",
    "artist": "Gloria Jessica/Ade Govinda",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//51.%20Timpang.mp3"
  },
  {
    "id": 145,
    "title": "I Think They Call This Love",
    "artist": "Elliot James Reay",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//52.%20I%20Think%20They%20Call%20This%20Love.mp3"
  },
  {
    "id": 146,
    "title": "Jalan Kita Beda",
    "artist": "Rafa Purnama",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//52.%20Jalan%20Kita%20Beda.mp3"
  },
  {
    "id": 147,
    "title": "Multo",
    "artist": "Cup of Joe",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//52.%20Multo.mp3"
  },
  {
    "id": 148,
    "title": "Berapa Kali Kita Akan Saling Memaafkan",
    "artist": "Pamungkas",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//53.%20Berapa%20Kali%20Kita%20Akan%20Saling%20Memaafkan.mp3"
  },
  {
    "id": 149,
    "title": "Mary On A Cross",
    "artist": "Ghost",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//53.%20Mary%20On%20A%20Cross.mp3"
  },
  {
    "id": 150,
    "title": "Penyangkalan",
    "artist": "For Revenge",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//53.%20Penyangkalan.mp3"
  },
  {
    "id": 151,
    "title": "Dunia Yang Nanti",
    "artist": "Raim Laode",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//54.%20Dunia%20Yang%20Nanti.mp3"
  },
  {
    "id": 152,
    "title": "Notion",
    "artist": "The Rare Occasions",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//54.%20Notion.mp3"
  },
  {
    "id": 153,
    "title": "Satu Atap Langit",
    "artist": "Limaraya",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//54.%20Satu%20Atap%20Langit.mp3"
  },
  {
    "id": 154,
    "title": "Bertaut",
    "artist": "Nadin Amizah",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//55.%20Bertaut.mp3"
  },
  {
    "id": 155,
    "title": "Cry",
    "artist": "Cigarettes After Sex",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//55.%20Cry.mp3"
  },
  {
    "id": 156,
    "title": "Terlalu Lama",
    "artist": "Vierra",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//55.%20Terlalu%20Lama.mp3"
  },
  {
    "id": 157,
    "title": "Lowkey",
    "artist": "Sunshine Girl",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//56.%20Lowkey.mp3"
  },
  {
    "id": 158,
    "title": "On Top Of The World",
    "artist": "Imagine Dragons",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//56.%20On%20Top%20Of%20The%20World.mp3"
  },
  {
    "id": 159,
    "title": "Seluruh Nafas Ini",
    "artist": "Last Child/Gisel",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//56.%20Seluruh%20Nafas%20Ini.mp3"
  },
  {
    "id": 160,
    "title": "BIRDS OF A FEATHER",
    "artist": "Billie Eilish",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//57.%20BIRDS%20OF%20A%20FEATHER.mp3"
  },
  {
    "id": 161,
    "title": "Freaks",
    "artist": "Surf Curse",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//57.%20Freaks.mp3"
  },
  {
    "id": 162,
    "title": "Terpukau",
    "artist": "Astrid",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//57.%20Terpukau.mp3"
  },
  {
    "id": 163,
    "title": "Biarkanlah Aku Pergi",
    "artist": "Duo Antonia",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//58.%20Biarkanlah%20Aku%20Pergi.mp3"
  },
  {
    "id": 164,
    "title": "Disco",
    "artist": "Surf Curse",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//58.%20Disco.mp3"
  },
  {
    "id": 165,
    "title": "lovely (with Khalid)",
    "artist": "Billie Eilish/Khalid",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//58.%20lovely%20(with%20Khalid).mp3"
  },
  {
    "id": 166,
    "title": "Dark Red",
    "artist": "Steve Lacy",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//59.%20Dark%20Red.mp3"
  },
  {
    "id": 167,
    "title": "Kembali Pulang",
    "artist": "Suara Kayu/Feby Putri",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//59.%20Kembali%20Pulang.mp3"
  },
  {
    "id": 168,
    "title": "Surat Cinta Untuk Starla",
    "artist": "Virgoun",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//59.%20Surat%20Cinta%20Untuk%20Starla.mp3"
  },
  {
    "id": 169,
    "title": "Berdua Lebih Baik",
    "artist": "Acha Septriasa",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//6.%20Berdua%20Lebih%20Baik.mp3"
  },
  {
    "id": 170,
    "title": "changes",
    "artist": "XXXTENTACION",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//6.%20changes.mp3"
  },
  {
    "id": 171,
    "title": "kota ini tak sama tanpamu",
    "artist": "Nadhif Basalamah",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//6.%20kota%20ini%20tak%20sama%20tanpamu.mp3"
  },
  {
    "id": 172,
    "title": "golden hour",
    "artist": "JVKE",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//60.%20golden%20hour.mp3"
  },
  {
    "id": 173,
    "title": "Runaway",
    "artist": "AURORA",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//60.%20Runaway.mp3"
  },
  {
    "id": 174,
    "title": "Rahasia Hati",
    "artist": "Nidji",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//61.%20Rahasia%20Hati.mp3"
  },
  {
    "id": 175,
    "title": "Sweater Weather",
    "artist": "The Neighbourhood",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//61.%20Sweater%20Weather.mp3"
  },
  {
    "id": 176,
    "title": "THE SHADE",
    "artist": "Rex Orange County",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//61.%20THE%20SHADE.mp3"
  },
  {
    "id": 177,
    "title": "Come Inside Of My Heart",
    "artist": "IV OF SPADES",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//62.%20Come%20Inside%20Of%20My%20Heart.mp3"
  },
  {
    "id": 178,
    "title": "Disarankan di Bandung",
    "artist": "Dongker/Jason Ranti",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//62.%20Disarankan%20di%20Bandung.mp3"
  },
  {
    "id": 179,
    "title": "Seamin Tak Seiman",
    "artist": "Mahen",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//62.%20Seamin%20Tak%20Seiman.mp3"
  },
  {
    "id": 180,
    "title": "Her Sight",
    "artist": "Llayton",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//63.%20Her%20Sight.mp3"
  },
  {
    "id": 181,
    "title": "Jakarta Hari Ini",
    "artist": "For Revenge/Stereo Wall",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//63.%20Jakarta%20Hari%20Ini.mp3"
  },
  {
    "id": 182,
    "title": "Make You Mine",
    "artist": "PUBLIC",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//63.%20Make%20You%20Mine.mp3"
  },
  {
    "id": 183,
    "title": "Sedia Aku Sebelum Hujan",
    "artist": "Idgitaf",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//64.%20Sedia%20Aku%20Sebelum%20Hujan.mp3"
  },
  {
    "id": 184,
    "title": "Someone To Stay",
    "artist": "Vancouver Sleep Clinic",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//64.%20Someone%20To%20Stay.mp3"
  },
  {
    "id": 185,
    "title": "Arti Kehilangan",
    "artist": "Deep Soul",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//65.%20Arti%20Kehilangan.mp3"
  },
  {
    "id": 186,
    "title": "K.",
    "artist": "Cigarettes After Sex",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//65.%20K..mp3"
  },
  {
    "id": 187,
    "title": "Kita usahakan rumah itu",
    "artist": "Sal Priadi",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//65.%20Kita%20usahakan%20rumah%20itu.mp3"
  },
  {
    "id": 188,
    "title": "blue",
    "artist": "yung kai",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//66.%20blue.mp3"
  },
  {
    "id": 189,
    "title": "Dunia Yang Nanti",
    "artist": "Raim Laode",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//66.%20Dunia%20Yang%20Nanti.mp3"
  },
  {
    "id": 190,
    "title": "Rumah",
    "artist": "Salma Salsabil",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//66.%20Rumah.mp3"
  },
  {
    "id": 191,
    "title": "Bawa Dia Kembali",
    "artist": "Mahalini",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//67.%20Bawa%20Dia%20Kembali.mp3"
  },
  {
    "id": 192,
    "title": "DJ 6.0",
    "artist": "Gunros",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//67.%20DJ%206.0.mp3"
  },
  {
    "id": 193,
    "title": "The Scientist",
    "artist": "Coldplay",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//67.%20The%20Scientist.mp3"
  },
  {
    "id": 194,
    "title": "Bawa Dia Kembali",
    "artist": "Mahalini",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//68.%20Bawa%20Dia%20Kembali.mp3"
  },
  {
    "id": 195,
    "title": "Fix You",
    "artist": "Coldplay",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//68.%20Fix%20You.mp3"
  },
  {
    "id": 196,
    "title": "Mangu",
    "artist": "Fourtwnty/Charita Utami",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//68.%20Mangu.mp3"
  },
  {
    "id": 197,
    "title": "Patience",
    "artist": "Take That",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//69.%20Patience.mp3"
  },
  {
    "id": 198,
    "title": "Pesan Terakhir",
    "artist": "Lyodra",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//69.%20Pesan%20Terakhir.mp3"
  },
  {
    "id": 199,
    "title": "Sadrah",
    "artist": "For Revenge",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//69.%20Sadrah.mp3"
  },
  {
    "id": 200,
    "title": "Bahagia Lagi",
    "artist": "Piche Kota",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//7.%20Bahagia%20Lagi.mp3"
  },
  {
    "id": 201,
    "title": "Hari ini,Esok dan Seterusnya/HES",
    "artist": "Nirina Zubir",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//7.%20Hari%20ini%2CEsok%20dan%20Seterusnya_HES.mp3"
  },
  {
    "id": 202,
    "title": "Seandainya",
    "artist": "Vierra",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//7.%20Seandainya.mp3"
  },
  {
    "id": 203,
    "title": "Legawa",
    "artist": "Limaraya",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//70.%20Legawa.mp3"
  },
  {
    "id": 204,
    "title": "Sailor Song",
    "artist": "Gigi Perez",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//70.%20Sailor%20Song.mp3"
  },
  {
    "id": 205,
    "title": "Tak Ingin Usai",
    "artist": "Keisya Levronka",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//70.%20Tak%20Ingin%20Usai.mp3"
  },
  {
    "id": 206,
    "title": "Bahagia Lagi",
    "artist": "Piche Kota",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//71.%20Bahagia%20Lagi.mp3"
  },
  {
    "id": 207,
    "title": "Hati-Hati di Jalan",
    "artist": "Tulus",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//71.%20Hati-Hati%20di%20Jalan.mp3"
  },
  {
    "id": 208,
    "title": "Young Black & Rich",
    "artist": "Melly Mike",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//71.%20Young%20Black%20%26%20Rich.mp3"
  },
  {
    "id": 209,
    "title": "bergema sampai selamanya",
    "artist": "Nadhif Basalamah",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//72.%20bergema%20sampai%20selamanya.mp3"
  },
  {
    "id": 210,
    "title": "i like the way you kiss me",
    "artist": "Artemas",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//72.%20i%20like%20the%20way%20you%20kiss%20me.mp3"
  },
  {
    "id": 211,
    "title": "Terus Berlari",
    "artist": "RANGR",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//72.%20Terus%20Berlari.mp3"
  },
  {
    "id": 212,
    "title": "Happy Nation - 2015 Remastered",
    "artist": "Ace of Base",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//73.%20Happy%20Nation%20-%202015%20Remastered.mp3"
  },
  {
    "id": 213,
    "title": "Kita Lewati Berdua",
    "artist": "Overnight",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//73.%20Kita%20Lewati%20Berdua.mp3"
  },
  {
    "id": 214,
    "title": "Sedia Aku Sebelum Hujan",
    "artist": "Idgitaf",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//73.%20Sedia%20Aku%20Sebelum%20Hujan.mp3"
  },
  {
    "id": 215,
    "title": "Drip Too Hard",
    "artist": "Lil Baby/Gunna",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//74.%20Drip%20Too%20Hard.mp3"
  },
  {
    "id": 216,
    "title": "kota ini tak sama tanpamu",
    "artist": "Nadhif Basalamah",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//74.%20kota%20ini%20tak%20sama%20tanpamu.mp3"
  },
  {
    "id": 217,
    "title": "Daylight",
    "artist": "David Kushner",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//75.%20Daylight.mp3"
  },
  {
    "id": 218,
    "title": "Lihat Kebunku (Taman Bunga)",
    "artist": "Aku Jeje",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//75.%20Lihat%20Kebunku%20(Taman%20Bunga).mp3"
  },
  {
    "id": 219,
    "title": "penjaga hati",
    "artist": "Nadhif Basalamah",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//75.%20penjaga%20hati.mp3"
  },
  {
    "id": 220,
    "title": "Bayangku Hilang",
    "artist": "Pelan Saja",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//76.%20Bayangku%20Hilang.mp3"
  },
  {
    "id": 221,
    "title": "Foto kita blur",
    "artist": "Sal Priadi",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//76.%20Foto%20kita%20blur.mp3"
  },
  {
    "id": 222,
    "title": "Timeless (feat Playboi Carti)",
    "artist": "The Weeknd/Playboi Carti",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//76.%20Timeless%20(feat%20Playboi%20Carti).mp3"
  },
  {
    "id": 223,
    "title": "mejikuhibiniu",
    "artist": "Tenxi/Suisei/Jemsii",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//77.%20mejikuhibiniu.mp3"
  },
  {
    "id": 224,
    "title": "Starboy",
    "artist": "The Weeknd/Daft Punk",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//77.%20Starboy.mp3"
  },
  {
    "id": 225,
    "title": "Titik Nadir (feat. Monita Tahalea)",
    "artist": "Kahitna/Monita Tahalea",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//77.%20Titik%20Nadir%20(feat.%20Monita%20Tahalea).mp3"
  },
  {
    "id": 226,
    "title": "DICHOTOMY (The Chosen Ones)",
    "artist": "Gabriel Audee/Danny James (Lil Dee)/Saule Ilona Vaida",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//78.%20DICHOTOMY%20(The%20Chosen%20Ones).mp3"
  },
  {
    "id": 227,
    "title": "Garam & Madu (Sakit Dadaku)",
    "artist": "Tenxi/Jemsii/Naykilla",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//78.%20Garam%20%26%20Madu%20(Sakit%20Dadaku).mp3"
  },
  {
    "id": 228,
    "title": "Judas",
    "artist": "Lady Gaga",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//78.%20Judas.mp3"
  },
  {
    "id": 229,
    "title": "Before You Go",
    "artist": "Lewis Capaldi",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//79.%20Before%20You%20Go.mp3"
  },
  {
    "id": 230,
    "title": "Fast Ava",
    "artist": "Famy",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//79.%20Fast%20Ava.mp3"
  },
  {
    "id": 231,
    "title": "Terbuang Dalam Waktu",
    "artist": "Barasuara",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//79.%20Terbuang%20Dalam%20Waktu.mp3"
  },
  {
    "id": 232,
    "title": "Lifeline",
    "artist": "Dauble",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//8.%20Lifeline.mp3"
  },
  {
    "id": 233,
    "title": "My Heart - Guitar Version",
    "artist": "Irwansyah & Acha Septriasa",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//8.%20My%20Heart%20-%20Guitar%20Version.mp3"
  },
  {
    "id": 234,
    "title": "Somewhere Only We Know",
    "artist": "Keane",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//8.%20Somewhere%20Only%20We%20Know.mp3"
  },
  {
    "id": 235,
    "title": "Surat Cinta Untuk Starla",
    "artist": "Virgoun",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//8.%20Surat%20Cinta%20Untuk%20Starla.mp3"
  },
  {
    "id": 236,
    "title": "1000X",
    "artist": "Ghea Indrawari",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//80.%201000X.mp3"
  },
  {
    "id": 237,
    "title": "Kasih Aba Aba",
    "artist": "Naykilla/Tenxi/Jemsii",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//80.%20Kasih%20Aba%20Aba.mp3"
  },
  {
    "id": 238,
    "title": "Show Me Love (with Tyla)",
    "artist": "WizTheMc/bees & honey/Tyla",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//80.%20Show%20Me%20Love%20(with%20Tyla).mp3"
  },
  {
    "id": 239,
    "title": "Lifeline - slowed down",
    "artist": "Dauble",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//81.%20Lifeline%20-%20slowed%20down.mp3"
  },
  {
    "id": 240,
    "title": "Ordinary",
    "artist": "Alex Warren",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//81.%20Ordinary.mp3"
  },
  {
    "id": 241,
    "title": "SO ASU",
    "artist": "Naykilla",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//81.%20SO%20ASU.mp3"
  },
  {
    "id": 242,
    "title": "back to friends",
    "artist": "sombr",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//82.%20back%20to%20friends.mp3"
  },
  {
    "id": 243,
    "title": "Bintang 5",
    "artist": "Tenxi/Jemsii",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//82.%20Bintang%205.mp3"
  },
  {
    "id": 244,
    "title": "Kita Usahakan Lagi",
    "artist": "Batas Senja",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//82.%20Kita%20Usahakan%20Lagi.mp3"
  },
  {
    "id": 245,
    "title": "hoRRReg",
    "artist": "Tenxi/Naufal Syachreza/Jemsii",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//83.%20hoRRReg.mp3"
  },
  {
    "id": 246,
    "title": "Runtuh",
    "artist": "Feby Putri/Fiersa Besari",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//83.%20Runtuh.mp3"
  },
  {
    "id": 247,
    "title": "Walking Back Home",
    "artist": "FUR",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//83.%20Walking%20Back%20Home.mp3"
  },
  {
    "id": 248,
    "title": "Berubah",
    "artist": "Tenxi/Jemsii",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//84.%20Berubah.mp3"
  },
  {
    "id": 249,
    "title": "Blood on the Petals",
    "artist": "Wispy Noir",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//84.%20Blood%20on%20the%20Petals.mp3"
  },
  {
    "id": 250,
    "title": "Reckless",
    "artist": "Madison Beer",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//84.%20Reckless.mp3"
  },
  {
    "id": 251,
    "title": "Jatuh Suka",
    "artist": "Tulus",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//85.%20Jatuh%20Suka.mp3"
  },
  {
    "id": 252,
    "title": "Love Me Not (feat. Rex Orange County)",
    "artist": "Ravyn Lenae/Rex Orange County",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//85.%20Love%20Me%20Not%20(feat.%20Rex%20Orange%20County).mp3"
  },
  {
    "id": 253,
    "title": "TABOLA BALE",
    "artist": "Silet Open Up/Jacson Seran/Juan Reza/Diva Aurel",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//85.%20TABOLA%20BALE.mp3"
  },
  {
    "id": 254,
    "title": "Golden Brown - Slowed Down Version",
    "artist": "The Stranglers",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//86.%20Golden%20Brown%20-%20Slowed%20Down%20Version.mp3"
  },
  {
    "id": 255,
    "title": "Hingga Tua Bersama",
    "artist": "Rizky Febian",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//86.%20Hingga%20Tua%20Bersama.mp3"
  },
  {
    "id": 256,
    "title": "Hope",
    "artist": "XXXTENTACION",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//87.%20Hope.mp3"
  },
  {
    "id": 257,
    "title": "You Don't Own Me (feat. G-Eazy)",
    "artist": "SAYGRACE/G-Eazy",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//87.%20You%20Don't%20Own%20Me%20(feat.%20G-Eazy).mp3"
  },
  {
    "id": 258,
    "title": "Jocelyn Flores",
    "artist": "XXXTENTACION",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//88.%20Jocelyn%20Flores.mp3"
  },
  {
    "id": 259,
    "title": "Where'd All the Time Go?",
    "artist": "Dr. Dog",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//88.%20Where'd%20All%20the%20Time%20Go_.mp3"
  },
  {
    "id": 260,
    "title": "Be My Baby",
    "artist": "The Ronettes",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//89.%20Be%20My%20Baby.mp3"
  },
  {
    "id": 261,
    "title": "Moonlight",
    "artist": "XXXTENTACION",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//89.%20Moonlight.mp3"
  },
  {
    "id": 262,
    "title": "Car's Outside",
    "artist": "James Arthur",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//9.%20Car's%20Outside.mp3"
  },
  {
    "id": 263,
    "title": "Disarankan di Bandung",
    "artist": "Dongker/Jason Ranti",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//9.%20Disarankan%20di%20Bandung.mp3"
  },
  {
    "id": 264,
    "title": "Menghitung Hari 2",
    "artist": "Anda Perdana",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//9.%20Menghitung%20Hari%202.mp3"
  },
  {
    "id": 265,
    "title": "Pertiwi",
    "artist": "Yura Yunita",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//9.%20Pertiwi.mp3"
  },
  {
    "id": 266,
    "title": "Hope",
    "artist": "XXXTENTACION",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//90.%20Hope.mp3"
  },
  {
    "id": 267,
    "title": "I Thought I Saw Your Face Today",
    "artist": "She & Him",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//90.%20I%20Thought%20I%20Saw%20Your%20Face%20Today.mp3"
  },
  {
    "id": 268,
    "title": "her",
    "artist": "JVKE",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//91.%20her.mp3"
  },
  {
    "id": 269,
    "title": "Sempurna",
    "artist": "Andra & The Backbone",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//91.%20Sempurna.mp3"
  },
  {
    "id": 270,
    "title": "Jikalau Kau Cinta",
    "artist": "Judika",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//92.%20Jikalau%20Kau%20Cinta.mp3"
  },
  {
    "id": 271,
    "title": "Let Down",
    "artist": "Radiohead",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//92.%20Let%20Down.mp3"
  },
  {
    "id": 272,
    "title": "Bunga Maaf",
    "artist": "The Lantis",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//93.%20Bunga%20Maaf.mp3"
  },
  {
    "id": 273,
    "title": "Hurts",
    "artist": "Joy Crookes",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//93.%20Hurts.mp3"
  },
  {
    "id": 274,
    "title": "Bersenja Gurau",
    "artist": "Raim Laode",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//94.%20Bersenja%20Gurau.mp3"
  },
  {
    "id": 275,
    "title": "No. 1 Party Anthem",
    "artist": "Arctic Monkeys",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//94.%20No.%201%20Party%20Anthem.mp3"
  },
  {
    "id": 276,
    "title": "Hati-Hati di Jalan",
    "artist": "Tulus",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//95.%20Hati-Hati%20di%20Jalan.mp3"
  },
  {
    "id": 277,
    "title": "Gala bunga matahari",
    "artist": "Sal Priadi",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//96.%20Gala%20bunga%20matahari.mp3"
  },
  {
    "id": 278,
    "title": "Me and the Devil",
    "artist": "Soap&Skin",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//96.%20Me%20and%20the%20Devil.mp3"
  },
  {
    "id": 279,
    "title": "Paradise",
    "artist": "Coldplay",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//97.%20Paradise.mp3"
  },
  {
    "id": 280,
    "title": "Rasa ini",
    "artist": "Vierra",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//97.%20Rasa%20ini.mp3"
  },
  {
    "id": 281,
    "title": "Indecision",
    "artist": "Sampha",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//98.%20Indecision.mp3"
  },
  {
    "id": 282,
    "title": "Satu Bulan",
    "artist": "Bernadya",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//98.%20Satu%20Bulan.mp3"
  },
  {
    "id": 283,
    "title": "My Way",
    "artist": "Frank Sinatra",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//99.%20My%20Way.mp3"
  },
  {
    "id": 284,
    "title": "Sekuat Hatimu",
    "artist": "Last Child",
    "url": "https://flashers-coming-expired-folder.trycloudflare.com//99.%20Sekuat%20Hatimu.mp3"
  }
];

module.exports = songs;
