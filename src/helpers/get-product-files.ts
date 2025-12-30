"use server";
import { createClient } from "@/lib/supabase/server";

interface FileInput {
  id?: string;
  file_url: string; // Aslında dosya adı (örn: "gingerbread.stl")
  file_name?: string;
  file_size?: string;
  file_type?: string;
  product_id?: string;
}

export async function getPreviewUrl(input: FileInput): Promise<string | null> {
  try {
    const BUCKET_NAME = "files";

    if (!input?.file_url) {
      console.error("file_url (dosya adı) eksik");
      return null;
    }

    const supabase = await createClient();

    // Direkt dosya adı (klasör yok)
    const fileName = input.file_url; // "gingerbread.stl"

    console.log("🔍 Aranan dosya:", fileName);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 600);
    console.log(error);
    if (error) {
      console.error("❌ Supabase Storage Hatası:", error);

      // 🔍 Bucket içeriğini kontrol et
      const { data: files } = await supabase.storage
        .from(BUCKET_NAME)
        .list("", { limit: 10 });
      console.log("📂 Bucket'taki dosyalar:", files);

      return null;
    }

    if (!data?.signedUrl) {
      console.error("signedUrl boş döndü");
      return null;
    }

    console.log("✅ Signed URL:", data.signedUrl);
    return data.signedUrl;
  } catch (err) {
    console.error("Kritik hata:", err);
    return null;
  }
}

// Opsiyonel: Birden fazla dosya için toplu URL alma
export async function getPreviewUrls(
  files: FileInput[]
): Promise<(string | null)[]> {
  return Promise.all(files.map((file) => getPreviewUrl(file)));
}

// Debug için: Bucket içeriğini listele
export async function listBucketFiles() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.storage.from("files").list("", {
      limit: 100,
      offset: 0,
    });

    if (error) {
      console.error("Bucket listeleme hatası:", error);
      return null;
    }

    console.log("Bucket içeriği:", data);
    return data;
  } catch (err) {
    console.error("Liste alma hatası:", err);
    return null;
  }
}
