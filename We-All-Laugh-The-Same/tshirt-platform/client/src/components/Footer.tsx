import Image from 'next/image';
import { Facebook, Instagram } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-dandelion text-brand-black p-4 mt-8">
      <div className="max-w-screen-xl mx-auto text-center">
        <div className="flex justify-center items-center mb-4">
          <Image
            src="/images/Logo.png"
            alt="We All Laugh The Same"
            width={300}
            height={75}
            className="invert-colors"
          />
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <a href="#" className="group inline-flex items-center gap-2 bg-blue-600 border-2 border-blue-700 text-white px-6 py-3 rounded-lg font-semibold no-underline shadow-lg transition-all duration-300 hover:bg-blue-500 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95 active:shadow-md">
            <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Facebook
          </a>
          <a href="#" className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-purple-600 text-white px-6 py-3 rounded-lg font-semibold no-underline shadow-lg transition-all duration-300 hover:from-purple-400 hover:to-pink-400 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 active:scale-95 active:shadow-md">
            <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
