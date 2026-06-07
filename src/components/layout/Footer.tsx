const footerLinks = {
  buy: [
    { label: 'Buying Overview', href: 'https://www.openlane.com/buyers/' },
    { label: 'Explore Inventory', href: '/' },
    { label: 'Inspections', href: 'https://www.openlane.com/buyers/' },
    { label: 'Franchise Buying', href: 'https://www.openlane.com/buyers/' },
  ],
  company: [
    { label: 'Corporate', href: 'https://www.openlane.com/' },
    { label: 'Careers', href: 'https://www.openlane.com/careers' },
    { label: 'Wholesale Insights', href: 'https://www.openlane.com/' },
    { label: 'Request Demo', href: 'https://www.openlane.com/buyers/' },
  ],
  contact: [
    { label: 'Contact Us', href: 'https://www.openlane.com/' },
    { label: 'careers@openlane.com', href: 'mailto:careers@openlane.com' },
    { label: 'Privacy Notice', href: 'https://www.openlane.com/' },
  ],
};

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="min-w-0">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-openlane-blue">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith('/') ? undefined : '_blank'}
              rel={link.href.startsWith('/') ? undefined : 'noopener noreferrer'}
              className="break-words text-sm text-slate-300 transition hover:text-white"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-openlane-navy text-white">
      <div className="page-container py-10 sm:py-12">
        <div className="grid min-w-0 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0 lg:col-span-1">
            <p className="text-xl font-bold">OPENLANE</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Digital wholesale marketplace for dealers. The Block prototype — browse,
              inspect, and bid on inventory.
            </p>
          </div>
          <LinkColumn title="Buy" links={footerLinks.buy} />
          <LinkColumn title="Company" links={footerLinks.company} />
          <LinkColumn title="Contact" links={footerLinks.contact} />
        </div>
        <div className="mt-8 border-t border-openlane-navy-light pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} OPENLANE. All Rights Reserved. · Prototype for coding challenge
        </div>
      </div>
    </footer>
  );
}
