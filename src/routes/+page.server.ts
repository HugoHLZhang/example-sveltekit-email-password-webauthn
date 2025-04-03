import { fail, redirect } from "@sveltejs/kit";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";
import { get2FARedirect } from "$lib/server/2fa";

import type { Actions, PageServerLoadEvent, RequestEvent } from "./$types";

export function load(event: PageServerLoadEvent) {
	// If the user is not authenticated, redirect to the login page
	if (event.locals.session === null || event.locals.user === null) {
		return redirect(302, "/login");
	}
	// If the user is not verified, redirect to the verify email page
	if (!event.locals.user.emailVerified) {
		return redirect(302, "/verify-email");
	}
	// If the user is not registered for 2FA, redirect to the 2FA setup page
	if (!event.locals.user.registered2FA) {
		return redirect(302, "/2fa/setup");
	}
	// If the user is not verified for 2FA, redirect to the 2FA verification page
	if (!event.locals.session.twoFactorVerified) {
		return redirect(302, get2FARedirect(event.locals.user));
	}
	// Return the user
	return {
		user: event.locals.user
	};
}

export const actions: Actions = {
	default: action
};

async function action(event: RequestEvent) {
	if (event.locals.session === null) {
		return fail(401, {
			message: "Not authenticated"
		});
	}
	invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);
	return redirect(302, "/login");
}
