"use client";

import AuthForm from '@/components/forms/AuthForm';
import { signUpWithCredentials } from '@/lib/actions/auth.actions';
import { SignUpSchema } from '@/lib/validations'
import React from 'react'

const SignUp = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{ email: "", password: "", name: "", username: "" }}
      onSubmit={signUpWithCredentials}
    />
  )
}

export default SignUp