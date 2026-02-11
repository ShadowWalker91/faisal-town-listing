import { Header } from "@/components/header"
import { HeroSearch } from "@/components/hero-search"
import { CategoryCards } from "@/components/category-cards"
import { FeaturedListings } from "@/components/featured-listings"
import { Footer } from "@/components/footer"
import { AboutSection } from "@/components/about-section" // <--- Import this

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSearch />
        <CategoryCards />
        
        {/* Added the new section here */}
        <AboutSection /> 

        <FeaturedListings />
      </main>
      <Footer />
    </div>
  )
}