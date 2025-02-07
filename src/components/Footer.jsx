export default function Footer() {
  return (
    <footer className="bg-background border-t py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} Alichemist.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 