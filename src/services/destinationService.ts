import { tidbService } from './tidbService';

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Destination {
  id: string | number;
  name: string;
  location: string;
  city?: string;
  image: string;
  image_url?: string; // compatibility with backend format
  gallery?: string[];
  rating: number;
  reviews_count: number;
  price: string;
  raw_price: number;
  category: string;
  description: string;
  facilities: string[];
  operational_hours: string;
  ticket_types?: TicketType[];
  slug?: string;
  is_featured?: boolean;
  is_tasikmalaya?: boolean;
  created_at?: string;
}

export interface Booking {
  id: string;
  booking_code: string;
  user_id: string | number;
  user_name: string;
  user_email: string;
  destination_id: string | number;
  destination_name: string;
  destination_location: string;
  destination_image: string;
  ticket_type: string;
  ticket_date: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'used';
  payment_method: string;
  created_at: string;
}

const STORAGE_KEY = 'wisata_destinations_v2';
const BOOKINGS_KEY = 'wisata_bookings_v2';

export const INITIAL_DESTINATIONS: Destination[] = [
  // --- TASIKMALAYA FOCUS ---
  {
    id: "galunggung-tasik",
    name: "Gunung Galunggung & Pemandian Air Panas",
    location: "Linggajati, Sukaratu, Kabupaten Tasikmalaya",
    city: "Tasikmalaya",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&fm=webp&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&fm=webp&w=800&q=80",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&fm=webp&w=800&q=80"
    ],
    rating: 4.8,
    reviews_count: 840,
    price: "Rp 15.000",
    raw_price: 15000,
    category: "Wisata Alam",
    description: "Gunung Galunggung menawarkan keindahan kawah vulkanik dan danau hijau toska di puncaknya yang dicapai lewat 620 anak tangga ikonik. Nikmati pula sensasi berendam air belerang alami di Pemandian Air Panas Cipanas Galunggung yang menyegarkan tubuh.",
    facilities: ["620 Anak Tangga Kawah", "Pemandian Air Panas Alami", "Gardu Pandang Sunset", "Area Camping & Outbound", "Warung Kuliner Khas Sunda", "Mushola & Toilet", "Parkir Luas"],
    operational_hours: "Kawah: 07.00 - 17.00 WIB | Pemandian Air Panas: 24 Jam",
    ticket_types: [
      { id: "kwh-weekday", name: "Tiket Kawah (Weekday)", price: 15000, description: "Tiket akses kawah 620 anak tangga" },
      { id: "kwh-weekend", name: "Tiket Kawah (Weekend/Libur)", price: 20000, description: "Tiket akhir pekan dan libur nasional" },
      { id: "cipanas-combo", name: "Paket Combo Kawah + Cipanas Air Panas", price: 25000, description: "Akses lengkap kawah dan kolam rendam air panas" }
    ],
    slug: "gunung-galunggung-tasikmalaya",
    is_featured: true,
    is_tasikmalaya: true
  },
  {
    id: "teejay-waterpark",
    name: "TeeJay Waterpark (Plaza Asia)",
    location: "Komplek Plaza Asia, Tugujaya, Cihideung, Kota Tasikmalaya",
    city: "Tasikmalaya",
    image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&fm=webp&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&fm=webp&w=800&q=80",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&fm=webp&w=800&q=80"
    ],
    rating: 4.7,
    reviews_count: 1250,
    price: "Rp 30.000",
    raw_price: 30000,
    category: "Wisata Hiburan",
    description: "TeeJay Waterpark adalah arena rekreasi air dan kolam renang modern terbesar di jantung Kota Tasikmalaya. Dilengkapi Kolam Ombak buatan, Kolam Arus santai, Pagoda Slide, Tube Slide bertingkat, serta kolam dangkal anak dengan ember tumpah raksasa.",
    facilities: ["Kolam Ombak (Wave Pool)", "Kolam Arus (Lazy River)", "Water Slider & Spiral Tube", "Kolam Renang Anak & Ember Tumpah", "Locker Room & Bilas Hangat", "Food Court & Gazebo", "Akses Langsung Plaza Asia"],
    operational_hours: "Senin - Minggu: 09.00 - 18.00 WIB",
    ticket_types: [
      { id: "tj-weekday", name: "Tiket Reguler (Senin - Jumat)", price: 30000, description: "Semua wahana air weekday" },
      { id: "tj-weekend", name: "Tiket Weekend & Libur Nasional", price: 40000, description: "Akses wahana air di akhir pekan" },
      { id: "tj-family", name: "Paket Keluarga (4 Orang)", price: 120000, description: "Hemat untuk liburan keluarga termasuk 1 pelampung" }
    ],
    slug: "teejay-waterpark-tasikmalaya",
    is_featured: true,
    is_tasikmalaya: true
  },
  {
    id: "ampera-waterpark",
    name: "Ampera Waterpark Ciawi",
    location: "Jl. Raya Ciawi - Tasikmalaya KM 5, Pamoyanan, Kadipaten, Tasikmalaya",
    city: "Tasikmalaya",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&fm=webp&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&fm=webp&w=800&q=80"
    ],
    rating: 4.6,
    reviews_count: 670,
    price: "Rp 25.000",
    raw_price: 25000,
    category: "Wisata Hiburan",
    description: "Ampera Waterpark menyajikan keseruan berenang dengan paduan unik kolam air hangat alami dan kolam renang dingin berwahana. Ikon teko raksasa melayang, kastil dongeng, pesta busa (foam party), dan kolam ombak menjadi primadona wisatawan keluarga.",
    facilities: ["Kolam Air Hangat Alami", "Pesta Busa (Foam Party)", "Kolam Ombak", "Kolam Olympic Renang Dewasa", "Kastil Selfie 3D", "Resto Ampera Sunda"],
    operational_hours: "Setiap Hari: 08.00 - 17.00 WIB",
    ticket_types: [
      { id: "amp-reguler", name: "Tiket Masuk Reguler", price: 25000, description: "Akses kolam renang dan wahana standar" },
      { id: "amp-allin", name: "Tiket Terusan Air Hangat + Ombak", price: 35000, description: "Akses penuh kolam air panas, kolam ombak & busa" }
    ],
    slug: "ampera-waterpark-tasikmalaya",
    is_featured: true,
    is_tasikmalaya: true
  },
  {
    id: "mangkubumi-park",
    name: "Taman Rekreasi & Kolam Renang Mangkubumi",
    location: "Jl. Raya Mangkubumi No. 62, Mangkubumi, Kota Tasikmalaya",
    city: "Tasikmalaya",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&fm=webp&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&fm=webp&w=800&q=80"
    ],
    rating: 4.5,
    reviews_count: 510,
    price: "Rp 25.000",
    raw_price: 25000,
    category: "Wisata Alam",
    description: "Taman Rekreasi Mangkubumi merupakan destinasi kolam renang alam legendaris di Tasikmalaya dengan rimbun pepohonan hutan kota yang sejuk. Sangat pas untuk wisata santai, olahraga renang, maupun piknik keluarga.",
    facilities: ["Kolam Renang Standar Lintasan", "Water Slider Anak", "Panggung Musik Hiburan", "Hutan Pinus & Gazebo Piknik", "Flying Fox & Playground"],
    operational_hours: "Setiap Hari: 07.00 - 17.00 WIB",
    ticket_types: [
      { id: "mkb-tiket", name: "Tiket Masuk + Kolam Renang", price: 25000, description: "Akses masuk taman dan seluruh kolam renang" }
    ],
    slug: "taman-rekreasi-mangkubumi-tasikmalaya",
    is_featured: false,
    is_tasikmalaya: true
  },
  {
    id: "karaha-bodas",
    name: "Kawah Karaha Bodas",
    location: "Desa Kadipaten, Kecamatan Kadipaten, Tasikmalaya",
    city: "Tasikmalaya",
    image: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?auto=format&fit=crop&fm=webp&w=800&q=80",
    rating: 4.7,
    reviews_count: 420,
    price: "Rp 10.000",
    raw_price: 10000,
    category: "Wisata Alam",
    description: "Kawah fumarol belerang vulkanik putih alami yang dikelilingi hutan pinus nan asri dan sejuk. Suasana hening dan panorama bebatuan putih berkabut menjadikannya surga fotografi alam.",
    facilities: ["Jembatan Titian Kayu Kawah", "Spot Foto Estetik Pinus", "Area Camping Ground", "Warung Kopi Tradisional"],
    operational_hours: "Setiap Hari: 07.00 - 17.00 WIB",
    ticket_types: [
      { id: "kb-masuk", name: "Tiket Masuk Kawah", price: 10000, description: "Tiket masuk kawasan geowisata Karaha Bodas" }
    ],
    slug: "kawah-karaha-bodas-tasikmalaya",
    is_featured: false,
    is_tasikmalaya: true
  },
  {
    id: "curug-dengdeng",
    name: "Curug Dengdeng (Niagara Mini Tasik)",
    location: "Desa Cogreg, Cikatomas, Kabupaten Tasikmalaya",
    city: "Tasikmalaya",
    image: "https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&fm=webp&w=800&q=80",
    rating: 4.6,
    reviews_count: 310,
    price: "Rp 15.000",
    raw_price: 15000,
    category: "Wisata Alam",
    description: "Air terjun berundak 3 tingkat melebar yang spektakuler bak miniatur air terjun Niagara di tengah hijaunya lembah Cikatomas Tasikmalaya.",
    facilities: ["Trekking Bertangga", "Spot Gardu Pandang", "Warung Kelapa Muda", "Toilet & Mushola"],
    operational_hours: "Setiap Hari: 07.30 - 17.00 WIB",
    ticket_types: [
      { id: "cd-masuk", name: "Tiket Masuk Curug", price: 15000, description: "Tiket masuk kawasan air terjun Curug Dengdeng" }
    ],
    slug: "curug-dengdeng-tasikmalaya",
    is_featured: false,
    is_tasikmalaya: true
  },
  {
    id: "kampung-naga",
    name: "Kampung Naga Adat Sunda",
    location: "Desa Neglasari, Salawu, Kabupaten Tasikmalaya",
    city: "Tasikmalaya",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&fm=webp&w=800&q=80",
    rating: 4.9,
    reviews_count: 980,
    price: "Rp 15.000",
    raw_price: 15000,
    category: "Wisata Budaya",
    description: "Perkampungan adat Sunda yang hidup harmonis dengan alam dan memegang teguh tradisi leluhur tanpa aliran listrik modern di lembah Sungai Ciwulan.",
    facilities: ["Sentra Anyaman Bambu", "Pemandu Adat Lokal", "Toilet Pintu Masuk", "Warung Cinderamata Tradisional"],
    operational_hours: "Setiap Hari: 08.00 - 16.30 WIB",
    ticket_types: [
      { id: "kn-donasi", name: "Tiket Donasi Budaya & Kebersihan", price: 15000, description: "Dukungan pelestarian adat Kampung Naga" }
    ],
    slug: "kampung-naga-tasikmalaya",
    is_featured: true,
    is_tasikmalaya: true
  },
  {
    id: "karang-tawulan",
    name: "Pantai Karang Tawulan",
    location: "Desa Cimanuk, Cikalong, Tasikmalaya Selatan",
    city: "Tasikmalaya",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&fm=webp&w=800&q=80",
    rating: 4.8,
    reviews_count: 620,
    price: "Rp 15.000",
    raw_price: 15000,
    category: "Wisata Alam",
    description: "Pantai tebing karang memesona dengan hamparan padang rumput hijau menjorok ke Samudra Hindia dan panorama sunset spektakuler ala Tanah Lot.",
    facilities: ["Gazebo Tebing Pantai", "Gardu Pandang Sunset", "Warung Seafood Segar", "Area Camping"],
    operational_hours: "Setiap Hari: 06.00 - 18.00 WIB",
    ticket_types: [
      { id: "kt-masuk", name: "Tiket Masuk Pantai", price: 15000, description: "Tiket masuk kawasan wisata Karang Tawulan" }
    ],
    slug: "pantai-karang-tawulan-tasikmalaya",
    is_featured: false,
    is_tasikmalaya: true
  },
  {
    id: "situ-gede",
    name: "Danau Situ Gede Tasikmalaya",
    location: "Linggajaya, Mangkubumi, Kota Tasikmalaya",
    city: "Tasikmalaya",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&fm=webp&w=800&q=80",
    rating: 4.5,
    reviews_count: 530,
    price: "Rp 10.000",
    raw_price: 10000,
    category: "Wisata Alam",
    description: "Danau rekreasi seluas 47 hektar dengan pulau kecil rimbun di tengahnya. Menawarkan pengalaman mengelilingi danau dengan perahu dan santap ikan bakar khas Sunda.",
    facilities: ["Perahu Kayu & Bebek Gowes", "Jogging Track Tepi Danau", "Pusat Ikan Bakar Sunda", "Gazebo Santai"],
    operational_hours: "Setiap Hari: 06.00 - 18.00 WIB",
    ticket_types: [
      { id: "sg-masuk", name: "Tiket Masuk Kawasan", price: 10000, description: "Tiket masuk kawasan Situ Gede" }
    ],
    slug: "situ-gede-tasikmalaya",
    is_featured: false,
    is_tasikmalaya: true
  },

  // --- DESTINASI NASIONAL POPULER ---
  {
    id: "pantai-kuta",
    name: "Pantai Kuta",
    location: "Badung, Bali",
    city: "Bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&fm=webp&w=800&q=80",
    rating: 4.7,
    reviews_count: 3200,
    price: "Rp 50.000",
    raw_price: 50000,
    category: "Wisata Alam",
    description: "Pantai berpasir putih legendaris di Bali dengan ombak surfing yang ramah pemula dan panorama matahari terbenam yang memukau dunia.",
    facilities: ["Sewa Papan Selancar", "Payung Pantai", "Kafe & Restoran", "Toilet & Bilas", "Penyelamat Pantai (Lifeguard)"],
    operational_hours: "Buka 24 Jam",
    ticket_types: [
      { id: "kt-tiket", name: "Tiket Masuk & Konservasi", price: 50000, description: "Akses pantai dan fasilitas umum" }
    ],
    slug: "pantai-kuta",
    is_featured: true
  },
  {
    id: "candi-borobudur",
    name: "Candi Borobudur",
    location: "Magelang, Jawa Tengah",
    city: "Magelang",
    image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&fm=webp&w=800&q=80",
    rating: 4.9,
    reviews_count: 4500,
    price: "Rp 85.000",
    raw_price: 85000,
    category: "Wisata Sejarah",
    description: "Candi Buddha terbesar di dunia yang merupakan Situs Warisan Dunia UNESCO, menampilkan arsitektur relief batu yang agung nan memesona.",
    facilities: ["Museum Borobudur", "Pemandu Berlisensi", "Taman Asri", "Kereta Wisata", "Pusat Oleh-Oleh"],
    operational_hours: "Setiap Hari: 06.30 - 17.00 WIB",
    ticket_types: [
      { id: "brb-reg", name: "Tiket Pelataran Candi (Domestik)", price: 85000, description: "Tiket masuk halaman dan pelataran Borobudur" },
      { id: "brb-naik", name: "Tiket Naik Monumen Candi", price: 120000, description: "Termasuk pemandu dan sandal Upanat" }
    ],
    slug: "candi-borobudur",
    is_featured: true
  },
  {
    id: "raja-ampat",
    name: "Raja Ampat",
    location: "Kepulauan Raja Ampat, Papua Barat Daya",
    city: "Papua",
    image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&fm=webp&w=800&q=80",
    rating: 5.0,
    reviews_count: 1800,
    price: "Rp 250.000",
    raw_price: 250000,
    category: "Wisata Alam",
    description: "Gugusan kepulauan karang spektakuler dengan keanekaragaman hayati laut terkaya di planet bumi. Surga menyelam dan snorkeling dunia.",
    facilities: ["Pusat Diving & Snorkeling", "Speedboat Antar Pulau", "Homestay Terapung", "Pemandu Lokal"],
    operational_hours: "Buka 24 Jam",
    ticket_types: [
      { id: "ra-pin", name: "Tiket Masuk & Konservasi Lingkungan", price: 250000, description: "Kartu izin masuk kawasan konservasi Raja Ampat" }
    ],
    slug: "raja-ampat",
    is_featured: true
  },
  {
    id: "gunung-bromo",
    name: "Gunung Bromo",
    location: "Probolinggo, Pasuruan, Jawa Timur",
    city: "Jawa Timur",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&fm=webp&w=800&q=80",
    rating: 4.8,
    reviews_count: 3600,
    price: "Rp 120.000",
    raw_price: 120000,
    category: "Wisata Alam",
    description: "Gunung berapi aktif dengan lautan pasir berbisik seluas 10 kilometer persegi, panorama kawah berasap, dan golden sunrise di Bukit Penanjakan.",
    facilities: ["Sewa Jeep Hardtop", "Tunggang Kuda Bromo", "Warung Hangat & Kopi", "Gardu Pandang Penanjakan"],
    operational_hours: "Buka 24 Jam",
    ticket_types: [
      { id: "brm-weekday", name: "Tiket Masuk TNBTS (Weekday)", price: 120000, description: "Tiket masuk resmi kawasan Gunung Bromo" },
      { id: "brm-weekend", name: "Tiket Masuk TNBTS (Weekend)", price: 150000, description: "Tiket akhir pekan dan hari libur" }
    ],
    slug: "gunung-bromo",
    is_featured: true
  },
  {
    id: "kawah-putih",
    name: "Kawah Putih Ciwidey",
    location: "Ciwidey, Bandung, Jawa Barat",
    city: "Bandung",
    image: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?auto=format&fit=crop&fm=webp&w=800&q=80",
    rating: 4.6,
    reviews_count: 2200,
    price: "Rp 75.000",
    raw_price: 75000,
    category: "Wisata Alam",
    description: "Danau kawah vulkanik berwarna putih kehijauan yang dramatis di ketinggian 2.434 mdpl dengan udara pegunungan Bandung yang sejuk menyegarkan.",
    facilities: ["Ontang-Anting Shuttle", "Dermaga Ponton Kawah", "Skywalk Cantigi", "Spot Foto Prewedding", "Toilet & Mushola"],
    operational_hours: "Setiap Hari: 07.00 - 17.00 WIB",
    ticket_types: [
      { id: "kp-reguler", name: "Tiket Masuk + Shuttle Ontang-Anting", price: 75000, description: "Akses lengkap antar jemput gerbang ke kawah" }
    ],
    slug: "kawah-putih",
    is_featured: true
  },
  {
    id: "taman-mini",
    name: "Taman Mini Indonesia Indah (TMII)",
    location: "Jakarta Timur, DKI Jakarta",
    city: "Jakarta",
    image: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&fm=webp&w=800&q=80",
    rating: 4.7,
    reviews_count: 3100,
    price: "Rp 25.000",
    raw_price: 25000,
    category: "Wisata Budaya",
    description: "Wahana rekreasi kebudayaan nusantara seluas 150 hektar dengan anjungan rumah adat dari seluruh provinsi Indonesia, danau miniatur nusantara, dan kereta gantung.",
    facilities: ["Kereta Gantung", "Anjungan Rumah Adat Nusantara", "Museum Indonesia", "Jalur Sepeda Ramah Pejalan", "Danau Kepulauan Indonesia"],
    operational_hours: "Setiap Hari: 06.00 - 20.00 WIB",
    ticket_types: [
      { id: "tmii-reg", name: "Tiket Masuk TMII", price: 25000, description: "Akses seluruh anjungan daerah dan taman" }
    ],
    slug: "taman-mini-indonesia-indah",
    is_featured: false
  },
  {
    id: "taman-komodo",
    name: "Taman Nasional Komodo",
    location: "Manggarai Barat, Nusa Tenggara Timur",
    city: "NTT",
    image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&fm=webp&w=800&q=80",
    rating: 4.9,
    reviews_count: 2400,
    price: "Rp 150.000",
    raw_price: 150000,
    category: "Wisata Alam",
    description: "Habitat kadal purba raksasa komodo di Pulau Rinca dan Komodo, dilengkapi pantai pasir merah muda (Pink Beach) dan panorama spektakuler Pulau Padar.",
    facilities: ["Ranger Pemandu Komodo", "Trekking Jalur Pulau Padar", "Pink Beach Snorkeling", "Dermaga Wisata"],
    operational_hours: "Setiap Hari: 07.00 - 17.00 WITA",
    ticket_types: [
      { id: "kmd-masuk", name: "Tiket Kawasan TN Komodo", price: 150000, description: "Termasuk pemandu ranger resmi" }
    ],
    slug: "taman-nasional-komodo",
    is_featured: false
  }
];

