import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Trash2, 
  Eye, 
  Filter, 
  Star, 
  MapPin,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { destinationService, Destination } from '@/services/destinationService';
import OptimizedImage from '@/components/ui/OptimizedImage';

const DestinationsList = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const data = await destinationService.getAll();
      setDestinations(data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error('Gagal memuat data destinasi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus destinasi "${name}"?`)) {
      try {
        await destinationService.delete(id);
        setDestinations(prev => prev.filter(dest => String(dest.id) !== String(id)));
        toast.success(`Destinasi "${name}" berhasil dihapus`);
      } catch (error) {
        console.error('Error deleting destination:', error);
        toast.error('Gagal menghapus destinasi');
      }
    }
  };

  const handleViewDestination = (id: string | number) => {
    navigate(`/destinasi/${id}`);
  };

  const filtered = destinations.filter(dest => {
    const matchesSearch = !searchTerm || 
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      dest.category === selectedCategory ||
      (selectedCategory === "Tasikmalaya" && (dest.is_tasikmalaya || dest.location.toLowerCase().includes('tasikmalaya')));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Destinasi Wisata</h1>
          <p className="text-gray-500 text-sm">
            Total {destinations.length} destinasi (termasuk fokus Wisata Tasikmalaya & Nasional)
          </p>
        </div>
        <Link to="/admin/destinations/new">
          <Button className="flex items-center gap-2 bg-primary text-white font-semibold">
            <Plus size={16} /> Tambah Destinasi Baru
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari destinasi atau lokasi (misal: Galunggung, Waterpark, Bali)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="w-full sm:w-56">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <SelectValue placeholder="Pilih Kategori" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="Tasikmalaya">Fokus Tasikmalaya</SelectItem>
                <SelectItem value="Wisata Alam">Wisata Alam</SelectItem>
                <SelectItem value="Wisata Hiburan">Wisata Hiburan</SelectItem>
                <SelectItem value="Wisata Budaya">Wisata Budaya</SelectItem>
                <SelectItem value="Wisata Sejarah">Wisata Sejarah</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Destinasi Wisata</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga Tiket</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex justify-center items-center gap-2 text-primary">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="font-medium text-sm">Memuat data destinasi...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length > 0 ? (
              filtered.map((dest) => (
                <TableRow key={dest.id} className="hover:bg-slate-50/70">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                        <OptimizedImage
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block text-sm">{dest.name}</span>
                        {(dest.is_tasikmalaya || dest.location.toLowerCase().includes('tasikmalaya')) && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold mt-0.5">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Tasikmalaya
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-gray-600 max-w-xs truncate">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{dest.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700">
                      {dest.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-primary text-xs">
                    {dest.price}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-gray-700">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span>{dest.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Lihat Halaman Publik"
                        className="h-8 w-8 text-gray-600 hover:text-primary"
                        onClick={() => handleViewDestination(dest.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:bg-destructive/10" 
                        title="Hapus Destinasi"
                        onClick={() => handleDelete(dest.id, dest.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500 text-sm">
                  Tidak ada destinasi yang cocok dengan pencarian
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DestinationsList;
