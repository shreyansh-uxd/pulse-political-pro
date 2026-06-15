import { supabase } from "@/integrations/supabase/client";

export const subscribeToNewsletter = async (data: { email: string; source?: string }) => {
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      { email: data.email.toLowerCase(), source: data.source ?? "site" },
      { onConflict: "email", ignoreDuplicates: true },
    );
  if (error) throw new Error(error.message);
  return { ok: true };
};
