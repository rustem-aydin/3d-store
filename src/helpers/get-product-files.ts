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

    // file_url aslında dosya adı (örn: "gingerbread.stl")
    const fileName = input.file_url;

    console.log("Bucket:", BUCKET_NAME);
    console.log("Dosya adı:", fileName);

    // Önce dosyanın varlığını kontrol et
    const { data: fileList, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list("", {
        search: fileName,
      });

    if (listError) {
      console.error("Dosya arama hatası:", listError);
      return null;
    }

    if (!fileList || fileList.length === 0) {
      console.error(`Dosya bulunamadı: ${fileName}`);
      console.log("Bucket'taki dosyaları listeleyin ve kontrol edin");
      return null;
    }

    console.log("Dosya bulundu:", fileList[0]);

    // İmzalı URL oluştur (10 dakika geçerli)
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 600);

    if (error) {
      console.error("Supabase Storage İmzalı URL Hatası:", error);
      return null;
    }

    if (!data?.signedUrl) {
      console.error("signedUrl boş döndü");
      return null;
    }

    console.log("✅ İmzalı URL başarıyla oluşturuldu");
    return data.signedUrl;
  } catch (err) {
    console.error("Kritik Server Action Hatası:", err);
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
