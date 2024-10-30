// Screen to show when the mail has been sent to the user to reset the password

export default function ForgotPasswordMail() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
            Reset password
          </h2>
          <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
            An email has been sent to your inbox. Click the link in the email to
            reset your password.
          </p>
        </div>
      </div>
    </div>
  );
}
