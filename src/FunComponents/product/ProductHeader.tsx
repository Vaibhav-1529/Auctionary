import Link from "next/link";

export default function ProductHeader({ auction }: any) {
  return (
    <div className="mb-14">
      <h1 className="text-4xl font-bold mb-2">{auction.title}</h1>
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-orange-500">
          Home
        </Link>{" "}
        → Auction #{auction.id}
      </p>
    </div>
  );
}
