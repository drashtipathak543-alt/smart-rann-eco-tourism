"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import { register } from "@/lib/api";
import toast from "react-hot-toast";

const LOCALES = [{ code: "en", label: "English" }, { code: "hi", label: "हिन्दी" }, { code: "gu", label: "ગુજરાતી" }];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", language: "en" });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.language);
      toast.success("Account created! Please sign in.");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sand-500 mb-4">
            <Leaf size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Create account</h1>
          <p className="text-stone-500 text-sm mt-1">Join the Rann Eco community</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {[
            { k: "name",     label: "Full Name",    type: "text",     placeholder: "Arjun Patel" },
            { k: "email",    label: "Email",         type: "email",    placeholder: "you@example.com" },
            { k: "password", label: "Password",      type: "password", placeholder: "Min. 8 characters" },
          ].map(({ k, label, type, placeholder }) => (
            <div key={k}>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">{label}</label>
              <input
                type={type} required value={form[k as keyof typeof form]}
                onChange={set(k as keyof typeof form)}
                placeholder={placeholder}
                className="input-field"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Preferred Language</label>
            <select value={form.language} onChange={set("language")} className="input-field">
              {LOCALES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-sand-600 font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
