import LoginForm from "@/components/form/auth/login-form";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center py-4 px-4 bg-gray-300">
      <LoginForm />
    </div>
  );
}
