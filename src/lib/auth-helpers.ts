import { cookies } from 'next/headers';
import { verifyToken } from './auth';
import { NextResponse } from 'next/server';

/**
 * Get the current server session
 * @returns Session object or null if not authenticated
 */
export async function getServerSession() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return null;

        const decoded = verifyToken(token);
        if (!decoded) return null;

        return {
            user: {
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                role: decoded.role,
            },
        };
    } catch (error) {
        return null;
    }
}

/**
 * Require authentication for API routes
 * Returns the session if authenticated, or an error response
 */
export async function requireAuth() {
    const session = await getServerSession();

    if (!session || !session.user) {
        return {
            error: NextResponse.json(
                { error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            ),
            session: null,
        };
    }

    return { error: null, session };
}

/**
 * Verify that the current user owns a resource
 * @param resourceUserId - The userId field from the resource
 * @param currentUserId - The current user's ID from session
 */
export function verifyOwnership(resourceUserId: string, currentUserId: string) {
    if (resourceUserId.toString() !== currentUserId.toString()) {
        return NextResponse.json(
            { error: 'Forbidden. You can only modify your own resources.' },
            { status: 403 }
        );
    }
    return null;
}

/**
 * Check if user has admin role
 */
export function isAdmin(session: any): boolean {
    return session?.user?.role === 'admin';
}
