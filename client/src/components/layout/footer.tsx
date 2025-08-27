import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-gray-900">Bridge</span>
              </div>
            </Link>
            <p className="text-gray-600 max-w-md">
              The world's first AI-powered international job placement platform. Find legitimate 
              opportunities across all countries and industries with calculated success probabilities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs">
                  <a className="text-gray-600 hover:text-gray-900 transition-colors">
                    Find Jobs
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <a className="text-gray-600 hover:text-gray-900 transition-colors">
                    Create Profile
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/matches">
                  <a className="text-gray-600 hover:text-gray-900 transition-colors">
                    My Matches
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <a className="text-gray-600 hover:text-gray-900 transition-colors">
                    Pricing
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Connect
            </h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Bridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
