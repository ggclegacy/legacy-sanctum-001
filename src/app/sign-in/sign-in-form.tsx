"use client";

import { useActionState } from "react";

import {
  requestMemberAccess,
  type SignInState,
} from "@/app/sign-in/actions";

const initialState: SignInState = {
  status: "idle",
  message: "",
};

export function SignInForm() {
  const [state, formAction, pending] = useActionState(
    requestMemberAccess,
    initialState,
  );

  return (
    <form action={formAction} className="member-signin-form">
      <label htmlFor="email">Invitation email</label>
      <input
        id="email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
      />
      <button type="submit" className="member-primary-button" disabled={pending}>
        {pending ? "Requesting access…" : "Send private access link"}
      </button>
      {state.message ? (
        <p
          className={`form-message form-message--${state.status}`}
          aria-live="polite"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
