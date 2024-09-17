import dbConnection from "@/lib/dbConnection";

interface User {
  id: number;
  username: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  verified: number;
}

type QueryResult = [User[], any];

export const POST = async (request: Request) => {
  const connection = await dbConnection();

  try {
    const body = await request.json();
    const { username, code } = body;
    const decodedUsername = decodeURIComponent(username);

    // Execute query with type assertion for the result
    const [rows] = await connection.execute<QueryResult>(
      "SELECT * FROM users WHERE username = ?",
      [decodedUsername]
    );

    const user = rows[0] as unknown as User; // Assuming there will be at most one match

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeExpired =
      Date.now() > new Date(user.verifyCodeExpiry).getTime();

    if (!isCodeValid) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid code" }),
        { status: 400 }
      );
    }

    if (isCodeExpired) {
      return new Response(
        JSON.stringify({ success: false, message: "Code expired" }),
        { status: 400 }
      );
    }

    // Update the user as verified
    await connection.execute(
      "UPDATE users SET verified = 1 WHERE username = ?",
      [decodedUsername]
    );

    return new Response(
      JSON.stringify({ success: true, message: "User verified" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error verifying user" }),
      { status: 500 }
    );
  }
};
