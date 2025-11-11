import Link from "next/link";
import Image from "next/image";

function Header() {
  return (
    <header className="text-brand-black p-2 py-4 sm:p-4 sm:px-6 md:px-8 lg:px-12 sticky top-0 z-15 bg-white/20 backdrop-filter backdrop-blur-lg shadow-lg">
      <div className="flex justify-between py-2 items-center gap-2 sm:gap-4">
        <div className="flex items-center">
          <Link href="/" className="inline-block no-underline">
            <Image
              src="/images/Logo.png"
              alt="We All Laugh The Same"
              width={300}
              height={75}
              priority
              className="invert-colors h-8 sm:h-10 md:h-12 w-auto"
            />
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-2 sm:space-x-3 md:space-x-4">
            <li>
              <Link
                href="/checkout"
                className="inline-block bg-white border-2 text-dandelion text-sm sm:text-base font-bold py-1 px-3 sm:py-1.5 sm:px-4 rounded-md no-underline transition-colors duration-150 ease-in-out hover:bg-yellow-500 hover:text-brand-black hover:shadow-lg"
              >
                Checkout
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
