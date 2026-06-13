import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
        <Navbar /> 
        
        <main className="flex-grow">
            {children}
        </main>

        <Footer /> 

        <ScrollToTop />
        </div>
    );
}