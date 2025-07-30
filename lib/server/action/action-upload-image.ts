"use server";

import supabase from "@/lib/supabase";

export const uploadImage = async (
  image: File,
  imageName: string,
  bucket: string
) => {
  const { data: uploadImage, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(imageName, image, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadImage) {
    const { data: imageUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(imageName);

    return {
      imageUrl: imageUrl.publicUrl,
      error: true,
    };
  } else {
    console.log("error upload: ", uploadError);
    return {
      imageUrl: null,
      error: false,
    };
  }
};
