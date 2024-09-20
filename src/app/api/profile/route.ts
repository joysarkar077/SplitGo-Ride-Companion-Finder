import dbConnection from "@/lib/dbConnection";

export const GET = async (request: Request) => {
  const connection = await dbConnection();
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    const [users]: any = await connection.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [userId]
    );

    if (users.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found." }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, user: users[0] }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching user." }),
      { status: 500 }
    );
  }
};


export const PUT = async (request: Request) => {
  const connection = await dbConnection();
  
  try {
    const body = await request.json();
    const { user_id, name, email, phone, address } = body;

    const [result]: any = await connection.execute(
      "UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE user_id = ?",
      [name, email, phone, address, user_id]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Profile updated successfully." }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Error updating user." }),
      { status: 500 }
    );
  }
};
