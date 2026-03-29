import "./styles.css";
import "./globals.css";

export const metadata = {
  title: "Giraffe 11+ Academy",
  icons: {
    icon: "/giraffe-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}