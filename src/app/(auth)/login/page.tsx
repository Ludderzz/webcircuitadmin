import LoginForm from "../../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          {/* Logo or Brand Name */}
          <h1 className="text-4xl font-extrabold tracking-tighter text-slate-50">
            WebCircuit<span className="text-blue-500">.</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter your credentials to access the admin panel
          </p>
        </div>

        {/* The Actual Form Component */}
        <LoginForm />

        <p className="text-center text-xs text-slate-500">
          Secure Admin Access Only
        </p>
      </div>
    </main>
  );
}