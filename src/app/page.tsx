import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import MainHeader from "@/components/header";

export default function Home() {
  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">
            Welcome to SunM SaaS Starter
          </h1>

          <SignedOut>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Get Started with Authentication
              </h2>
              <p className="text-gray-600 mb-6">
                Sign up or sign in to access your dashboard and start using the
                application.
              </p>
              <div className="flex justify-center space-x-4">
                <SignInButton mode="modal">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">
                🎉 Welcome! You&apos;re successfully signed in
              </h2>
              <p className="text-green-700 mb-6">
                Clerk authentication is working perfectly. You can now access
                protected routes and features.
              </p>
              <div className="flex justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </SignedIn>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                🔐 Authentication Ready
              </h3>
              <p className="text-gray-600">
                Clerk is fully integrated with Next.js App Router, providing
                secure authentication with social logins, email/password, and
                more.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🎨 UI Components</h3>
              <p className="text-gray-600">
                All shadcn/ui components are installed and ready to use. Build
                beautiful interfaces with pre-styled, accessible components.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🗄️ Database Ready</h3>
              <p className="text-gray-600">
                Drizzle ORM is configured with TypeScript support, schema
                definitions, and migration tools for robust database management.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Next Steps:</h3>
            <ul className="text-left max-w-2xl mx-auto space-y-2 text-gray-700">
              <li>
                • Set up your Clerk environment variables in{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">
                  .env.local
                </code>
              </li>
              <li>
                • Configure your database connection with{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">
                  DATABASE_URL
                </code>
              </li>
              <li>
                • Run{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">
                  pnpm db:push
                </code>{" "}
                to create database tables
              </li>
              <li>
                • Test the database connection at{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">
                  /api/test-db
                </code>
              </li>
              <li>• Build your SaaS application with the included tools</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
