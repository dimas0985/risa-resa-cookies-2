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
                href="mailto:risaresacookies@gmail.com"
                className="text-stone-200 hover:text-amber-300"
              >
                risaresacookies@gmail.com
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
                Jl. Meninjo No.157, RT.6/RW.5, Ciganjur, Kec. Jagakarsa,
                Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12630
              </p>
              <a
                href="https://maps.google.com/?q=Jl.%20Meninjo%20No.157,%20RT.6%2FRW.5,%20Ciganjur,%20Kec.%20Jagakarsa,%20Kota%20Jakarta%20Selatan,%20Daerah%20Khusus%20Ibukota%20Jakarta%2012630"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center rounded-full bg-amber-300 px-3 py-1 text-sm font-medium text-[#7B3F1D] transition hover:bg-amber-200"
              >
                Lihat Lokasi
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
