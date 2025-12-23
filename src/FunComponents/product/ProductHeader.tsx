import Link from "next/link";

export default function ProductHeader({ auction }: any) {
  return (
    <div className="mb-14">
      <h1 className="text-4xl font-semibold mb-2 text-foreground">
        {auction.title}
      </h1>
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition">
          Home
        </Link>{" "}
        → Auction #{auction.id}
      </p>
    </div>
  );
}
