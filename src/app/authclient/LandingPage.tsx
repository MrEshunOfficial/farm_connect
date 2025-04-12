import React, { useState } from "react";
import {
  CheckCircle,
  TrendingUp,
  Shield,
  DollarSign,
  Heart,
  Share2,
  Moon,
  Sun,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const BenefitItem = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex items-start space-x-4 p-4">
    <div className="text-emerald-600 group-hover:text-emerald-700 transition-colors">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

export const LandingPage = () => {
  return (
    <div className="container h-[98vh] bg-white dark:bg-slate-900 overflow-auto text-slate-900 dark:text-slate-100 relative">
      <div className="w-full px-4 py-16">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-extrabold mb-4 text-emerald-800 dark:text-emerald-300">
            Empowering Farmers, Transforming Lives
          </h1>
          <p className="text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
            Harvest Bridge seeks to enable farmers to effortlessly sell their
            produce, find potential partners, and access essential tools,
            fostering growth and improving their livelihoods.
          </p>
        </motion.header>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <BenefitItem
              icon={<CheckCircle className="w-8 h-8 text-emerald-600" />}
              title="Verified Farmers"
              description="Connect with trusted, verified farmers to ensure transparency, authenticity, and quality produce."
            />
            <BenefitItem
              icon={<TrendingUp className="w-8 h-8 text-emerald-600" />}
              title="Farm Insights & Analytics"
              description="Access actionable insights and analytics to enhance productivity, improve decision-making, and maximize farm profitability."
            />
            <BenefitItem
              icon={<Store className="w-8 h-8 text-emerald-600" />}
              title="Marketplace Insights"
              description="Leverage advanced analytics to monitor trends, optimize sales, and grow your marketplace presence effectively."
            />
            <BenefitItem
              icon={<Shield className="w-8 h-8 text-emerald-600" />}
              title="Secure Transactions"
              description="Buy and sell with confidence through secure transactions, advanced seller, farmer and customer protection, and dedicated support."
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 p-8 space-y-6"
          >
            <h2 className="text-3xl font-bold mb-4 text-emerald-700 dark:text-emerald-300">
              About Harvest Bridge
            </h2>

            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                Harvest Bridge was created with a clear mission: to connect
                farmers with the tools, partners, and opportunities they need to
                succeed.
              </p>
              <p>
                Our platform empowers agricultural communities by offering a
                seamless, transparent, and secure way to sell produce, access
                essential resources, and build lasting partnerships that drive
                growth.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {[
                {
                  title: "Our Mission",
                  description:
                    "To empower farmers by providing technology-driven solutions, seamless market access, and opportunities to build meaningful partnerships.",
                },
                {
                  title: "Our Vision",
                  description:
                    "To create a thriving, sustainable, and transparent agricultural ecosystem that uplifts farming communities and improves livelihoods.",
                },
                {
                  title: "Our Values",
                  description:
                    "Integrity, Innovation, Collaboration, and Sustainability—driving growth and lasting impact for farmers.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg"
                >
                  <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-4xl font-bold text-center mb-8 text-emerald-700 dark:text-emerald-300">
            Support Our Mission
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <DollarSign className="w-8 h-8 text-yellow-600" />,
                title: "Support Farmers",
                description:
                  "Your donation helps us provide technology and resources that empower farmers and improve their livelihoods.",
                buttonText: "Make a Donation",
              },
              {
                icon: <Heart className="w-8 h-8 text-red-600" />,
                title: "Share Our Cause",
                description:
                  "Spread the word and help us connect with more farmers who can benefit from our platform.",
                buttonText: "Share Now",
              },
              {
                icon: <Share2 className="w-8 h-8 text-green-600" />,
                title: "Partner with Us",
                description:
                  "Collaborate with us to create a sustainable agricultural ecosystem and uplift farming communities.",
                buttonText: "Join Us",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  {item.icon}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                  {item.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.footer
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h2 className="text-4xl font-bold mb-4 text-emerald-700 dark:text-emerald-300">
            Your Support Empowers Farming Communities
          </h2>
          <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto mb-12">
            Your contribution enables us to deliver innovative solutions that
            empower farmers, enhance agricultural practices, and drive
            sustainable growth for communities.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { value: "5+", label: "Communities Supported" },
              { value: "$10K+", label: "Funds Raised" },
              { value: "1", label: "Year(s) of Impact" },
            ].map((stat, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 dark:border-slate-700 p-8 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
              >
                <h3 className="text-4xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                  {stat.value}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.footer>
      </div>
    </div>
  );
};
