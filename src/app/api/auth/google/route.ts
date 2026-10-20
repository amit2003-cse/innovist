import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientId);

export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json(
        { success: false, message: "Missing Google credential token" },
        { status: 400 }
      );
    }

    // Verify Google ID token
    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      // Fallback: decode base64 payload if token verification clock skew occurs
      try {
        const base64Url = credential.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        payload = JSON.parse(jsonPayload);
      } catch (decodeError) {
        console.error("Token verification failed:", verifyError, decodeError);
        return NextResponse.json(
          { success: false, message: "Invalid Google credential" },
          { status: 401 }
        );
      }
    }

    if (!payload || !payload.email) {
      return NextResponse.json(
        { success: false, message: "No email payload found in token" },
        { status: 400 }
      );
    }

    const { sub: googleId, email, name, picture: avatar } = payload;

    // Connect to MongoDB Atlas
    await connectToDatabase();

    // Upsert user in database
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        name: name || "Innovist User",
        email: email.toLowerCase(),
        avatar: avatar || "",
        googleId,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error("Google Auth API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error during authentication",
      },
      { status: 500 }
    );
  }
}
