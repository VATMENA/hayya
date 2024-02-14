
import prisma from "$lib/prisma";
import {_can} from "$lib/perms/can";
import {getUserRoles} from "$lib/perms/getUserRoles";

export async function GET({ params }) {
    let user = await prisma.user.findUnique({
        where: {
            id: params.user
        }
    });
    if (user === null) {
        return new Response(JSON.stringify({
            success: false,
            because: "user does not exist"
        }));
    }
    let user_roles = await getUserRoles(user.id)!;

    let [canPerform, permTrace] = _can(user_roles!, params.vacc, user.vaccId, params.permission);

    return new Response(JSON.stringify({
        success: true,
        can: canPerform,
        because: permTrace,
        user: user
    }));
}
