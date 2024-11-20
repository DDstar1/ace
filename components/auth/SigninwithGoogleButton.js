"use client";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/utils/auth_actions";
import React from "react";

const SignInWithGoogleButton = ({ text }) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => {
        signInWithGoogle();
      }}
    >
      {text}
    </Button>
  );
};

export default SignInWithGoogleButton;
