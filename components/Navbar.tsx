import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4 fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Gratitude Journal
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-white hover:text-blue-200">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/goal-visualization"
              className="text-white hover:text-blue-200"
            >
              Goal Visualization
            </Link>
          </li>
          <li>
            <Link href="/home" className="text-white hover:text-blue-200">
              All Entries
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
