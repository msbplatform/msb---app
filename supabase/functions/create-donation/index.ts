import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://msb.earth";

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const { campaignId, amount, message, isAnonymous } = await req.json();

    if (!campaignId || !amount || amount < 1) {
      throw new Error("Invalid donation details");
    }

    const amountInPence = Math.round(Number(amount) * 100);

    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .insert({
        campaign_id: campaignId,
        donor_id: user.id,
        amount: Number(amount),
        message: message || null,
        is_anonymous: Boolean(isAnonymous),
        status: "pending",
      })
      .select()
      .single();

    if (donationError) {
      throw donationError;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "MSB Donation",
            },
            unit_amount: amountInPence,
          },
          quantity: 1,
        },
      ],
      success_url: `${frontendUrl}/?donation=success`,
      cancel_url: `${frontendUrl}/?donation=cancelled`,
      metadata: {
        donation_id: donation.id,
        campaign_id: campaignId,
        donor_id: user.id,
      },
    });

    await supabase
      .from("donations")
      .update({
        stripe_session_id: session.id,
      })
      .eq("id", donation.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("create-donation error:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Donation failed",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
