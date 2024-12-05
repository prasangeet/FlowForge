import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      something
      <Link
        href={"/authentication/signup"}
      >Signup page</Link>
    </div>
  );
}
