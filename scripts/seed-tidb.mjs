import { connect } from '@tidbcloud/serverless';

const url = 'mysql://35hDvHvf5aWjb46.root:694pxbVohLrMM5e2@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/wisata_indonesia';
const db = connect({ url });

const DESTINATIONS = [
  {
    id: "tasik-galunggung",
    name: "Gunung Galunggung & Kawah Panas",
    location: "Sukaratu, Kabupaten Tasikmalaya, Jawa Barat",
    price: 15000,
    rating: 4.8,
    reviews: 1420,
    image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&fm=webp&w=1200&q=75",
    description: "Ikon pariwisata Tasikmalaya dengan 620 anak tangga menuju kawah aktif, pemandangan danau kawah hijau toska, serta pemandian air panas alami Cipanas Galunggung yang menyegarkan.",
    category: "Alam & Gunung",
    features: JSON.stringify(["Kawah Hijau Toska", "Pemandian Air Panas", "Gardu Pandang Selfie", "Gazebo & Warung Kuliner", "Camping Ground"]),
    is_popular: true
  },
  {
    id: "tasik-teejay",
    name: "TeeJay Waterpark (Plaza Asia)",
    location: "Komplek Plaza Asia, Jl. HZ. Mustofa, Kota Tasikmalaya",
    price: 30000,
    rating: 4.7,
    reviews: 980,
    image_url: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&fm=webp&w=1200&q=75",
    description: "Taman rekreasi air modern terbesar di jantung Kota Tasikmalaya. Dilengkapi kolam ombak berpasir pantai, kolam arus santai, pagoda air ikonik, dan water slide spiral untuk seluruh keluarga.",
    category: "Wahana Air & Rekreasi",
    features: JSON.stringify(["Kolam Ombak Buatan", "Kolam Arus Lazy River", "Water Slide Spiral Ekstrem", "Kids Splash Playground", "Terhubung Mall Plaza Asia"]),
    is_popular: true
  },
  {
    id: "tasik-ampera",
    name: "Ampera Waterpark Ciawi",
    location: "Jl. Raya Sumedang - Tasikmalaya, Ciawi, Tasikmalaya",
    price: 25000,
    rating: 4.6,
    reviews: 730,
    image_url: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&fm=webp&w=1200&q=75",
    description: "Destinasi wisata air favorit di wilayah utara Tasikmalaya dengan kolam air hangat alami, ember tumpah raksasa, kolam atlet, serta spot selfie kastil megah yang ramah keluarga.",
    category: "Wahana Air & Rekreasi",
    features: JSON.stringify(["Kolam Air Hangat", "Ember Tumpah Raksasa", "Spot Foto Kastil Unik", "Kolam Arus Santai", "Kantin & Food Court"]),
    is_popular: true
  },
  {
    id: "tasik-situ-gede",
    name: "Situ Gede Tasikmalaya",
    location: "Mangkubumi, Kota Tasikmalaya, Jawa Barat",
    price: 5000,
    rating: 4.5,
    reviews: 860,
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&fm=webp&w=1200&q=75",
    description: "Danau alami seluas 47 hektar dengan pulau kecil di tengahnya yang asri. Pilihan terbaik untuk naik perahu wisata, menikmati ikan bakar khas Sunda, jogging, dan piknik keluarga.",
    category: "Danau & Rekreasi",
    features: JSON.stringify(["Perahu Wisata Keliling Danau", "Pulau Keramat Tengah Situ", "Kuliner Ikan Bakar Sunda", "Jogging Track Asri", "Gazebo Tepi Danau"]),
    is_popular: true
  },
  {
    id: "tasik-karaha-bodas",
    name: "Kawah Karaha Bodas",
    location: "Kadipaten, Kabupaten Tasikmalaya, Jawa Barat",
    price: 10000,
    rating: 4.6,
    reviews: 520,
    image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&fm=webp&w=1200&q=75",
    description: "Hamparan batuan putih alami dan fumarol belerang di tengah hutan pinus yang rindang. Suasana magis eksotis dengan udara sejuk, sangat cocok untuk fotografi dan trekking alam.",
    category: "Alam & Vulkanik",
    features: JSON.stringify(["Batuan Putih Alami", "Hutan Pinus Sejuk", "Spot Foto Eksotis", "Sumber Air Panas Belerang", "Jalur Trekking Teduh"]),
    is_popular: true
  },
  {
    id: "tasik-kampung-naga",
    name: "Kampung Naga Heritage",
    location: "Salawu, Kabupaten Tasikmalaya, Jawa Barat",
    price: 0,
    rating: 4.9,
    reviews: 1680,
    image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&fm=webp&w=1200&q=75",
    description: "Kampung adat tradisional Sunda yang lestari memegang teguh kearifan lokal. Rumah panggung beratap ijuk dan anyaman bambu berjejer rapi di lembah hijau yang damai tanpa listrik modern.",
    category: "Budaya & Edukasi",
    features: JSON.stringify(["Rumah Adat Sunda Asli", "Sungai Ciwulan yang Jernih", "Pemandu Adat Lokal", "Kerajinan Tangan Bambu", "Suasana Asri Tenang"]),
    is_popular: true
  },
  {
    id: "tasik-mangkubumi",
    name: "Taman Rekreasi Mangkubumi Park",
    location: "Jl. Mangkubumi - Indihiang, Kota Tasikmalaya",
    price: 15000,
    rating: 4.4,
    reviews: 410,
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&fm=webp&w=1200&q=75",
    description: "Wisata legendaris Tasikmalaya bernuansa alam terbuka dengan kolam renang berair pegunungan jernih, flying fox, gazebo rindang, dan taman bermain anak yang teduh.",
    category: "Wahana Air & Rekreasi",
    features: JSON.stringify(["Kolam Renang Berair Gunung", "Wahana Flying Fox", "Taman Bermain Anak", "Penginapan & Cottage Rindang", "Aula Pertemuan Luas"]),
    is_popular: false
  },
  {
    id: "tasik-pantai-karang-tawulan",
    name: "Pantai Karang Tawulan",
    location: "Kalapagenep, Cikalong, Kabupaten Tasikmalaya Selatan",
    price: 10000,
    rating: 4.7,
    reviews: 890,
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&fm=webp&w=1200&q=75",
    description: "Tebing karang memukau yang berbatasan langsung dengan Samudra Hindia. Padang rumput hijau di atas tebing sering dijuluki 'Tanah Lot versi Tasikmalaya'.",
    category: "Pantai & Bahari",
    features: JSON.stringify(["Tebing Karang Eksotis", "Padang Rumput Hijau Tepi Laut", "Spot Sunset Menawan", "Gazebo Tebing Pantai", "Spot Memancing Samudra"]),
    is_popular: true
  },
  {
    id: "national-raja-ampat",
    name: "Raja Ampat",
    location: "Papua Barat Daya",
    price: 500000,
    rating: 4.9,
    reviews: 1250,
    image_url: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&fm=webp&w=1200&q=75",
    description: "Kepulauan karst tropis paling memukau di dunia dengan keanekaragaman hayati laut terkaya di segitiga terumbu karang.",
    category: "Pantai & Bahari",
    features: JSON.stringify(["Snorkeling & Diving Kelas Dunia", "Pulau Karst Ikonik", "Pasir Timbul"]),
    is_popular: true
  },
  {
    id: "national-bromo",
    name: "Gunung Bromo",
    location: "Jawa Timur",
    price: 75000,
    rating: 4.8,
    reviews: 3200,
    image_url: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&fm=webp&w=1200&q=75",
    description: "Kaldera lautan pasir luas dengan pemandangan sunrise spektakuler dari Penanjakan dan kawah aktif yang megah.",
    category: "Alam & Gunung",
    features: JSON.stringify(["Sunrise Penanjakan", "Lautan Pasir Pasir Berbisik", "Kawah Aktif Bromo"]),
    is_popular: true
  },
  {
    id: "national-borobudur",
    name: "Candi Borobudur",
    location: "Magelang, Jawa Tengah",
    price: 50000,
    rating: 4.8,
    reviews: 4100,
    image_url: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&fm=webp&w=1200&q=75",
    description: "Candi Buddha terbesar di dunia peninggalan Dinasti Syailendra abad ke-8, mahakarya arsitektur batu warisan UNESCO.",
    category: "Budaya & Sejarah",
    features: JSON.stringify(["Relief Batu Bersejarah", "Stupa Induk Puncak", "Museum Karmawibhangga"]),
    is_popular: true
  }
];