class DestinationService {
  private getDestinationsFromStorage(): Destination[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed reading destinations from localStorage', e);
    }
    // Seed initial data
    this.saveDestinationsToStorage(INITIAL_DESTINATIONS);
    return INITIAL_DESTINATIONS;
  }

  private saveDestinationsToStorage(destinations: Destination[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(destinations));
    } catch (e) {
      console.warn('Failed saving destinations to localStorage', e);
    }
  }

  async getAll(): Promise<Destination[]> {
    // 1. Attempt TiDB Cloud Serverless sync
    try {
      const tidbData = await tidbService.getDestinations();
      if (tidbData && tidbData.length > 0) {
        const mapped: Destination[] = tidbData.map((item: any) => ({
          ...item,
          city: item.city || item.location.split(',')[0],
          image: item.image_url || item.image,
          price: typeof item.price === 'number' ? `Rp ${item.price.toLocaleString('id-ID')}` : String(item.price),
          raw_price: typeof item.price === 'number' ? item.price : Number(String(item.price).replace(/[^0-9]/g, '')) || 15000,
          is_featured: Boolean(item.is_popular || item.is_featured),
          is_tasikmalaya: Boolean(item.location?.toLowerCase().includes('tasikmalaya'))
        }));
        this.saveDestinationsToStorage(mapped);
        return mapped;
      }
    } catch {
      // Fallback to local
    }

    // 2. Attempt backend sync (Vercel rewrite routes /api to Express server)
    try {
      const response = await fetch('/api/destinations', {
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(1500)
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Destination[] = data.map((item: any) => ({
            id: String(item.id),
            name: item.name,
            location: item.location,
            city: item.city || item.location.split(',')[0],
            image: item.image_url || item.image,
            rating: Number(item.rating) || 4.5,
            reviews_count: item.reviews_count || 100,
            price: typeof item.price === 'number' ? `Rp ${item.price.toLocaleString('id-ID')}` : String(item.price),
            raw_price: typeof item.price === 'number' ? item.price : Number(String(item.price).replace(/[^0-9]/g, '')) || 25000,
            category: item.category || 'Wisata Alam',
            description: item.description || '',
            facilities: Array.isArray(item.facilities) ? item.facilities : [],
            operational_hours: item.operational_hours || '08.00 - 17.00 WIB',
            slug: item.slug || String(item.id),
            is_featured: Boolean(item.is_featured),
            is_tasikmalaya: Boolean(item.is_tasikmalaya || item.location?.toLowerCase().includes('tasikmalaya'))
          }));
          return mapped;
        }
      }
    } catch {
      // Backend not running or timeout: smoothly fallback to local data
    }
    return this.getDestinationsFromStorage();
  }

  async getFeatured(limit = 8): Promise<Destination[]> {
    const all = await this.getAll();
    const featured = all.filter(d => d.is_featured);
    return featured.length >= 4 ? featured.slice(0, limit) : all.slice(0, limit);
  }

  async getTasikmalaya(): Promise<Destination[]> {
    const all = await this.getAll();
    return all.filter(d => d.is_tasikmalaya || d.location.toLowerCase().includes('tasikmalaya'));
  }

  async getById(idOrSlug: string | number): Promise<Destination | null> {
    const all = await this.getAll();
    const target = String(idOrSlug).toLowerCase();
    const found = all.find(
      d => String(d.id).toLowerCase() === target || (d.slug && d.slug.toLowerCase() === target)
    );
    return found || null;
  }

  async create(dest: Omit<Destination, 'id' | 'reviews_count' | 'rating'> & { rating?: number; reviews_count?: number }): Promise<Destination> {
    const all = this.getDestinationsFromStorage();
    const newId = `dest-${Date.now()}`;
    const newDest: Destination = {
      ...dest,
      id: newId,
      rating: dest.rating || 4.7,
      reviews_count: dest.reviews_count || 1,
      slug: dest.slug || dest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      is_tasikmalaya: dest.is_tasikmalaya || dest.location.toLowerCase().includes('tasikmalaya'),
      created_at: new Date().toISOString()
    };
    all.unshift(newDest);
    this.saveDestinationsToStorage(all);

    // Try syncing to backend
    try {
      fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDest.name,
          location: newDest.location,
          description: newDest.description,
          image_url: newDest.image,
          price: newDest.raw_price,
          rating: newDest.rating,
          category: newDest.category,
          facilities: newDest.facilities,
          operational_hours: newDest.operational_hours
        }),
        signal: AbortSignal.timeout(1500)
      }).catch(() => {});
    } catch {}

    return newDest;
  }

  async update(id: string | number, updates: Partial<Destination>): Promise<Destination | null> {
    const all = this.getDestinationsFromStorage();
    const index = all.findIndex(d => String(d.id) === String(id));
    if (index === -1) return null;
    all[index] = { ...all[index], ...updates };
    this.saveDestinationsToStorage(all);
    return all[index];
  }

  async delete(id: string | number): Promise<boolean> {
    const all = this.getDestinationsFromStorage();
    const filtered = all.filter(d => String(d.id) !== String(id));
    if (filtered.length === all.length) return false;
    this.saveDestinationsToStorage(filtered);
    return true;
  }

  // --- BOOKINGS & TICKETS ---
  getBookings(): Booking[] {
    try {
      const stored = localStorage.getItem(BOOKINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    // Seed initial dummy booking
    const initialBookings: Booking[] = [
      {
        id: "bkg-1",
        booking_code: "WJI-TSK-7841",
        user_id: "user_demo",
        user_name: "Wisatawan Demo",
        user_email: "demo@wisata.id",
        destination_id: "galunggung-tasik",
        destination_name: "Gunung Galunggung & Pemandian Air Panas",
        destination_location: "Linggajati, Sukaratu, Kabupaten Tasikmalaya",
        destination_image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&fm=webp&w=800&q=80",
        ticket_type: "Paket Combo Kawah + Cipanas Air Panas",
        ticket_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        quantity: 2,
        unit_price: 25000,
        total_amount: 50000,
        status: "paid",
        payment_method: "QRIS",
        created_at: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        id: "bkg-2",
        booking_code: "WJI-TSK-9213",
        user_id: "user_demo",
        user_name: "Wisatawan Demo",
        user_email: "demo@wisata.id",
        destination_id: "teejay-waterpark",
        destination_name: "TeeJay Waterpark (Plaza Asia)",
        destination_location: "Komplek Plaza Asia, Kota Tasikmalaya",
        destination_image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&fm=webp&w=800&q=80",
        ticket_type: "Tiket Reguler (Senin - Jumat)",
        ticket_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        quantity: 3,
        unit_price: 30000,
        total_amount: 90000,
        status: "paid",
        payment_method: "Transfer Bank BCA",
        created_at: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ];
    this.saveBookings(initialBookings);
    return initialBookings;
  }

  saveBookings(bookings: Booking[]): void {
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.warn('Failed saving bookings', e);
    }
  }

  createBooking(booking: Omit<Booking, 'id' | 'booking_code' | 'created_at'>): Booking {
    const all = this.getBookings();
    const code = `WJI-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...booking,
      id: `bkg-${Date.now()}`,
      booking_code: code,
      created_at: new Date().toISOString()
    };
    all.unshift(newBooking);
    this.saveBookings(all);

    // Sync to TiDB Cloud in background
    tidbService.createBooking(newBooking).catch(err => {
      console.warn('Background sync to TiDB error:', err);
    });

    return newBooking;
  }

  getBookingById(id: string): Booking | undefined {
    const all = this.getBookings();
    return all.find(b => b.id === id || b.booking_code === id);
  }

  updateBookingStatus(id: string, status: 'pending' | 'paid' | 'used' | 'cancelled', paymentMethod?: string): boolean {
    const all = this.getBookings();
    const index = all.findIndex(b => b.id === id || b.booking_code === id);
    if (index === -1) return false;
    all[index].status = status;
    if (paymentMethod) {
      all[index].payment_method = paymentMethod;
    }
    this.saveBookings(all);

    // Sync to TiDB Cloud in background
    tidbService.updateBookingStatus(all[index].id, status).catch(() => {});

    return true;
  }
}

export const destinationService = new DestinationService();
