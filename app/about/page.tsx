import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, MapPin, Building2, FileCheck, Landmark } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-white">
        
        {/* 1. HERO SECTION (Page Banner) */}
        <div className="relative bg-[#b800ff] py-24 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" /> 
          <div className="container relative mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Faisal Town Islamabad</h1>
            <p className="text-purple-100 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
              A fully developed, RDA-approved project by Chaudhary Abdul Majeed. 
              Delivering secure living and high returns since 2014.
            </p>
          </div>
        </div>

        {/* 2. STRATEGIC LOCATION (Moved to Top) */}
        <div className="bg-slate-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
               <div className="p-4 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm">
                 <MapPin className="h-8 w-8 text-[#b800ff] mx-auto mb-2" />
                 <p className="font-semibold">M-1 Motorway</p>
                 <p className="text-sm text-slate-400">2 Mins Drive</p>
               </div>
               <div className="p-4 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm">
                 <MapPin className="h-8 w-8 text-[#b800ff] mx-auto mb-2" />
                 <p className="font-semibold">Islamabad Airport</p>
                 <p className="text-sm text-slate-400">5 Mins Drive</p>
               </div>
               <div className="p-4 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm">
                 <MapPin className="h-8 w-8 text-[#b800ff] mx-auto mb-2" />
                 <p className="font-semibold">Kashmir Highway</p>
                 <p className="text-sm text-slate-400">Direct Access</p>
               </div>
               <div className="p-4 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm">
                 <MapPin className="h-8 w-8 text-[#b800ff] mx-auto mb-2" />
                 <p className="font-semibold">Fateh Jang Int.</p>
                 <p className="text-sm text-slate-400">Adjacent</p>
               </div>
            </div>
          </div>
        </div>

        {/* 3. INTRODUCTION & DEVELOPER */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Project Background</h2>
              <div className="text-muted-foreground space-y-4 text-lg">
                <p>
                  Faisal Town Phase 1 is the flagship project of <strong>Faisal Town Group (Zedem International)</strong>. Owned by the respected real estate developer <strong>Chaudhary Abdul Majeed</strong>, the society was launched with a vision to provide affordable yet premium living standards in the F-18 sector.
                </p>
                <p>
                  Spanning over <strong>4,735 Kanals</strong>, the project stands out because it is not just "on paper"—it is a living community. Development work in Blocks A, B, and C is complete, and thousands of residents are already enjoying the facilities.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <FileCheck className="h-8 w-8 text-[#b800ff]" />
                  <div>
                    <p className="font-bold text-slate-900">RDA Approved</p>
                    <p className="text-sm text-muted-foreground">Legal & Safe</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <Building2 className="h-8 w-8 text-[#b800ff]" />
                  <div>
                    <p className="font-bold text-slate-900">Developed</p>
                    <p className="text-sm text-muted-foreground">Possession Ready</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Developer/Office Image Placeholder */}
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg bg-slate-200 group">
              <img 
                src="/ChMajeedFaisalTownPhase1.webp" // Ensure you add this image to your public folder
                alt="Faisal Town Head Office"
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                 <p className="text-white font-semibold">Chaudhary Abdul Majeed</p>
                 <p className="text-purple-200 text-sm">Chairman, Faisal Town Group</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. VISUAL GALLERY (Amenities) */}
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Signature Amenities
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              
              <div className="group relative overflow-hidden rounded-xl h-64 bg-slate-200 shadow-md">
                <img src="/Faisal-Town-Mosque.jpg" alt="Jamia Mosque" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-[#b800ff]" /> 7 Grand Mosques
                  </h3>
                  <p className="text-sm opacity-90">Architectural marvels in every block</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl h-64 bg-slate-200 shadow-md">
                <img src="/FootballGroundFaisalTownPhase1.jpg" alt="Cricket Stadium" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">Sports Complex</h3>
                  <p className="text-sm opacity-90">60-Kanal Cricket Stadium & Courts</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl h-64 bg-slate-200 shadow-md">
                <img src="/GlowParkFaisalTownPhase1.webp" alt="Glow Garden" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">Glow Garden</h3>
                  <p className="text-sm opacity-90">Family parks and aesthetic lighting</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. BLOCKS DETAIL (Added Block B1) */}
        <div className="container mx-auto px-4 py-16">
           <h2 className="text-3xl font-bold text-center mb-4">Master Plan & Sectors</h2>
           <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
             The society offers a diverse portfolio of residential options across four distinct blocks.
           </p>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Block A */}
              <Card className="hover:border-[#b800ff] transition-colors shadow-sm">
                 <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-[#b800ff] font-bold text-xl mb-4">A</div>
                    <h3 className="text-xl font-bold mb-3">Block A</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The main commercial hub featuring "Red Sun Associates" shopping malls and the central civic center. Most plots here are fully developed and in possession.
                    </p>
                 </CardContent>
              </Card>

              {/* Block B */}
              <Card className="hover:border-[#b800ff] transition-colors shadow-sm">
                 <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-[#b800ff] font-bold text-xl mb-4">B</div>
                    <h3 className="text-xl font-bold mb-3">Block B</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Ideally located along the M-1 Motorway belt with 100% possession delivered. Known for its peaceful residential environment and lush green parks.
                    </p>
                 </CardContent>
              </Card>

              {/* Block B1 (NEW) */}
              <Card className="hover:border-[#b800ff] transition-colors shadow-sm bg-purple-50/50">
                 <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-[#b800ff] font-bold text-xl mb-4">B1</div>
                    <h3 className="text-xl font-bold mb-3">Block B1</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The newest addition offering smaller residential plots (5, 7, & 10 Marla). Positioned for high investment returns with rapid development underway.
                    </p>
                 </CardContent>
              </Card>

              {/* Block C */}
              <Card className="hover:border-[#b800ff] transition-colors shadow-sm">
                 <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-[#b800ff] font-bold text-xl mb-4">C</div>
                    <h3 className="text-xl font-bold mb-3">Block C</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The premium block featuring the Cricket Stadium. Direct connectivity to the future Kashmir Highway extension makes it a high-potential investment area.
                    </p>
                 </CardContent>
              </Card>
           </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}