import { getSessionAndOrganizer, getSessionAndUser } from "@app/lib/auth";
import { decrypt, encrypt } from "@app/lib/enc";
import { createClient } from "@app/lib/supabase/server";
import { createServiceClient } from "@app/lib/supabase/serverAdmin";

const propertyId = "465055643";

// Imports the Google Analytics Data API client library.
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const credentials = {
  client_email: process.env.GOOGLE_APPLICATION_CREDENTIALS_CLIENT_EMAIL!,
  private_key: process.env
    .GOOGLE_APPLICATION_CREDENTIALS_PRIVATE_KEY!.split("\\n")
    .join("\n"),
};
const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body);
    const { dateRanges, dimensions, metrics, eventSlug } = body;

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges,

      // allowed dimensions:
      // https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#dimensions
      dimensions,

      // allowed metrics:
      // https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#metrics
      metrics,

      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: {
            matchType: "EXACT",
            value: `/events/${eventSlug}`,
          },
        },
      },
    });

    return Response.json(
      {
        data: response,
        error: null,
        message: null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        data: null,
        error: error.message,
        message: null,
      },
      { status: 400 }
    );
  }
}
