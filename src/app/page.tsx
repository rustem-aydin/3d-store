import { Metadata } from "next";
import Achievements from "./components/home/achievements";
import Brand from "./components/home/brand";
import CreativeMind from "./components/home/creative-mind";
import CustomerStories from "./components/home/customer-stories";
import Faq from "./components/home/faq";
import HeroSection from "./components/home/hero";
import Innovation from "./components/home/innovation";
import OnlinePresence from "./components/home/online-presence";
import Solutions from "./components/home/solution";
import Subscription from "./components/home/subscription";
import WebResult from "./components/home/web-result";
import Models from "./components/models/models-list";
import {
  prefetchCollections,
  prefetchProducts,
} from "@/lib/supabase/prefetch-helpers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "3D Market | Premium 3D Modeller",
};

export default async function Home() {
  const queryClient = await prefetchProducts(10);
  const collections = await prefetchCollections();
  return (
    <main>
      <HeroSection />
      <HydrationBoundary state={dehydrate(collections)}>
        <Brand limit={10} />
      </HydrationBoundary>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Models limit={10} />
      </HydrationBoundary>
      <WebResult />
      <Innovation />
      <OnlinePresence />
      <CreativeMind />
      {/* <CustomerStories /> */}
      <Subscription />
      {/* ---------------------Subscription section Ends-----------------  */}
      {/* ---------------------Faq section Starts-----------------  */}
      <Faq />
      {/* ---------------------Faq section Ends-----------------  */}
      {/* ---------------------Achievements section Starts-----------------  */}
      <Achievements />
      {/* ---------------------Achievements section Ends-----------------  */}
      {/* ---------------------Solutions section Starts-----------------  */}
      <Solutions />
      {/* ---------------------Solutions section Ends-----------------  */}
    </main>
  );
}
