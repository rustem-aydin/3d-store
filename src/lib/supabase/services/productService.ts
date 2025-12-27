// services/productService.ts

import { supabase } from "..";

export const productService = {
  // İlk 20 veya belirli limitli ürünleri getir
  getProducts: async (limit = 20) => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_images(image_url, display_order),
        collection_products(collections(name))
      `
      ) // İlişkili tabloları da tek seferde çekiyoruz
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },
  getProductsWithFilter: async (limit = 20, searchTerm = "") => {
    let query = supabase
      .from("products")
      .select(
        `
        *,
        product_images(image_url),
        collection_products(collections(name))
      `
      )
      .limit(limit)
      .order("created_at", { ascending: false });

    if (searchTerm) {
      // DİREKT EŞİTLİK: slug_text unique olduğu için en hızlı yöntemdir.
      query = query.eq("slug_text", searchTerm);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  getProductBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(*), product_files(*)")
      .eq("slug_text", slug)
      .single();
    console.log(data);
    if (error) throw error;
    return data;
  },
};
