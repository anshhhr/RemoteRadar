import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-white shadow-sm p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">RemoteRadar</h1>
        </nav>
        {children}
      </body>
    </html>
  );
}
