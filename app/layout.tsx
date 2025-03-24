
import React from 'react';
import type { Metadata } from "next";
import "./globals.scss";
import Header from "@/components/Header";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "IBM IntelliSphere® Optim™",
  description: "IBM IntelliSphere® Optim™ application",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body suppressHydrationWarning suppressContentEditableWarning>
      <ThemeProvider>
        <Header />
        <main className="app-content">
          {children}
        </main>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
