export function PromoBar({ text }: { text: string }) {
  return (
    <div className="bg-blue-deep text-center text-white">
      <p className="px-4 py-2 text-[13px] font-light tracking-wide">{text}</p>
    </div>
  );
}
