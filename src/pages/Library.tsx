import { BookOpen, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import neverlandCover from "@/assets/trip-to-neverland-cover.jpg";
import christmasCover from "@/assets/odyssey-first-christmas-cover.jpg";

const Library = () => {
  const savedStories = [
    {
      title: "Trip to NeverLand",
      image: neverlandCover,
      progress: 100,
      rating: 5,
      dateCompleted: "2024-01-15"
    },
    {
      title: "Odyssey First Christmas",
      image: christmasCover,
      progress: 65,
      rating: 0,
      dateCompleted: null
    },
    {
      title: "Ocean Adventure",
      image: neverlandCover,
      progress: 30,
      rating: 0,
      dateCompleted: null
    },
    {
      title: "Space Explorer",
      image: christmasCover,
      progress: 85,
      rating: 4,
      dateCompleted: null
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 p-6 pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Library Title - matches reference image */}
          <h1 className="text-5xl font-headline font-bold text-center mb-12">Library</h1>
          
          {/* Story Grid - exactly matching reference layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Top Row - Main Stories */}
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => window.location.href = '/story-reader'}>
              <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-blue-400 to-cyan-400 p-6 mb-4 relative overflow-hidden hover-scale">
                {/* Castle silhouette */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    {/* Main tower */}
                    <div className="w-12 h-16 bg-yellow-400 rounded-t-lg border-2 border-yellow-600 relative">
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-yellow-600"></div>
                      <div className="absolute top-3 left-1 right-1 h-1 bg-yellow-600"></div>
                      <div className="absolute top-6 left-1 right-1 h-1 bg-yellow-600"></div>
                    </div>
                    {/* Side towers */}
                    <div className="absolute -left-3 bottom-0 w-8 h-12 bg-yellow-400 rounded-t-lg border-2 border-yellow-600"></div>
                    <div className="absolute -right-3 bottom-0 w-8 h-12 bg-yellow-400 rounded-t-lg border-2 border-yellow-600"></div>
                  </div>
                </div>
                {/* Fairy silhouette */}
                <div className="absolute top-4 right-6">
                  <div className="w-6 h-8 bg-black rounded-full relative">
                    {/* Wings */}
                    <div className="absolute -right-1 top-1 w-4 h-3 bg-black rounded-full opacity-70"></div>
                    <div className="absolute -right-2 top-2 w-3 h-2 bg-black rounded-full opacity-50"></div>
                  </div>
                </div>
              </div>
              <h3 className="font-playful font-bold text-lg text-center leading-tight">Trip to<br />NeverLand</h3>
            </div>
            
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => window.location.href = '/story-reader'}>
              <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-purple-500 via-orange-400 to-yellow-400 p-6 mb-4 relative overflow-hidden hover-scale">
                {/* Archer silhouette */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-16 bg-black relative">
                    {/* Body */}
                    <div className="w-6 h-8 bg-black rounded-full mx-auto"></div>
                    {/* Bow */}
                    <div className="absolute -right-2 top-2 w-8 h-12 border-2 border-black rounded-full border-r-transparent"></div>
                    {/* Arrow */}
                    <div className="absolute right-0 top-6 w-6 h-0.5 bg-black"></div>
                  </div>
                </div>
                {/* Greek border pattern */}
                <div className="absolute inset-2 border-4 border-yellow-600 rounded-2xl opacity-60" style={{
                  borderImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, currentColor 4px, currentColor 8px) 4'
                }}></div>
              </div>
              <h3 className="font-playful font-bold text-lg text-center">Odyssy</h3>
            </div>
            
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => window.location.href = '/story-reader'}>
              <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-red-500 to-green-500 p-6 mb-4 relative overflow-hidden hover-scale">
                {/* Christmas tree */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  {/* Tree layers */}
                  <div className="w-8 h-6 bg-green-600 rounded-t-full mb-1"></div>
                  <div className="w-10 h-6 bg-green-600 rounded-t-full mb-1 -ml-1"></div>
                  <div className="w-12 h-8 bg-green-600 rounded-t-full -ml-2"></div>
                  {/* Trunk */}
                  <div className="w-2 h-3 bg-amber-700 mx-auto"></div>
                </div>
                {/* Stars */}
                <div className="absolute top-4 right-4">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full mb-2"></div>
                  <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full ml-3"></div>
                </div>
                {/* Holly leaves */}
                <div className="absolute top-6 left-4">
                  <div className="w-4 h-2 bg-green-700 rounded-full"></div>
                  <div className="w-1 h-1 bg-red-500 rounded-full ml-1.5 -mt-0.5"></div>
                </div>
              </div>
              <h3 className="font-playful font-bold text-lg text-center">First Christmas</h3>
            </div>
            
            {/* Bottom Row - Additional Stories */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-gray-300 to-gray-400 p-6 mb-4 relative overflow-hidden hover-scale">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Doctor character */}
                  <div className="text-center">
                    <div className="w-8 h-8 bg-amber-600 rounded-full mb-2 mx-auto"></div>
                    <div className="w-12 h-16 bg-white rounded-lg border-2 border-gray-400"></div>
                    {/* Stethoscope */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-6 h-0.5 bg-gray-700 rounded-full"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full ml-2 -mt-1"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="font-playful font-bold text-lg text-center">It's Terminal</h3>
            </div>
            
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-pink-300 to-yellow-300 p-6 mb-4 relative overflow-hidden hover-scale">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* City buildings */}
                  <div className="flex items-end gap-1">
                    <div className="w-3 h-12 bg-gray-700"></div>
                    <div className="w-4 h-16 bg-gray-800"></div>
                    <div className="w-3 h-10 bg-gray-700"></div>
                    <div className="w-2 h-14 bg-gray-600"></div>
                  </div>
                  {/* Plane silhouette */}
                  <div className="absolute top-6 right-8">
                    <div className="w-8 h-2 bg-black"></div>
                    <div className="absolute top-0 left-6 w-3 h-1 bg-black"></div>
                  </div>
                </div>
              </div>
              <h3 className="font-playful font-bold text-lg text-center leading-tight">Bush Did<br />What?</h3>
            </div>
            
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => window.location.href = '/create-character'}>
              <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 p-6 mb-4 relative overflow-hidden flex items-center justify-center hover-scale border-2 border-dashed border-gray-400">
                <div className="text-6xl text-gray-600 font-bold">+</div>
              </div>
              <h3 className="font-playful font-bold text-lg text-center">Add Stories</h3>
            </div>
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Library;