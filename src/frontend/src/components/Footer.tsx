import { BookOpen } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "oklch(0.245 0.095 248)" }}
              >
                <BookOpen className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                EduLearn
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering learners worldwide with quality education.
            </p>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">
              Courses
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Programming</li>
              <li>Design</li>
              <li>Business</li>
              <li>Science</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Help Center</li>
              <li>Community</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>
            © {currentYear}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </span>
          <span>EduLearn — Learn. Grow. Succeed.</span>
        </div>
      </div>
    </footer>
  );
}
