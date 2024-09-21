import dbConnection from "@/lib/dbConnection";

export const GET = async (request: Request) => {
    const connection = await dbConnection();
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
        return new Response(JSON.stringify({ success: false, message: 'Missing userId' }), { status: 400 });
    }

    try {
        const [chatGroups] = await connection.execute(`
            SELECT cg.group_name, cg.request_id, cg.expiry_time
            FROM chat_groups cg
            JOIN chat_group_participants cgp ON cg.group_name = cgp.group_name
            WHERE cgp.user_id = ?
        `, [userId]);

        return new Response(JSON.stringify({ success: true, chatGroups }), { status: 200 });
    } catch (error) {
        console.error('Error fetching chat groups:', error);
        return new Response(JSON.stringify({ success: false, message: 'Error fetching chat groups' }), { status: 500 });
    }
};
