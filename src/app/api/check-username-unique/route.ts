import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";
import dbConnection from "@/lib/dbConnection";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export const GET = async (request: Request) => {
  if (request.method !== "GET") {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid request method" }),
      { status: 405 }
    );
  }

  const connection = await dbConnection(); // Ensure connection is established
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    const result = UsernameQuerySchema.safeParse({ username });
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [
        "Invalid username",
      ];
      return new Response(
        JSON.stringify({ success: false, message: usernameError.join(", ") }),
        { status: 400 }
      );
    } else {
      // Adjust the column name as per your table schema
      const query =
        "SELECT * FROM users WHERE username = ? AND verified = TRUE";
      const [rows] = await connection.execute<any>(query, [username]);

      if (rows.length > 0) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Username already exists",
          }),
          { status: 400 }
        );
      } else {
        return new Response(
          JSON.stringify({ success: true, message: "Username is available" }),
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.error("Error checking if username is unique:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error checking if username is unique",
      }),
      { status: 500 }
    );
  }
};
