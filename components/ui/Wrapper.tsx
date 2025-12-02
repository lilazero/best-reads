export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
      <div className="mx-auto max-w-7xl lg:w-4/5">{children}</div>
    </div>
  );
}
