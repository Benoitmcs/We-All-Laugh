import Link from 'next/link';
import Image from 'next/image';

function Header() {
  return (
    <header className="text-brand-black p-4 sticky top-0 z-15 bg-white/20 backdrop-filter backdrop-blur-lg shadow-lg">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="text-lg font-bold p-2">
          <Link href="/" className="inline-block no-underline">
            <Image
              src="/images/Logo.png"
              alt="We All Laugh The Same"
              width={300}
              height={75}
              priority
              className="invert-colors"
            />
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-2">
            <li>
              <Link href="/" className="inline-block bg-white border text-dandelion py-2 px-4 rounded-md no-underline transition-colors duration-150 ease-in-out hover:bg-yellow-500 hover:text-brand-black hover:shadow-lg ">Home</Link>
            </li>
            <li>
              <Link href="/mission" className="inline-block bg-white border text-dandelion py-2 px-4 rounded-md no-underline transition-colors duration-150 ease-in-out hover:bg-yellow-500 hover:text-brand-black hover:shadow-lg ">Mission</Link>
            </li>
            <li>
              <Link href="/checkout" className="inline-block bg-white border text-dandelion py-2 px-4 rounded-md no-underline transition-colors duration-150 ease-in-out hover:bg-yellow-500 hover:text-brand-black hover:shadow-lg ">Checkout</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
