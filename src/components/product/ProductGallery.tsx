'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface ProductGalleryProps {
  images: {
    url: string;
    alt: string;
    width: number;
    height: number;
    isPrimary?: boolean;
  }[];
  title: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, title }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const currentImage = images[activeImageIndex] || images[0];

  return (
    <div className="space-y-4 font-sans">
      {/* Main Large Visual Display */}
      <div className="relative w-full aspect-[3/4] bg-maison-stone/20 overflow-hidden group">
        <Image
          src={currentImage.url}
          alt={currentImage.alt || title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-center cursor-zoom-in transition-transform duration-700 hover:scale-105"
          onClick={() => setIsZoomOpen(true)}
        />

        {/* Zoom Overlay Trigger */}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute top-4 right-4 p-2.5 bg-maison-ivory/80 backdrop-blur-xs rounded-full border border-maison-stone/40 text-maison-obsidian opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm"
          aria-label="Enlarge visual"
        >
          <Maximize2 className="w-4 h-4 stroke-[1.5]" />
        </button>

        {/* Slider Controls for Mobile */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none md:hidden">
            <button
              onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="p-2 bg-maison-ivory/80 backdrop-blur-xs text-maison-obsidian rounded-full pointer-events-auto shadow-sm"
              aria-label="Previous visual"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="p-2 bg-maison-ivory/80 backdrop-blur-xs text-maison-obsidian rounded-full pointer-events-auto shadow-sm"
              aria-label="Next visual"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Thumbnail Bar */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative aspect-[3/4] bg-maison-stone/30 overflow-hidden border transition-all ${
                activeImageIndex === idx
                  ? 'border-maison-obsidian opacity-100'
                  : 'border-maison-stone/50 opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img.url} alt={img.alt || title} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      <Modal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        title={title}
        subtitle={`HIGH RESOLUTION ATELIER DETAIL ${activeImageIndex + 1} OF ${images.length}`}
        maxWidth="xl"
      >
        <div className="relative aspect-[3/4] max-h-[75vh] w-full bg-maison-obsidian overflow-hidden">
          <Image
            src={currentImage.url}
            alt={currentImage.alt || title}
            fill
            className="object-contain"
          />
        </div>
      </Modal>
    </div>
  );
};
