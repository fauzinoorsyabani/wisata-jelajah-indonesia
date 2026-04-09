
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';


interface SaveButtonProps {
  destinationId: string | number;
  isSaved: boolean;
  setIsSaved: (saved: boolean) => void;
  userId?: string;
  isAuthenticated: boolean;
}

const SaveButton = ({ 
  destinationId, 
  isSaved, 
  setIsSaved,
  userId,
  isAuthenticated 
}: SaveButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const toggleSaveDestination = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/destinasi/${destinationId}` } });
      return;
    }

    if (!userId) {
      toast({
        title: "Error",
        description: "User ID tidak ditemukan",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newSavedState = !isSaved;
      setIsSaved(newSavedState);
      
      toast({
        title: newSavedState ? "Berhasil Disimpan" : "Berhasil Dihapus",
        description: newSavedState 
          ? "Destinasi ditambahkan ke daftar tersimpan (Mock)" 
          : "Destinasi dihapus dari daftar tersimpan (Mock)",
        variant: "default"
      });
    } catch (error) {
      console.error("Error toggling saved status:", error);
      toast({
        title: "Error",
        description: "Gagal mengubah status simpan",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      className="absolute top-2 right-2"
      onClick={toggleSaveDestination}
      disabled={isLoading}
    >
      {isSaved ? (
        <>
          <Heart className="mr-2 h-4 w-4 fill-red-500 text-red-500" />
          {isLoading ? 'Menghapus...' : 'Disimpan'}
        </>
      ) : (
        <>
          <Heart className="mr-2 h-4 w-4" />
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </>
      )}
    </Button>
  );
};

export default SaveButton;
