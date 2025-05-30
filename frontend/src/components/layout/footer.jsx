import { Github, Instagram } from 'lucide-react';
import { NeoArcadelogo } from '@/components/ui/neo-arcade-logo';
import emailjs from '@emailjs/browser';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } from '@/lib/emailjs-config';

// Componente para el icono de LinkedIn
function LinkedInIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 40} height={props.size || 40} viewBox="0 0 1024 1024" fill="currentColor" {...props}>
      <path d="M847.7 112H176.3c-35.5 0-64.3 28.8-64.3 64.3v671.4c0 35.5 28.8 64.3 64.3 64.3h671.4c35.5 0 64.3-28.8 64.3-64.3V176.3c0-35.5-28.8-64.3-64.3-64.3m0 736q-671.7-.15-671.7-.3q.15-671.7.3-671.7q671.7.15 671.7.3q-.15 671.7-.3 671.7M230.6 411.9h118.7v381.8H230.6zm59.4-52.2c37.9 0 68.8-30.8 68.8-68.8a68.8 68.8 0 1 0-137.6 0c-.1 38 30.7 68.8 68.8 68.8m252.3 245.1c0-49.8 9.5-98 71.2-98c60.8 0 61.7 56.9 61.7 101.2v185.7h118.6V584.3c0-102.8-22.2-181.9-142.3-181.9c-57.7 0-96.4 31.7-112.3 61.7h-1.6v-52.2H423.7v381.8h118.6z"/>
    </svg>
  );
}

// Componente para el icono de Mail/Contacto
function MailIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 40} height={props.size || 40} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7L4 8v10h16V8zm0-2l8-5H4zM4 8V6v12z"/>
    </svg>
  );
}

import * as React from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArcadeButton } from "@/components/ui/arcade-button";

function ContactFormPopup() {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = React.useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // EmailJS integration
    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name: form.name,
        from_email: form.email,
        message: form.message,
      },
      EMAILJS_PUBLIC_KEY
    ).then(
      (result) => {
        // Success: show sent message, reset form
        setTimeout(() => {
          setOpen(false);
          setSubmitted(false);
          setForm({ name: "", email: "", message: "" });
        }, 1200);
      },
      (error) => {
        // Error: show error, reset submitted
        setSubmitted(false);
        alert("Error sending message. Please try again later.");
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="text-gray-400 hover:text-arcade-neon-blue transition-colors">
          <MailIcon size={40} />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-arcade-dark border-2 border-arcade-neon-blue/50 rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="font-pixel text-2xl text-arcade-neon-blue mb-4 text-center">
        Any suggestions or comments? Let me know!</h2>
        {submitted ? (
          <div className="text-center text-green-400 font-pixel text-lg py-8">Message sent!</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="bg-[#18181b] border-arcade-neon-blue/30 text-white font-pixel"
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="bg-[#18181b] border-arcade-neon-blue/30 text-white font-pixel"
            />
            <Textarea
              name="message"
              placeholder="Message"
              value={form.message}
              onChange={handleChange}
              required
              className="bg-[#18181b] border-arcade-neon-blue/30 text-white font-pixel min-h-[100px]"
            />
            <ArcadeButton type="submit" className="mt-2">Send</ArcadeButton>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function Footer() {
  return (
    <footer className="bg-arcade-dark border-t-2 border-arcade-neon-blue/50 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl mb-2">
              <NeoArcadelogo size="md" />
            </h3>
           
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
           
            
            <div className="flex gap-4">
              <a href="https://github.com/Nando218" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-arcade-neon-blue transition-colors">
                <Github size={40} />
              </a>
              <a href="https://www.linkedin.com/in/fernando-de-la-torre-esperón-964a68151" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-arcade-neon-blue transition-colors">
                <LinkedInIcon size={40} />
              </a>
              <a href="https://www.instagram.com/incipit.chaos/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-arcade-neon-blue transition-colors">
                <Instagram size={40} />
              </a>
              <ContactFormPopup />
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 text-gray-500 text-sm font-pixel">
          <p>© {new Date().getFullYear()} Rewind Arcade. All Right Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
