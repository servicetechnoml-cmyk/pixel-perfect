import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 py-16">
      <div className="grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="TechnoML" className="h-10 w-10" />
            <span className="font-display text-xl font-bold">TechnoML</span>
          </div>
          <p className="text-sm text-primary-foreground/70 leading-relaxed">
            AI Automation & Custom Software Engineering Company helping businesses grow smarter.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[
              { label: "Home", path: "/" },
              { label: "Services", path: "/services" },
              { label: "Projects", path: "/projects" },
              { label: "Blog", path: "/blog" },
              { label: "About", path: "/about" },
              { label: "Contact", path: "/contact" },
            ].map((item) => (
              <Link key={item.path} to={item.path} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">More</h4>
          <div className="flex flex-col gap-2">
            {[
              { label: "Certifications", path: "/certifications" },
              { label: "Our Journey", path: "/history" },
            ].map((item) => (
              <Link key={item.path} to={item.path} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
            <a href="mailto:service@technoml.in" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <Mail size={16} /> service@technoml.in
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={16} /> India
            </span>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
        © {new Date().getFullYear()} TechnoML. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
