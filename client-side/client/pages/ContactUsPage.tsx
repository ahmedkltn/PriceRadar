import { Navbar } from "@/components/landing";
import { Footer } from "@/components/landing";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const offices = [
  {
    id: 1,
    city: "Tunis",
    address: ["Centre Urbain Nord", "1082 Tunis, Tunisia"],
  },
  {
    id: 2,
    city: "Sousse",
    address: ["Avenue Habib Bourguiba", "4000 Sousse, Tunisia"],
  },
  {
    id: 3,
    city: "Sfax",
    address: ["Route de l'Aéroport", "3029 Sfax, Tunisia"],
  },
  { 
    id: 4, 
    city: "Nabeul", 
    address: ["Zone Touristique", "8000 Nabeul, Tunisia"] 
  },
];

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="overflow-hidden pt-20">
        {/* Header */}
        <div className="bg-background">
          <div className="py-24 lg:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Get in <span className="text-primary">touch</span>
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-3xl">
                Have questions about our products or services? We're here to
                help. Reach out to our team and we'll get back to you as soon as
                possible.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Contact section */}
        <section
          className="relative bg-background"
          aria-labelledby="contact-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-card border border-border/50 rounded-2xl overflow-hidden">
              <h2 id="contact-heading" className="sr-only">
                Contact us
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Contact information */}
                <div className="relative overflow-hidden py-10 px-6 bg-gradient-to-b from-secondary/20 to-secondary/10 sm:px-10 xl:p-12 border-r border-border/50">
                  <h3 className="text-lg font-medium text-foreground">
                    Contact information
                  </h3>
                  <p className="mt-6 text-base text-muted-foreground max-w-3xl">
                    Our support team is available to help you with any questions
                    about our products, pricing, or technical issues.
                  </p>
                  <dl className="mt-8 space-y-6">
                    <dt>
                      <span className="sr-only">Phone number</span>
                    </dt>
                    <dd className="flex text-base text-foreground">
                      <Phone
                        className="flex-shrink-0 w-6 h-6 text-primary"
                        aria-hidden="true"
                      />
                      <span className="ml-3">+216 (22) 944-132</span>
                    </dd>
                    <dt>
                      <span className="sr-only">Email</span>
                    </dt>
                    <dd className="flex text-base text-foreground">
                      <Mail
                        className="flex-shrink-0 w-6 h-6 text-primary"
                        aria-hidden="true"
                      />
                      <span className="ml-3">support@priceradar.com</span>
                    </dd>
                  </dl>
                  {/* <ul role="list" className="mt-8 flex space-x-12">
                    <li>
                      <a className="text-purple-200 hover:text-purple-100" href="#">
                        <span className="sr-only">Facebook</span>
                        <svg
                          className="w-7 h-7"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a className="text-purple-200 hover:text-purple-100" href="#">
                        <span className="sr-only">Twitter</span>
                        <svg
                          className="w-7 h-7"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a className="text-purple-200 hover:text-purple-100" href="#">
                        <span className="sr-only">LinkedIn</span>
                        <svg
                          className="w-7 h-7"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul> */}
                </div>

                {/* Contact form */}
                <div className="py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12 bg-card">
                  <h3 className="text-lg font-medium text-foreground">
                    Send us a message
                  </h3>
                  <form
                    action="#"
                    method="POST"
                    className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
                  >
                    <div>
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-foreground"
                      >
                        First name
                      </label>
                      <div className="mt-1">
                        <Input
                          type="text"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="py-3 px-4 block w-full bg-muted/50 border-border text-foreground focus:ring-primary focus:border-primary rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium text-foreground"
                      >
                        Last name
                      </label>
                      <div className="mt-1">
                        <Input
                          type="text"
                          name="last-name"
                          id="last-name"
                          autoComplete="family-name"
                          className="py-3 px-4 block w-full bg-muted/50 border-border text-foreground focus:ring-primary focus:border-primary rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground"
                      >
                        Email
                      </label>
                      <div className="mt-1">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className="py-3 px-4 block w-full bg-muted/50 border-border text-foreground focus:ring-primary focus:border-primary rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-foreground"
                        >
                          Phone
                        </label>
                        <span
                          id="phone-optional"
                          className="text-sm text-muted-foreground"
                        >
                          Optional
                        </span>
                      </div>
                      <div className="mt-1">
                        <Input
                          type="text"
                          name="phone"
                          id="phone"
                          autoComplete="tel"
                          className="py-3 px-4 block w-full bg-muted/50 border-border text-foreground focus:ring-primary focus:border-primary rounded-md"
                          aria-describedby="phone-optional"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-foreground"
                      >
                        Subject
                      </label>
                      <div className="mt-1">
                        <Input
                          type="text"
                          name="subject"
                          id="subject"
                          className="py-3 px-4 block w-full bg-muted/50 border-border text-foreground focus:ring-primary focus:border-primary rounded-md"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="flex justify-between">
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-foreground"
                        >
                          Message
                        </label>
                        <span
                          id="message-max"
                          className="text-sm text-muted-foreground"
                        >
                          Max. 500 characters
                        </span>
                      </div>
                      <div className="mt-1">
                        <Textarea
                          id="message"
                          name="message"
                          rows={4}
                          className="py-3 px-4 block w-full bg-muted/50 border-border text-foreground focus:ring-primary focus:border-primary rounded-md"
                          aria-describedby="message-max"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2 sm:flex sm:justify-end">
                      <Button
                        type="submit"
                        className="mt-2 w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact grid */}
        <section aria-labelledby="offices-heading" className="bg-background">
          <div className="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <motion.h2
              id="offices-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-extrabold text-foreground"
            >
              Our <span className="text-primary">offices</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 text-lg text-muted-foreground max-w-3xl"
            >
              We have offices around the world to serve you better. Visit us or
              contact the nearest location for local support.
            </motion.p>
            <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {offices.map((office, index) => (
                <motion.div
                  key={office.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors"
                >
                  <h3 className="text-lg font-medium text-foreground">
                    {office.city}
                  </h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    {office.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
