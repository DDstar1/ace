// useUserStore.js
import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
const useUserStore = create((set) => ({
  user: null,
  points: 0,

  fetchUserData: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: userAddons, error } = await supabase
        .from("user_addons")
        .select("points")
        .eq("id", user.id);

      if (!error) {
        set({ user, points: userAddons[0]?.points || 0 });
      } else {
        console.error("Error fetching user points:", error);
      }
    }
  },

  updateUserPoints: async (email, newPoints) => {
    const { data, error } = await supabase
      .from("user_addons")
      .update({ points: newPoints })
      .eq("email", email);

    console.log(data);
    if (!error) {
      set({ points: newPoints });
    } else {
      console.error("Error updating points:", error);
    }
  },
}));

export default useUserStore;
