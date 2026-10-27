import { useState } from 'react';
import { Star, MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from './ui/OptimizedImage';

interface DestinationCardProps {
  id: string | number;
  name: string;
  location: string;
  image: string;
  rating: number;
  price: string;
  category: string;
  slug?: string;
  is_tasikmalaya?: boolean;
  onClick?: () => void;
}

const DestinationCard = ({
  id,
  name,
  location,
  image,
  rating,
  price,
  category,
  slug,
  is_tasikmalaya,
  onClick
}: DestinationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const isTasik = is_tasikmalaya || location.toLowerCase().includes('tasikmalaya');

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const destinationPath = slug ? `/destinasi/${slug}` : `/destinasi/${id}`;
      navigate(destinationPath);
    }
  };

  return (
    <div
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Image Container with WebP Optimization & Shimmer */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        <OptimizedImage
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-primary/90 backdrop-blur-sm text-white text-xs font-semibold py-1 px-2.5 rounded-full shadow-sm">
            {category}
          </span>
          {isTasik && (
            <span className="bg-amber-500/90 backdrop-blur-sm text-white text-xs font-semibold py-1 px-2.5 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Tasikmalaya
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center text-xs text-gray-500 mb-1.5 font-medium">
            <MapPin className="h-3.5 w-3.5 mr-1 text-primary shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <h3 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                }`}
              />
            ))}
            <span className="ml-1 text-xs font-semibold text-gray-700">{Number(rating).toFixed(1)}</span>
          </div>
        </div>

        {/* Price and Action Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Tiket Masuk</p>
            <p className="font-bold text-primary text-base">{price}</p>
          </div>
          <button 
            type="button"
            className="bg-primary text-white text-xs font-medium py-2 px-4 rounded-lg shadow-sm group-hover:bg-primary/90 transition-all hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Pesan Tiket
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