async function seed() {
  console.log('Seeding destinations into TiDB Cloud...');
  for (const dest of DESTINATIONS) {
    await db.execute(
      `INSERT INTO destinations (id, name, location, price, rating, reviews, image_url, description, category, features, is_popular)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         name=VALUES(name), location=VALUES(location), price=VALUES(price),
         rating=VALUES(rating), reviews=VALUES(reviews), image_url=VALUES(image_url),
         description=VALUES(description), category=VALUES(category), features=VALUES(features),
         is_popular=VALUES(is_popular)`,
      [
        dest.id, dest.name, dest.location, dest.price, dest.rating, dest.reviews,
        dest.image_url, dest.description, dest.category, dest.features, dest.is_popular
      ]
    );
    console.log(`✓ Inserted/Updated: ${dest.name}`);
  }

  // Insert sample test booking
  await db.execute(
    `INSERT INTO bookings (id, booking_code, destination_id, destination_name, destination_location, destination_image, user_id, user_name, user_email, ticket_date, quantity, ticket_type, total_amount, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE status=VALUES(status)`,
    [
      "bk_seed_001", "BK-GALUNGGUNG-001", "tasik-galunggung",
      "Gunung Galunggung & Kawah Panas", "Sukaratu, Kabupaten Tasikmalaya",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&fm=webp&w=600&q=75",
      "usr_cust_1", "Fauzi Noor Syabani", "wisatawan@wisata.id",
      "2026-11-01", 2, "REGULER", 30000, "paid"
    ]
  );
  console.log('✓ Inserted sample booking: BK-GALUNGGUNG-001');

  const count = await db.execute('SELECT COUNT(*) as total FROM destinations');
  console.log('Total destinations in TiDB Cloud:', count);
}

seed().then(() => {
  console.log('TiDB Cloud database seeded successfully!');
  process.exit(0);
}).catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
