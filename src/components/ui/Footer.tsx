import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-zinc-300 bottom-0 inset-x-0 sticky">
      <div className="flex items-center justify-between px-8 mx-auto max-w-7xl py-4">
        <div>
          <p>&copy; {new Date().getFullYear()} All Rights Reserved</p>
        </div>
        <div>
          <ul className="flex space-x-4">
            <li>
              <Link href="/about">
                <p>About Us</p>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <p>Contact Us</p>
              </Link>
            </li>
            <li>
              <Link href="/privacy">
                <p>Privacy Policy</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
