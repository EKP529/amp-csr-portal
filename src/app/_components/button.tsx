import Link from "next/link";

//component with href and text props
export default function Button({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      className="rounded-full bg-white/10 m-1 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
    >
      {text}
    </Link>
  );
}
