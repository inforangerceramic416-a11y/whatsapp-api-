import React, { useState } from 'react';
import {
  Info,
  Mail,
  AlertTriangle,
  Shield,
  FileText,
  Building2,
  Phone,
  Globe,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Copy,
  ChevronRight,
  Sparkles,
  Lock,
  Headphones
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type QuickLinkSection = 'about' | 'contact' | 'disclaimer' | 'privacy' | 'terms';

export const QuickLinksView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<QuickLinkSection>('about');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const { companyProfile } = useApp();

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const navButtons: Array<{ id: QuickLinkSection; label: string; icon: any; color: string }> = [
    { id: 'about', label: 'About Us', icon: Info, color: 'text-blue-400' },
    { id: 'contact', label: 'Contact Us', icon: Phone, color: 'text-emerald-400' },
    { id: 'disclaimer', label: 'Disclaimer', icon: AlertTriangle, color: 'text-amber-400' },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield, color: 'text-purple-400' },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText, color: 'text-teal-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Legal & Company Information Center
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Official Compliance
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Quick Links: About Us, Contact, Disclaimer & Legal Policies
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Meta WhatsApp Business Cloud API compliance, customer communication policies, disclaimer, contact desk aur terms of service ki complete authenticated details.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{companyProfile.companyName || 'LAXTONE CERAMIC'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Quick Links Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {navButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = activeSubTab === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setActiveSubTab(btn.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                isActive
                  ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/40'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                    isActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-950 ' + btn.color
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {btn.label}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {btn.id === 'about' && 'Company & Tech'}
                    {btn.id === 'contact' && 'Support & Address'}
                    {btn.id === 'disclaimer' && 'Notice & Rights'}
                    {btn.id === 'privacy' && 'WhatsApp Data Policy'}
                    {btn.id === 'terms' && 'Acceptance & Usage'}
                  </div>
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  isActive ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600 opacity-50'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* DETAILS VIEW CONTENT CONTAINER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative">
        {/* SECTION 1: ABOUT US */}
        {activeSubTab === 'about' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">About Us — {companyProfile.companyName}</h3>
                  <p className="text-xs text-slate-400">Leading Ceramic Manufacturer & Meta WhatsApp Enterprise Node</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `${companyProfile.companyName}\n${companyProfile.brandTagline}\n${companyProfile.description}`,
                    'about'
                  )
                }
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
              >
                {copiedSection === 'about' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'about' ? 'Copied!' : 'Copy Info'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Who We Are</h4>
                <p>
                  <strong>{companyProfile.companyName}</strong> Morbi, Gujarat ceramic hub me sthit ek vishwasniya manufacturer aur exporter hai. Hum premium digital wall tiles, glazed vitrified tiles (GVT/PGVT), porcelain slabs, aur decorative ceramic architectural panels manufacture karte hain.
                </p>
                <p>
                  Hamara brand tagline hai: <em>"{companyProfile.brandTagline || 'Excellence in Decorative & Architectural Tiles'}"</em>. Hum modern digital printing technology, Italian pressing machinery, aur strict quality control ke sath domestic aur international markets (Gulf, Africa, Europe, Americas) me supply karte hain.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Technology & WhatsApp Cloud Platform</h4>
                <p>
                  Digital connectivity aur customer service ko top priority dete hue, humne <strong>Meta WhatsApp Business Cloud API v21.0</strong> ka direct integration kiya hai. Is platform ke jariye:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Customers ko 24/7 instant tile catalogue aur pricing share ki jaati hai.</li>
                  <li>WhatsApp Business App Mobile coexistence ke sath seamlessly live chat support provide kiya jata hai.</li>
                  <li>Click-to-WhatsApp ads ke direct leads ko instant order confirmation milta hai.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-slate-500 block text-[11px]">Industry</span>
                <span className="font-semibold text-white">{companyProfile.industry || 'Ceramic & Vitrified Tiles'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Headquarters</span>
                <span className="font-semibold text-white">Morbi Ceramic Cluster, Gujarat</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">GSTIN Registration</span>
                <span className="font-mono text-emerald-400 font-bold">{companyProfile.gstin || '24AAACL7812M1Z0'}</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: CONTACT US */}
        {activeSubTab === 'contact' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Contact Us — Helpdesk & Sales Office</h3>
                  <p className="text-xs text-slate-400">Get in touch with our factory desk & official WhatsApp executive</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `Company: ${companyProfile.companyName}\nPhone: ${companyProfile.phone}\nEmail: ${companyProfile.email}\nAddress: ${companyProfile.address}`,
                    'contact'
                  )
                }
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
              >
                {copiedSection === 'contact' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'contact' ? 'Copied!' : 'Copy Contacts'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-slate-400 text-[11px]">Customer & Sales Phone</div>
                <div className="font-mono text-white font-bold text-xs">
                  {companyProfile.phone || '+91 90992 68044'}
                </div>
                <div className="text-[10px] text-slate-500">Mon-Sat (9:00 AM - 7:30 PM)</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-slate-400 text-[11px]">Official Email Address</div>
                <div className="text-white font-bold text-xs truncate" title={companyProfile.email}>
                  {companyProfile.email || 'info.rangerceramic416@gmail.com'}
                </div>
                <div className="text-[10px] text-slate-500">Inquiries answered within 2 hrs</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="text-slate-400 text-[11px]">Web Portal</div>
                <div className="font-mono text-white font-bold text-xs">
                  {companyProfile.website || 'www.laxtoneceramic.com'}
                </div>
                <div className="text-[10px] text-slate-500">E-Catalogue & Tiles Gallery</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-slate-400 text-[11px]">Factory / Office Address</div>
                <div className="text-white font-semibold text-xs leading-snug">
                  {companyProfile.address || '8-A National Highway, Morbi, Gujarat 363642, India'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Need priority wholesale quotation or dealership tie-up? Connect directly via WhatsApp chat.</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: DISCLAIMER */}
        {activeSubTab === 'disclaimer' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Disclaimer & Limitation of Liability</h3>
                  <p className="text-xs text-slate-400">Important legal notice regarding WhatsApp communications & product catalogues</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `DISCLAIMER: The information provided on this WhatsApp platform and web panel by ${companyProfile.companyName} is for general informational and trade purpose only...`,
                    'disclaimer'
                  )
                }
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
              >
                {copiedSection === 'disclaimer' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'disclaimer' ? 'Copied!' : 'Copy Disclaimer'}</span>
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wide">1. Product Shades & Variation Notice</h4>
                <p>
                  Tiles catalogue images, digital previews aur 3D renders computer/mobile screens par display hote samay display brightness aur color resolution ke kaaran actual physical ceramic tile se halka vary kar sakte hain. Production batch shade variations (shade/tone and calibration differences) ceramic industry ke standard tolerances ke antargat aate hain. Customers ko advise kiya jata hai ki final dispatch se pehle physical box sample inspect karein.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wide">2. WhatsApp Pricing & Quotation Validity</h4>
                <p>
                  WhatsApp messages, chatbots, ya automated quotations me share ki gayi rates (per sq. ft. ya per box) market raw material prices, gas fuel tariffs, aur freight fluctuations ke aadhar par change ho sakti hain. Koi bhi quotation tab tak formal contract nahi maana jayega jab tak official Proforma Invoice (PI) generate na ho jaye.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wide">3. Meta API & Third-Party Service Disclaimer</h4>
                <p>
                  Yeh WhatsApp service Meta Cloud API ke infrastructure par run karti hai. Internet bandwidth issues, Meta server maintenance, ya local carrier outages ke dauran delayed message delivery ke liye hum responsible nahi honge, yadyapi hamara system highest uptime provide karne ke liye design kiya gaya hai.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: PRIVACY POLICY */}
        {activeSubTab === 'privacy' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Privacy Policy — WhatsApp Cloud API Compliance</h3>
                  <p className="text-xs text-slate-400">Strict adherence to Meta data privacy rules and Indian DPDP Act standards</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `PRIVACY POLICY: We collect customer mobile numbers and message queries strictly for order fulfillment and catalogue delivery on WhatsApp...`,
                    'privacy'
                  )
                }
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
              >
                {copiedSection === 'privacy' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'privacy' ? 'Copied!' : 'Copy Privacy Policy'}</span>
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>{companyProfile.companyName}</strong> aapki privacy ka pura aadar karta hai. Yeh policy batati hai ki jab aap hamare WhatsApp number par message karte hain ya hamare Click-to-WhatsApp ads ke zariye connect hote hain to aapka data kaise surakshit rakha jata hai:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-400" /> Data Collection Purpose
                  </h4>
                  <p className="text-slate-400">
                    Aapka contact number, name aur chat requirements sirf aapke requested tile samples, quotation, invoice status aur delivery tracking provide karne ke liye use hoti hain.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" /> No Third-Party Data Sale
                  </h4>
                  <p className="text-slate-400">
                    Hum kisi bhi customer ya distributor ka mobile number kisi bhi teesre paksh (third-party advertiser) ko rent, sell ya share nahi karte hain.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white">Opt-In & Instant Unsubscribe (STOP)</h4>
                <p>
                  Aap kabhi bhi WhatsApp par <strong>"STOP"</strong> ya <strong>"UNSUBSCRIBE"</strong> bhej kar automated broadcast messages se bahar nikal sakte hain. Hamara system aapke request ko turant process karta hai.
                </p>
              </div>

              <div className="p-4 bg-purple-950/30 border border-purple-500/30 rounded-2xl text-[11px] text-purple-300">
                🔒 Data Encryption: Sabhi customer conversations Google Cloud Firestore par TLS 1.3 in-transit aur AES-256 encryption ke sath surakshit hain.
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: TERMS & CONDITIONS */}
        {activeSubTab === 'terms' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Terms & Conditions of Service</h3>
                  <p className="text-xs text-slate-400">Commercial trade rules, WhatsApp ordering, and dispatch agreements</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `TERMS & CONDITIONS: All sales and business inquiries handled via this WhatsApp portal of ${companyProfile.companyName} are governed by the following commercial terms...`,
                    'terms'
                  )
                }
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
              >
                {copiedSection === 'terms' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'terms' ? 'Copied!' : 'Copy Terms'}</span>
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-xs">1. Scope of Agreement</h4>
                <p>
                  Hamare WhatsApp business number par messaging ya ordering initiate karne par customer in terms & conditions se sahmat hota hai. Sabhi business transactions Morbi, Gujarat jurisdiction ke antargat aate hain.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-xs">2. Payment & Dispatch Terms</h4>
                <p>
                  Industrial wholesale ceramic orders tabhi factory loading me jayenge jab bank account me advance payment confirm ho jayega (ya agreed LC / Credit terms ke mutabik). Transporter loading slips (bilty) WhatsApp par dispatch ke samay share ki jayegi.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-xs">3. Breakage in Transit & Claims</h4>
                <p>
                  Ceramic tiles brittle products hain. Transport loading me wooden pallets ya corrugated carton packing standard procedure ke mutabik ki jaati hai. Unloading ke samay 2% - 3% minor transit chip breakage ceramic trade me acceptable limit maana jata hai. Kisi bhi excessive damage claim ke liye delivery ke 24 ghante ke andar unboxing video aur bilty copy submit karna anivarya hai.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-xs">4. Fair Use of Automated WhatsApp Bot</h4>
                <p>
                  Users bot par abuse, automated script loops, ya unauthorized scraping nahi karenge. Kisi bhi inappropriate behavior par user number platform se block kiya ja sakta hai.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
