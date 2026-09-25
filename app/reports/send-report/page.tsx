"use client";

import { useState } from "react";
import { Send, Mail, FileText, MessageSquare, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SendReportPage() {
  const [form, setForm] = useState({
    recipientEmail: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.recipientEmail || !form.subject) {
      toast.error("Recipient email and subject are required");
      return;
    }

    setSending(true);
    try {
      // TODO: replace with your actual API call, e.g.
      // await handle_location.sendReport(form);
      await new Promise((resolve) => setTimeout(resolve, 1200)); // demo delay
      toast.success("Report sent successfully");
      setForm({ recipientEmail: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send report");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto w-[95%] sm:w-[90%] pb-10">
      {/* Header */}
      <div className="mt-8 mb-6 flex items-center gap-4">
        <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 shadow-lg shadow-blue-500/20">
          <Send size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800">Send Report</h1>
          <p className="text-sm text-slate-400 font-medium">Share a report with a client or team member</p>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 flex flex-col gap-5"
      >
        {/* Recipient Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Recipient Email
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Mail size={16} className="text-slate-400 shrink-0" />
            <input
              type="email"
              name="recipientEmail"
              value={form.recipientEmail}
              onChange={handleChange}
              placeholder="client@example.com"
              className="w-full text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Subject
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <FileText size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Monthly Waste Collection Report"
              className="w-full text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Message (optional)
          </label>
          <div className="flex items-start gap-2 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <MessageSquare size={16} className="text-slate-400 shrink-0 mt-1" />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder="Add a short note for the recipient..."
              className="w-full text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-300 resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={sending}
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-60"
        >
          {sending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Send Report
            </>
          )}
        </button>
      </form>
    </div>
  );
}