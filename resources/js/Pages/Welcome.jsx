import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth }) {
    const isLoggedIn = Boolean(auth?.user);

    return (
        <>
            <Head title="Welcome" />
            <section
                className="relative flex min-h-screen items-center justify-center bg-black/70 text-white"
                style={{
                    backgroundImage:
                        "url(https://images.pexels.com/photos/34441449/pexels-photo-34441449.jpeg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
                <div className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center">
                    <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/70">
                        Expense Tracker
                    </p>
                    <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                        Welcome to your smarter way to manage expenses
                    </h1>
                    <p className="mt-4 text-base text-white/80 sm:text-lg">
                        Track, categorize, and visualize your spending with ease.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        {isLoggedIn ? (
                            <Link
                                href="/admin/dashboard"
                                className="rounded-md bg-white dark:bg-gray-100 px-6 py-3 text-sm font-semibold text-black dark:text-gray-900 transition hover:bg-white/90 dark:hover:bg-gray-200"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="rounded-md bg-white dark:bg-gray-100 px-6 py-3 text-sm font-semibold text-black dark:text-gray-900 transition hover:bg-white/90 dark:hover:bg-gray-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-md border border-white/70 dark:border-gray-300/70 px-6 py-3 text-sm font-semibold text-white dark:text-gray-100 transition hover:bg-white/10 dark:hover:bg-gray-300/20"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
