
// This file exists for backward compatibility
// Re-export everything from the new modular structure

import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export * from "./document";
export { getNomePastaDisplay } from "./document/pastaUtils";
