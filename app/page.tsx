import { Header } from "@/components/header"
import { HeroSearch } from "@/components/hero-search"
import { CategoryCards } from "@/components/category-cards"
import { FeaturedListings } from "@/components/featured-listings"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSearch />
        <CategoryCards />
        <FeaturedListings />
      </main>
      <Footer />
    </div>
  )
}
