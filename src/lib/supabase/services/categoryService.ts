import { createClient } from "..";

const supabase = createClient();

export const collectionService = {
  getCollections: async (limit = 20) => {
    const { data, error } = await supabase
      .from("collections")
      .select(
        `*,    collection_products(count)
`
      )
      .limit(limit);

    if (error) throw new Error(error.message);
    return data;
  },
  getAllCollections: async () => {
    const { data, error } = await supabase
      .from("collections")
      .select(
        `
        *,    collection_products(count)

      `
      )
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  getCollectionBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("collection_slug", slug)
      .single();
    console.log(data);
    if (error) throw error;
    return data;
  },
  getProductsByCollectionSlug: async (slug: string) => {
    const { data, error } = await supabase
      .from("collections")
      .select(
        `
        id,
        name,
        description,
        color,
        collection_products (
          products (
            *,
            product_images (image_url),
            collection_products (
              collections (name)
            )
          )
        )
      `
      )
      .eq("collection_slug", slug)
      .single();
    if (error) {
      console.error("Koleksiyon çekilirken hata:", error.message);
      throw error;
    }

    const products =
      data?.collection_products?.map((cp: any) => cp.products) || [];

    return {
      collectionInfo: {
        id: data.id,
        name: data.name,
        color: data?.color,
        description: data.description,
      },
      products: products,
    };
  },
};
