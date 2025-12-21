import Image from "next/image";
import { Search } from "lucide-react";

export default function ProductGallery({ auction }: any) {
  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow">
        <Search size={18} />
      </div>

      <Image
        src={auction.image_url}
        alt={auction.title}
        width={520}
        height={520}
        className="object-contain"
      />
    </div>
  );
}
