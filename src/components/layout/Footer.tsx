import { Link } from "react-router-dom";
import { Code2, Mail, Phone, MapPin, Facebook, Linkedin, Github, Youtube } from "lucide-react";

const footerLinks = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Notices", href: "/notices" },
    { label: "Gallery", href: "/gallery" },
  ],
  resources: [
    { label: "Programming Club", href: "/wings/programming" },
    { label: "Cyber Security", href: "/wings/cybersecurity" },
    { label: "Research & Development Club", href: "/wings/research" },
    { label: "Alumni", href: "/alumni" },
    { label: "Executive Body", href: "/executives" },
  ],
  support: [
    { label: "Join CUCC", href: "/register" },
    { label: "Member Login", href: "/login" },
    { label: "Contact Us", href: "/contact" },
    { label: "Constitution", href: "/about#constitution" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src="/club-logo.jpeg" alt="CUCC Logo" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h3 className="font-display font-bold text-xl">CUCC</h3>
                <p className="text-sm text-secondary-foreground/70">City University Computer Club</p>
              </div>
            </Link>
            <p className="text-secondary-foreground/80 mb-6 max-w-md">
              Empowering students through technology, innovation, and collaboration.
              Join us in building the future of computing at City University.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Our Wings</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-secondary-foreground/80">
                  City University, Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:cucc@cityuniversity.edu.bd" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  cucc@cityuniversity.edu.bd
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+880123456789" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  +880 123 456 789
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-secondary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary-foreground/60 text-sm text-center md:text-left">
              © {new Date().getFullYear()} City University Computer Club (CUCC). All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
