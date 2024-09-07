import bcrypt from "bcryptjs";
import dbConnection from "@/lib/dbConnection";
import { sendVerigicationEmail } from "@/helpers/sendVerificationEmail";

export const POST = async (request: Request) => {
  const connection = await dbConnection();

  try {
    const body = await request.json();
    const { username, password, email } = body;

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    // Check if the username exists (both verified and unverified)
    const [users] = await connection.execute<any>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (users.length > 0) {
      const user = users[0];
      if (user.verified) {
        // If the existing username is verified, do not allow reuse
        return new Response(
          JSON.stringify({
            success: false,
            message: "Username already exists and is verified.",
          }),
          { status: 400 }
        );
      } else {
        // If the existing username is not verified, allow reuse (update the existing record)
        await connection.execute(
          "UPDATE users SET name = ?, email = ?, password = ?, verifyCode = ?, verifyCodeExpiry = ?, verified = 0 WHERE username = ?",
          [username, email, hashedPassword, verifyCode, expiryDate, username]
        );
      }
    } else {
      // If the username does not exist, create a new record
      await connection.execute(
        "INSERT INTO users (username, name, email, password, verifyCode, verifyCodeExpiry, verified) VALUES (?, ?, ?, ?, ?, ?, 0)",
        [username, username, email, hashedPassword, verifyCode, expiryDate]
      );
    }

    // Send verification email
    const emailResponse = await sendVerigicationEmail(
      email,
      username,
      verifyCode
    );
    if (emailResponse.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "User registered successfully. Verification email sent.",
        }),
        { status: 201 }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Error sending verification email.",
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in sign-up process:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error creating user.",
      }),
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
