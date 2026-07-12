import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#7B3F1D] border-t border-[#633117]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <Mail className="mt-1 text-amber-300" size={22} />
            <div>
              <h3 className="font-semibold text-amber-100">Email</h3>
              <a
                href="mailto:m.dimas.a1010@gmail.com"
                className="text-stone-200 hover:text-amber-300"
              >
                m.dimas.a1010@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="mt-1 text-amber-300" size={22} />
            <div>
              <h3 className="font-semibold text-amber-100">WhatsApp</h3>
              <a
                href="https://wa.me/6287869198381"
                className="text-stone-200 hover:text-amber-300"
                target="_blank"
                rel="noreferrer"
              >
                087869198381
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="mt-1 shrink-0 text-amber-300" size={22} />
            <div>
              <h3 className="font-semibold text-amber-100">Lokasi</h3>
              <p className="text-stone-200">
                Jl. Kopo RT/RW 004/05 no.29 Kelurahan Ciganjur Kecamatan
                Jagakarsa Jakarta Selatan
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
