
export function LoadingSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
}
